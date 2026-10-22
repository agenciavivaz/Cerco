import type { Metadata } from 'next'
import { InviteUserDialog } from '@/components/admin/invite-user-dialog'
import { UsersTable } from '@/components/admin/users-table'
import { Pagination, pageFromParams, pageRange } from '@/components/data-table/pagination'
import { TableSearch } from '@/components/data-table/table-search'
import { PageHeader } from '@/components/page-header'
import { authStatusById } from '@/lib/admin-users'
import { requirePagePlatformAdmin } from '@/lib/auth'
import { t } from '@/lib/i18n'
import { ilikeTerm } from '@/lib/search'

export const metadata: Metadata = { title: t('admin.users.title') }

export default async function UsersPage({ searchParams }: { searchParams: Promise<{ q?: string; page?: string }> }) {
  const sp = await searchParams
  const { supabase } = await requirePagePlatformAdmin()
  const page = pageFromParams(sp.page)
  const [from, to] = pageRange(page)

  let query = supabase
    .from('profiles')
    .select('id, full_name, email, status, is_platform_admin, last_seen_at, workspace_members(role, workspaces(id, name))', {
      count: 'exact',
    })
    .order('full_name', { nullsFirst: false })
    .range(from, to)
  const term = ilikeTerm(sp.q)
  if (term) query = query.or(`full_name.ilike.${term},email.ilike.${term}`)

  const [{ data, count }, { data: workspaces }, auth] = await Promise.all([
    query,
    supabase.from('workspaces').select('id, name, clients(name)').order('name'),
    authStatusById(),
  ])

  const rows = (data ?? []).map((p) => ({
    id: p.id,
    name: p.full_name ?? '',
    email: p.email,
    status: p.status === 'disabled' ? ('disabled' as const) : auth.get(p.id)?.confirmed === false ? ('pending' as const) : ('active' as const),
    is_platform_admin: p.is_platform_admin,
    last_seen_at: p.last_seen_at ?? auth.get(p.id)?.last_sign_in_at ?? null,
    access: (p.workspace_members ?? [])
      .filter((m) => m.workspaces)
      .map((m) => ({ workspace: m.workspaces!.name, role: m.role })),
  }))

  const workspaceOptions = (workspaces ?? []).map((w) => ({
    id: w.id,
    label: w.clients?.name ? `${w.clients.name} · ${w.name}` : w.name,
  }))

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title={t('admin.users.title')} actions={<InviteUserDialog workspaces={workspaceOptions} />} />
      <div className="grid gap-4">
        <TableSearch />
        <UsersTable rows={rows} />
        <Pagination page={page} total={count ?? 0} searchParams={sp} basePath="/admin/usuarios" />
      </div>
    </div>
  )
}
