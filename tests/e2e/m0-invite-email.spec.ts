import { expect, test } from '@playwright/test'
import { runId, service } from '../rls/helpers'

// Convite pelo e-mail padrão do Supabase (o mesmo do botão "Invite user" do painel):
// o link volta para a Site URL com o token no #hash e precisa terminar em "Definir senha".
const MAILPIT = 'http://127.0.0.1:54324'
const email = `convite-${runId}@e2e.example`

test.afterAll(async () => {
  const { data } = await service.from('profiles').select('id').eq('email', email).maybeSingle()
  if (data) await service.auth.admin.deleteUser(data.id)
})

async function inviteLink(): Promise<string> {
  for (let i = 0; i < 20; i++) {
    const res = await fetch(`${MAILPIT}/api/v1/search?query=${encodeURIComponent(`to:${email}`)}`)
    const { messages } = (await res.json()) as { messages: Array<{ ID: string }> }
    if (messages?.length) {
      const msg = (await (await fetch(`${MAILPIT}/api/v1/message/${messages[0].ID}`)).json()) as { HTML: string; Text: string }
      const href = (msg.HTML || msg.Text).match(/href="([^"]+verify[^"]+)"/)?.[1] ?? msg.Text.match(/(http\S+verify\S+)/)?.[1]
      if (href) return href.replace(/&amp;/g, '&')
    }
    await new Promise((r) => setTimeout(r, 500))
  }
  throw new Error('e-mail de convite não chegou ao Mailpit')
}

test('convite por e-mail padrão leva a "Definir senha"', async ({ page }) => {
  const { error } = await service.auth.admin.inviteUserByEmail(email, {
    data: { full_name: 'Convidada E2E' },
    redirectTo: 'http://localhost:3000/',
  })
  expect(error).toBeNull()

  await page.goto(await inviteLink())
  await expect(page).toHaveURL(/\/definir-senha/)
  await expect(page.getByLabel('Seu nome')).toHaveValue('Convidada E2E')
})
