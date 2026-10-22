import { describe, expect, it } from 'vitest'
import { clientFormSchema, clientFormToRow, clientRowToForm, parseMoney } from './client'
import { inviteFormSchema } from './user'
import { parseSettings, workspaceFormSchema, workspaceFormToRow, workspaceRowToForm } from './workspace'

describe('schema de cliente', () => {
  it('exige nome e valida CNPJ', () => {
    const base = clientRowToForm()
    const empty = clientFormSchema.safeParse(base)
    expect(empty.success).toBe(false)
    expect(empty.error?.issues[0].message).toBe('Campo obrigatório')

    const bad = clientFormSchema.safeParse({ ...base, name: 'Sétima', cnpj: '11.222.333/0001-82' })
    expect(bad.success).toBe(false)
    expect(bad.error?.issues[0].message).toBe('CNPJ inválido.')
  })

  it('converte formulário em linha do banco', () => {
    const parsed = clientFormSchema.parse({
      ...clientRowToForm(),
      name: 'Sétima',
      cnpj: '11.222.333/0001-81',
      contract_value_brl: '12.500,00',
      billing_day: '10',
      started_at: '01/11/2026',
      main_contact_email: 'Fulano@Demo.Example',
    })
    const row = clientFormToRow(parsed)
    expect(row).toMatchObject({
      cnpj: '11222333000181',
      contract_value_brl: 12500,
      billing_day: 10,
      started_at: '2026-11-01',
      main_contact_email: 'fulano@demo.example',
      legal_name: null,
    })
  })

  it('lê valores monetários BR e US', () => {
    expect(parseMoney('1.234,56')).toBe(1234.56)
    expect(parseMoney('1234.56')).toBe(1234.56)
    expect(parseMoney('')).toBeNull()
  })
})

describe('schema de workspace', () => {
  const valid = () => ({
    ...workspaceRowToForm(undefined, { client_id: '00000000-0000-4000-8000-000000000001' }),
    name: 'Sétima',
    slug: 'setima',
  })

  it('padrões completos com feriados nacionais e parâmetro derivado do app', () => {
    const s = parseSettings({})
    expect(s.business_days).toEqual([1, 2, 3, 4, 5])
    expect(s.score_thresholds).toEqual({ hot: 70, warm: 40 })
    expect(s.holidays.length).toBeGreaterThanOrEqual(20)
    expect(s.tracking_param).toBe('cercoteste')
  })

  it('converte feriados dd/mm/aaaa e listas de páginas', () => {
    const v = workspaceFormSchema.parse({ ...valid(), holidays_text: '25/01/2026\n01/01/2026', high_intent_paths_text: '/precos\n/cases/*' })
    const row = workspaceFormToRow(v)
    expect(row.settings.holidays).toEqual(['2026-01-01', '2026-01-25'])
    expect(row.settings.high_intent_paths).toEqual(['/precos', '/cases/*'])
    expect(row.feature_flags).toEqual({ signal_hunter: false, apollo: false, copilot: true })
  })

  it('rejeita data inválida, slug inválido e limiar morna ≥ quente', () => {
    const r = workspaceFormSchema.safeParse({ ...valid(), slug: 'Sétima', holidays_text: '31/02/2026', score_warm: '80' })
    expect(r.success).toBe(false)
    const paths = r.error!.issues.map((i) => i.path.join('.'))
    expect(paths).toEqual(expect.arrayContaining(['slug', 'holidays_text', 'score_warm']))
  })
})

describe('schema de convite', () => {
  it('exige ao menos um workspace, exceto para ADM', () => {
    const base = { full_name: 'Bia', email: 'bia@demo.example', is_platform_admin: false, accesses: [] }
    expect(inviteFormSchema.safeParse(base).success).toBe(false)
    expect(inviteFormSchema.safeParse({ ...base, is_platform_admin: true }).success).toBe(true)
  })

  it('normaliza o e-mail', () => {
    const r = inviteFormSchema.parse({
      full_name: 'Bia',
      email: 'Bia@Demo.Example',
      is_platform_admin: false,
      accesses: [{ workspace_id: '00000000-0000-4000-8000-000000000001', role: 'bdr' }],
    })
    expect(r.email).toBe('bia@demo.example')
  })
})
