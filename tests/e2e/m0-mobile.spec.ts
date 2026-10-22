import { expect, test } from '@playwright/test'

// Navegação do app no celular (seed demo: pnpm seed:demo).
test('BDR navega pelo menu lateral no celular', async ({ page }) => {
  await page.goto('/login')
  await page.getByRole('textbox', { name: 'E-mail' }).fill('bdr@demo.example')
  await page.getByLabel('Senha', { exact: true }).fill('demo-senha-1234')
  await page.getByRole('button', { name: 'Entrar' }).click()
  await expect(page).toHaveURL(/\/w\/demo-produtora-b2b\/fila$/)

  await page.getByRole('button', { name: 'Abrir menu' }).click()
  await page.getByRole('dialog').getByRole('link', { name: 'Contas' }).click()
  await expect(page).toHaveURL(/\/contas$/)
  await expect(page.getByRole('heading', { name: 'Contas' })).toBeVisible()
  // BDR não vê Configurações
  await page.getByRole('button', { name: 'Abrir menu' }).click()
  await expect(page.getByRole('dialog').getByRole('link', { name: 'Configurações' })).toHaveCount(0)
})
