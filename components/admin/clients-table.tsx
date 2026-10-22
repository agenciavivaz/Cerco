'use client'

import Link from 'next/link'
import type { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/data-table/data-table'
import { ClientStatusBadge } from '@/components/admin/status-badges'
import { formatCnpj } from '@/lib/domain/cnpj'
import { formatDate } from '@/lib/format'
import { t } from '@/lib/i18n'
import type { ClientStatus } from '@/lib/schemas/client'

export type ClientRow = {
  id: string
  name: string
  legal_name: string | null
  cnpj: string | null
  status: ClientStatus
  plan: string | null
  started_at: string | null
  workspaces_count: number
}

const columns: ColumnDef<ClientRow, unknown>[] = [
  {
    accessorKey: 'name',
    header: t('admin.clients.fields.name'),
    cell: ({ row }) => (
      <Link href={`/admin/clientes/${row.original.id}`} className="font-medium hover:underline">
        {row.original.name}
        {row.original.legal_name && (
          <span className="text-muted-foreground block text-xs font-normal">{row.original.legal_name}</span>
        )}
      </Link>
    ),
  },
  { accessorKey: 'cnpj', header: t('admin.clients.fields.cnpj'), cell: ({ row }) => formatCnpj(row.original.cnpj) || '—' },
  {
    accessorKey: 'status',
    header: t('admin.clients.fields.status'),
    cell: ({ row }) => <ClientStatusBadge status={row.original.status} />,
  },
  { accessorKey: 'plan', header: t('admin.clients.fields.plan'), cell: ({ row }) => row.original.plan ?? '—' },
  { accessorKey: 'workspaces_count', header: t('admin.clients.workspacesCount') },
  {
    accessorKey: 'started_at',
    header: t('admin.clients.fields.started_at'),
    cell: ({ row }) => formatDate(row.original.started_at),
  },
]

export function ClientsTable({ rows }: { rows: ClientRow[] }) {
  return <DataTable columns={columns} data={rows} getRowId={(r) => r.id} emptyMessage={t('admin.clients.empty')} />
}
