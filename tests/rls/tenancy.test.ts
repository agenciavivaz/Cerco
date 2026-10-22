import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { anon, createUser, runId, service, signIn, type Client } from './helpers'

// RF-1.3 / CA do módulo M1: um BDR do workspace A não lê nada do workspace B,
// nem chamando o Supabase direto com o próprio token.

let adminC: Client
let bdrA: Client
let managerB: Client
const ids = {} as {
  admin: string
  bdrA: string
  managerB: string
  outsider: string
  client: string
  wsA: string
  wsB: string
}
let outsiderEmail = ''

beforeAll(async () => {
  const admin = await createUser('admin', { admin: true })
  const a = await createUser('bdr-a')
  const b = await createUser('manager-b')
  const o = await createUser('outsider')
  Object.assign(ids, { admin: admin.id, bdrA: a.id, managerB: b.id, outsider: o.id })
  outsiderEmail = o.email

  adminC = await signIn(admin.email)

  // O ADM cria tudo com o próprio token (prova que as policies de escrita do ADM funcionam).
  const { data: client, error: ce } = await adminC.from('clients').insert({ name: `Cliente ${runId}` }).select('id').single()
  if (ce) throw ce
  ids.client = client.id
  const { data: ws, error: we } = await adminC
    .from('workspaces')
    .insert([
      { client_id: client.id, name: 'A', slug: `a-${runId}` },
      { client_id: client.id, name: 'B', slug: `b-${runId}` },
    ])
    .select('id, slug')
  if (we) throw we
  ids.wsA = ws.find((w) => w.slug.startsWith('a-'))!.id
  ids.wsB = ws.find((w) => w.slug.startsWith('b-'))!.id
  const { error: me } = await adminC.from('workspace_members').insert([
    { workspace_id: ids.wsA, user_id: a.id, role: 'bdr' },
    { workspace_id: ids.wsB, user_id: b.id, role: 'manager' },
  ])
  if (me) throw me

  bdrA = await signIn(a.email)
  managerB = await signIn(b.email)
})

afterAll(async () => {
  if (ids.wsA) await service.from('workspaces').delete().in('id', [ids.wsA, ids.wsB])
  if (ids.client) await service.from('clients').delete().eq('id', ids.client)
  for (const id of [ids.admin, ids.bdrA, ids.managerB, ids.outsider]) if (id) await service.auth.admin.deleteUser(id)
})

describe('isolamento entre workspaces', () => {
  it('BDR de A só enxerga o workspace A', async () => {
    const { data } = await bdrA.from('workspaces').select('id')
    expect(data?.map((w) => w.id)).toEqual([ids.wsA])
  })

  it('BDR de A não lê o workspace B nem buscando pelo id', async () => {
    const { data } = await bdrA.from('workspaces').select('id').eq('id', ids.wsB)
    expect(data).toEqual([])
  })

  it('BDR de A só vê membros do workspace A', async () => {
    const { data } = await bdrA.from('workspace_members').select('workspace_id, user_id')
    expect(data?.every((m) => m.workspace_id === ids.wsA)).toBe(true)
    expect(data?.some((m) => m.user_id === ids.managerB)).toBe(false)
  })

  it('BDR de A não lê o perfil de quem só está em B', async () => {
    const { data } = await bdrA.from('profiles').select('id').eq('id', ids.managerB)
    expect(data).toEqual([])
    const { data: self } = await bdrA.from('profiles').select('id').eq('id', ids.bdrA)
    expect(self).toHaveLength(1)
  })

  it('manager de B também não enxerga A', async () => {
    const { data } = await managerB.from('workspaces').select('id')
    expect(data?.map((w) => w.id)).toEqual([ids.wsB])
  })

  it('ADM da plataforma enxerga os dois', async () => {
    const { data } = await adminC.from('workspaces').select('id').in('id', [ids.wsA, ids.wsB])
    expect(data).toHaveLength(2)
  })
})

