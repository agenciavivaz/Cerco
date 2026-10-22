/**
 * Cria (por convite) ou promove o primeiro platform_admin.
 *   pnpm admin:bootstrap pessoa@empresa.com.br
 *   ENV_FILE=.env.production.local pnpm admin:bootstrap pessoa@empresa.com.br   (projeto hospedado)
 * Imprime um link de acesso de uso único para definir a senha.
 */
import { serviceClient } from './_supabase'

async function main() {
  const email = process.argv[2]?.trim().toLowerCase()
  if (!email || !email.includes('@')) {
    console.error('Uso: pnpm admin:bootstrap <email>')
    process.exit(1)
  }
  const { client } = serviceClient()
  const appUrl = (process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000').replace(/\/$/, '')
  const next = '/definir-senha'

  let { data: profile } = await client.from('profiles').select('id').eq('email', email).maybeSingle()
  let type: 'invite' | 'magiclink' = 'magiclink'
  if (!profile) {
    type = 'invite'
  }
  const { data: link, error } = await client.auth.admin.generateLink({
    type,
    email,
    options: { redirectTo: `${appUrl}/auth/callback?next=${next}` },
  })
  if (error) throw error
  ;({ data: profile } = await client.from('profiles').select('id').eq('email', email).maybeSingle())
  if (!profile) throw new Error('Perfil não foi criado (verifique o trigger on_auth_user_created).')

  const { error: e2 } = await client.from('profiles').update({ is_platform_admin: true, status: 'active' }).eq('id', profile.id)
  if (e2) throw e2
  await client.from('audit_logs').insert({ action: 'user.bootstrap_admin', entity_type: 'profile', entity_id: profile.id, diff: { email } })

  const params = new URLSearchParams({ token_hash: link.properties.hashed_token, type, next })
  console.log(`✔ ${email} é platform_admin.`)
  console.log(`Link de acesso (uso único): ${appUrl}/auth/callback?${params.toString()}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
