/**
 * Seed de demonstração (PRD §16.1). SÓ dados fictícios, domínios .example.
 * Idempotente. Por segurança roda só contra o Supabase local, a menos que se passe --force.
 * Cada marco estende este seed com os dados que passam a existir (DEC-006).
 */
import { isLocal, serviceClient } from './_supabase'
import { defaultHolidays } from '../lib/domain/holidays'

const PASSWORD = 'demo-senha-1234'
const USERS = [
  { email: 'admin@demo.example', name: 'Ana ADM (demo)', admin: true, role: null },
  { email: 'gestor@demo.example', name: 'Gustavo Gestor (demo)', admin: false, role: 'manager' },
  { email: 'bdr@demo.example', name: 'Bruna BDR (demo)', admin: false, role: 'bdr' },
  { email: 'leitura@demo.example', name: 'Lia Leitura (demo)', admin: false, role: 'viewer' },
] as const

async function main() {
  const { url, client } = serviceClient()
  if (!isLocal(url) && !process.argv.includes('--force')) {
    console.error(`Recusado: ${url} não é local. Use --force para semear um projeto hospedado.`)
    process.exit(1)
  }

  // Cliente e workspace
  let { data: demo } = await client.from('clients').select('id').eq('name', 'Demo').maybeSingle()
  if (!demo) {
    const { data, error } = await client
      .from('clients')
      .insert({ name: 'Demo', status: 'design_partner', notes: 'Cliente fictício de demonstração.' })
      .select('id')
      .single()
    if (error) throw error
    demo = data
  }

  let { data: ws } = await client.from('workspaces').select('id').eq('slug', 'demo-produtora-b2b').maybeSingle()
  if (!ws) {
    const { data, error } = await client
      .from('workspaces')
      .insert({
        client_id: demo.id,
        name: 'Demo — Produtora B2B',
        slug: 'demo-produtora-b2b',
        settings: {
          business_days: [1, 2, 3, 4, 5],
          holidays: defaultHolidays(),
          score_thresholds: { hot: 70, warm: 40 },
          frequency_target_weekly: null,
          high_intent_paths: ['/precos', '/cases/*', '/calculadora'],
          signal_hunter: { weekday: 1, hour: 6, include_t2: false },
          brief: { weekday: 1, hour: 7 },
        },
        feature_flags: { copilot: true, signal_hunter: false, apollo: false },
      })
      .select('id')
      .single()
    if (error) throw error
    ws = data
  }

  // Usuários
  const { data: list } = await client.auth.admin.listUsers({ perPage: 1000 })
  for (const u of USERS) {
    let id = list?.users.find((x) => x.email === u.email)?.id
    if (!id) {
      const { data, error } = await client.auth.admin.createUser({
        email: u.email,
        password: PASSWORD,
        email_confirm: true,
        user_metadata: { full_name: u.name },
      })
      if (error) throw error
      id = data.user!.id
    }
    await client.from('profiles').update({ full_name: u.name, is_platform_admin: u.admin }).eq('id', id)
    if (u.role) {
      const { error } = await client
        .from('workspace_members')
        .upsert({ workspace_id: ws.id, user_id: id, role: u.role }, { onConflict: 'workspace_id,user_id' })
      if (error) throw error
    }
  }

  console.log('✔ Seed demo pronto.')
  console.log(`  Workspace: /w/demo-produtora-b2b`)
  console.log(`  Usuários (senha "${PASSWORD}"): ${USERS.map((u) => u.email).join(', ')}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