describe('tabelas de plataforma', () => {
  it('não-ADM não lê clientes, configurações nem auditoria', async () => {
    for (const table of ['clients', 'platform_settings', 'audit_logs'] as const) {
      const { data } = await bdrA.from(table).select('*').limit(5)
      expect(data, table).toEqual([])
    }
  })

  it('anônimo não lê nada', async () => {
    const a = anon()
    for (const table of ['clients', 'workspaces', 'profiles', 'workspace_members', 'audit_logs'] as const) {
      const { data } = await a.from(table).select('*').limit(1)
      expect(data ?? [], table).toEqual([])
    }
  })
})

describe('escrita bloqueada para não-ADM', () => {
  it('BDR não se adiciona ao workspace B', async () => {
    const { error } = await bdrA.from('workspace_members').insert({ workspace_id: ids.wsB, user_id: ids.bdrA, role: 'manager' })
    expect(error).not.toBeNull()
  })

  it('BDR não se promove a manager no próprio workspace', async () => {
    const { data } = await bdrA
      .from('workspace_members')
      .update({ role: 'manager' })
      .eq('workspace_id', ids.wsA)
      .eq('user_id', ids.bdrA)
      .select()
    expect(data ?? []).toEqual([])
    const { data: row } = await service.from('workspace_members').select('role').eq('workspace_id', ids.wsA).eq('user_id', ids.bdrA).single()
    expect(row?.role).toBe('bdr')
  })

  it('BDR não cria cliente nem workspace', async () => {
    const c = await bdrA.from('clients').insert({ name: 'x' })
    expect(c.error).not.toBeNull()
    const w = await bdrA.from('workspaces').insert({ client_id: ids.client, name: 'x', slug: `x-${runId}` })
    expect(w.error).not.toBeNull()
  })

  it('BDR não se torna ADM da plataforma', async () => {
    const { error } = await bdrA.from('profiles').update({ is_platform_admin: true }).eq('id', ids.bdrA)
    expect(error?.code).toBe('42501')
    const { data } = await service.from('profiles').select('is_platform_admin').eq('id', ids.bdrA).single()
    expect(data?.is_platform_admin).toBe(false)
  })

  it('BDR edita o próprio nome', async () => {
    const { error } = await bdrA.from('profiles').update({ full_name: 'BDR A' }).eq('id', ids.bdrA)
    expect(error).toBeNull()
  })

  it('BDR não edita o workspace', async () => {
    const { data } = await bdrA.from('workspaces').update({ name: 'hack' }).eq('id', ids.wsA).select()
    expect(data ?? []).toEqual([])
  })
})

describe('usuário desativado e sem vínculo', () => {
  it('usuário sem vínculo não vê nenhum workspace', async () => {
    const c = await signIn(outsiderEmail)
    const { data } = await c.from('workspaces').select('id')
    expect(data).toEqual([])
  })

  it('membro desativado perde o acesso mesmo com token válido', async () => {
    const { error: se } = await service.from('workspace_members').insert({ workspace_id: ids.wsA, user_id: ids.outsider, role: 'viewer' })
    expect(se).toBeNull()
    const c = await signIn(outsiderEmail)
    expect((await c.from('workspaces').select('id')).data).toHaveLength(1)
    await service.from('profiles').update({ status: 'disabled' }).eq('id', ids.outsider)
    expect((await c.from('workspaces').select('id')).data).toEqual([])
  })
})

describe('auditoria', () => {
  it('registra ações do ADM com o ator', async () => {
    const { data } = await adminC
      .from('audit_logs')
      .select('action, actor_id, entity_id')
      .eq('entity_type', 'workspace')
      .eq('entity_id', ids.wsA)
    expect(data?.some((r) => r.action === 'workspace.insert' && r.actor_id === ids.admin)).toBe(true)
  })

  it('registra membros com o workspace', async () => {
    const { data } = await adminC.from('audit_logs').select('workspace_id').eq('action', 'workspace_member.insert').eq('entity_id', ids.bdrA)
    expect(data?.[0]?.workspace_id).toBe(ids.wsA)
  })
})
