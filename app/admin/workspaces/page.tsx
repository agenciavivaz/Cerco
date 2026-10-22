import type { Metadata } from 'next'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { WorkspacesTable } from '@/components/admin/workspaces-table'
import { Pagination, pageFromParams, pageRange } from '@/components/data-table/pagination'
import { TableSearch } from '@/components/data-table/table-search'
import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { requirePagePlatformAdmin } from '@/lib/auth'
import { t } from '@/lib/i18n'
import { ilikeTerm } from '@/lib/search'

export const metadata: Metadata = { title: t('admin.workspaces.title') }

export default async function WorkspacesPage({ searchParams }: { searchParams: Promise<{ q?: string; page?: string }> }) {
  const sp = await searchParams
  const { supabase } = await requirePagePlatformAdmin()
  const page = pageFromParams(sp.page)
  const [from, to] = pageRange(page)

  let query = supabase
    .from('workspaces')
    .select('id, name, slug, status, timezone, created_at, clients(id, name), workspace_members(count)', { count: 'exact' })
    .order('name')
    .range(from, to)
  const term = ilikeTerm(sp.q)
  if (term) query = query.or(`name.ilike.${term},slug.ilike.${term}`)
  const { data, count } = await query

  const rows = (data ?? []).map((w) => ({
    id: w.id,
    name: w.name,
    slug: w.slug,
    status: w.status,
    client: w.clients ? { id: w.clients.id, name: w.clients.name } : null,
    members: (w.workspace_members as unknown as Array<{ count: number }>)[0]?.count ?? 0,
    created_at: w.created_at,
  }))

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title={t('admin.workspaces.title')}
        actions={
          <Button asChild>
            <Link href="/admin/workspaces/novo">
              <Plus /> {t('admin.workspaces.new')}
            </Link>
          </Button>
        }
      />
      <div className="grid gap-4">
        <TableSearch />
        <WorkspacesTable rows={rows} />
        <Pagination page={page} total={count ?? 0} searchParams={sp} basePath="/admin/workspaces" />
      </div>
    </div>
  )
}
