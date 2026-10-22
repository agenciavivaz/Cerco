import type { Metadata } from 'next'
import { AuditFilters } from '@/components/admin/audit-filters'
import { AuditTable } from '@/components/admin/audit-table'
import { Pagination, pageFromParams, pageRange } from '@/components/data-table/pagination'
import { PageHeader } from '@/components/page-header'
import { requirePagePlatformAdmin } from '@/lib/auth'
import { parseBRDate } from '@/lib/format'
import { t } from '@/lib/i18n'

export const metadata: Metadata = { title: t('admin.audit.title') }

type SP = { ator?: string; ws?: string; acao?: string; entidade?: string; de?: string; ate?: string; page?: string }

const UUID = /^[0-9a-f-]{36}$/i

/** Início do dia em São Paulo (UTC−3, sem horário de verão desde 2019). */
function dayStartSP(iso: string) {
  return `${iso}T00:00:00-03:00`
}

export default async function AuditPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams
  const { supabase } = await requirePagePlatformAdmin()
  const page = pageFromParams(sp.page)
  const [from, to] = pageRange(page)

  let query = supabase
    .from('audit_logs')
    .select('id, created_at, actor_id, workspace_id, action, entity_type, entity_id, diff, ip', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)
  if (sp.ator === 'sistema') query = query.is('actor_id', null)
  else if (sp.ator && UUID.test(sp.ator)) query = query.eq('actor_id', sp.ator)
  if (sp.ws && UUID.test(sp.ws)) query = query.eq('workspace_id', sp.ws)
  if (sp.acao) query = query.ilike('action', `%${sp.acao.replace(/[%_\\]/g, '')}%`)
  if (sp.entidade) query = query.eq('entity_type', sp.entidade)
  const de = sp.de ? parseBRDate(sp.de) : null
  const ate = sp.ate ? parseBRDate(sp.ate) : null
  if (de) query = query.gte('created_at', dayStartSP(de))
  if (ate) {
    const next = new Date(`${ate}T12:00:00Z`)
    next.setUTCDate(next.getUTCDate() + 1)
    query = query.lt('created_at', dayStartSP(next.toISOString().slice(0, 10)))
  }

  const [{ data, count }, { data: profiles }, { data: workspaces }] = await Promise.all([
    query,
    supabase.from('profiles').select('id, full_name, email').order('full_name'),
    supabase.from('workspaces').select('id, name').order('name'),
  ])
  const actorName = new Map((profiles ?? []).map((p) => [p.id, p.full_name || p.email]))
  const wsName = new Map((workspaces ?? []).map((w) => [w.id, w.name]))

  const rows = (data ?? []).map((r) => ({
    ...r,
    actor: r.actor_id ? (actorName.get(r.actor_id) ?? r.actor_id) : null,
    workspace: r.workspace_id ? (wsName.get(r.workspace_id) ?? r.workspace_id) : null,
  }))

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title={t('admin.audit.title')} />
      <div className="grid gap-4">
        <AuditFilters
          actors={(profiles ?? []).map((p) => ({ id: p.id, label: p.full_name || p.email }))}
          workspaces={(workspaces ?? []).map((w) => ({ id: w.id, label: w.name }))}
          values={sp}
        />
        <AuditTable rows={rows} />
        <Pagination page={page} total={count ?? 0} searchParams={sp} basePath="/admin/auditoria" />
      </div>
    </div>
  )
}
