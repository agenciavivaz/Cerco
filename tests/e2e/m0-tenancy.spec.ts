import { expect, test, type Page } from '@playwright/test'
import { createUser, runId, service } from '../rls/helpers'

// Marco M0 — pronto quando: o ADM cria o cliente "Sétima" com os workspaces Sétima e Brandspot,
// convida um BDR, e o BDR só vê o workspace dele.

const clientName = `Sétima ${runId}`
const wsSetima = `Sétima ${runId}`
const wsBrandspot = `Brandspot ${runId}`
const slugSetima = `setima-${runId}`
const slugBrandspot = `brandspot-${runId}`
const bdrEmail = `bdr-${runId}@e2e.example`
const bdrPassword = 'senha-do-bdr-123'

let adminEmail = ''
const created: string[] = []

test.beforeAll(async () => {
  const admin = await createUser('e2e-admin', { admin: true })
  adminEmail = admin.email
  created.push(admin.id)
})

test.afterAll(async () => {
  const { data: bdr } = await service.from('profiles').select('id').eq('email', bdrEmail).maybeSingle()
  if (bdr) created.push(bdr.id)
  await service.from('workspaces').delete().in('slug', [slugSetima, slugBrandspot])
  await service.from('clients').delete().eq('name', clientName)
  for (const id of created) await service.auth.admin.deleteUser(id)
})

async function login(page: Page, email: string, password: string) {
  await page.goto('/login')
  await page.getByRole('textbox', { name: 'E-mail' }).fill(email)
  await page.getByLabel('Senha', { exact: true }).fill(password)
  await page.getByRole('button', { name: 'Entrar' }).click()
}

test('ADM cria Sétima + 2 workspaces, convida BDR; BDR só vê o workspace dele', async ({ page, browser }) => {
  await login(page, adminEmail, 'senha-de-teste-123')
  await expect(page).toHaveURL(/\/admin\/clientes/)
  await expect(page.getByText('Modo ADM')).toBeVisible()

  // ADM-1: cliente
  await page.getByRole('link', { name: 'Novo cliente' }).click()
  await expect(page).toHaveURL(/\/admin\/clientes\/novo/)
  await page.getByLabel('Nome', { exact: true }).fill(clientName)
  await page.getByLabel('CNPJ').fill('11.222.333/0001-82')
  await page.getByRole('button', { name: 'Criar' }).click()
  await expect(page.getByText('CNPJ inválido.')).toBeVisible()
  await page.getByLabel('CNPJ').fill('')
  await page.getByRole('button', { name: 'Criar' }).click()
  await expect(page.getByRole('heading', { name: clientName })).toBeVisible()

  // ADM-2: dois workspaces sob o cliente (slug gerado a partir do nome)
  for (const [name, slug] of [
    [wsSetima, slugSetima],
    [wsBrandspot, slugBrandspot],
  ]) {
    await page.goto('/admin/clientes')
    await page.getByRole('link', { name: clientName }).click()
    await page.getByRole('link', { name: 'Novo workspace' }).click()
    await expect(page).toHaveURL(/\/admin\/workspaces\/novo\?cliente=/)
    await page.getByLabel('Nome', { exact: true }).fill(name)
    await expect(page.getByLabel('Slug')).toHaveValue(slug)
    await page.getByRole('button', { name: 'Criar' }).click()
    await expect(page.getByRole('heading', { name })).toBeVisible()
  }

  // ADM-3: convite do BDR só para o workspace Sétima
  await page.goto('/admin/usuarios')
  await page.getByRole('button', { name: 'Convidar usuário' }).click()
  const dialog = page.getByRole('dialog')
  await dialog.getByLabel('Nome').fill('Bruno BDR')
  await dialog.getByLabel('E-mail').fill(bdrEmail)
  await dialog.getByRole('button', { name: 'Adicionar acesso' }).click()
  await dialog.getByRole('combobox', { name: 'Workspace' }).click()
  await page.getByRole('option', { name: `${clientName} · ${wsSetima}` }).click()
  await dialog.getByRole('combobox', { name: 'Papel' }).click()
  await page.getByRole('option', { name: 'BDR' }).click()
  await dialog.getByRole('button', { name: 'Convidar usuário' }).click()
  await expect(page.getByText(`Convite criado para ${bdrEmail}.`)).toBeVisible()
  await page.keyboard.press('Escape')

  // Link de acesso copiável (DEC-008)
  await page.getByRole('link', { name: /Bruno BDR/ }).click()
  await expect(page.getByText(wsSetima, { exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Gerar novo link de acesso' }).click()
  const link = await page.getByTestId('invite-link').inputValue()
  expect(link).toContain('/auth/callback?token_hash=')

  // Auditoria registra o convite
  await page.goto('/admin/auditoria')
  await expect(page.getByText('user.invite').first()).toBeVisible()

  // BDR: aceita o convite, define senha, cai na Fila do dia do Sétima
  const bdrContext = await browser.newContext()
  const bdr = await bdrContext.newPage()
  await bdr.goto(link)
  await expect(bdr).toHaveURL(/\/definir-senha/)
  await bdr.getByLabel('Nova senha').fill(bdrPassword)
  await bdr.getByLabel('Confirmar senha').fill(bdrPassword)
  await bdr.getByRole('button', { name: 'Salvar senha e continuar' }).click()
  await expect(bdr).toHaveURL(new RegExp(`/w/${slugSetima}/fila$`))
  await expect(bdr.getByRole('heading', { name: 'Fila do dia' })).toBeVisible()

  // Seletor de workspace: só o Sétima
  await bdr.getByRole('button', { name: 'Trocar de workspace' }).click()
  const items = bdr.getByRole('menuitem')
  await expect(items).toHaveCount(1)
  await expect(items.first()).toContainText(wsSetima)
  await bdr.keyboard.press('Escape')

  // Sem acesso ao Brandspot nem à Área ADM
  const res = await bdr.goto(`/w/${slugBrandspot}`)
  expect(res?.status()).toBe(404)
  await bdr.goto('/admin')
  await expect(bdr).not.toHaveURL(/\/admin/)

  // Login seguinte por senha funciona
  await bdrContext.clearCookies()
  await login(bdr, bdrEmail, bdrPassword)
  await expect(bdr).toHaveURL(new RegExp(`/w/${slugSetima}/fila$`))
  await bdrContext.close()

  // ADM entra no workspace com banner
  await page.goto('/admin/workspaces')
  await page.getByRole('link', { name: wsBrandspot }).click()
  await page.getByRole('button', { name: 'Entrar no workspace' }).click()
  await expect(page).toHaveURL(new RegExp(`/w/${slugBrandspot}/inicio$`))
  await expect(page.getByText('Você está neste workspace como ADM da plataforma.')).toBeVisible()
})
