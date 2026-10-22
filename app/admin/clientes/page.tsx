import type { Metadata } from 'next'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { ClientsTable } from '@/components/admin/clients-table'
import { Pagination, pageFromParams, pageRange } from '@/components/data-table/pagination'
import { TableSearch } from '@/components/data-table/table-search'
import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { requirePagePlatformAdmin } from '@/lib/auth'
import { cnpjDigits } from '@/lib/domain/cnpj'
import { t } from '@/lib/i18n'
import { ilikeTerm } from '@/lib/search'

export const metadata: Metadata = { title: t('admin.clients.title') }

type SearchParams = Promise<{ q?: string; page?: string }>

export default async function ClientsPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams
  const { supabase } = await requirePagePlatformAdmin()
  const page = pageFromParams(sp.page)
  const [from, to] = pageRange(page)

  let query = supabase
    .from('clients')
    .select('id, name, legal_name, cnpj, status, plan, started_at, workspaces(count)', { count: 'exact' })
    .order('name')
    .range(from, to)
  const term = ilikeTerm(sp.q)
  if (term) {
    const digits = cnpjDigits(sp.q ?? '')
    query = query.or(
      [`name.ilike.${term}`, `legal_name.ilike.${term}`, ...(digits.length >= 3 ? [`cnpj.ilike.%${digits}%`] : [])].join(','),
    )
  }
  const { data, count } = await query

  const rows = (data ?? []).map((c) => ({
    ...c,
    workspaces_count: (c.workspaces as unknown as Array<{ count: number }>)[0]?.count ?? 0,
  }))

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title={t('admin.clients.title')}
        actions={
          <Button asChild>
            <Link href="/admin/clientes/novo">
              <Plus /> {t('admin.clients.new')}
            </Link>
          </Button>
        }
      />
      <div className="grid gap-4">
        <TableSearch />
        <ClientsTable rows={rows} />
        <Pagination page={page} total={count ?? 0} searchParams={sp} basePath="/admin/clientes" />
      </div>
    </div>
  )
}
