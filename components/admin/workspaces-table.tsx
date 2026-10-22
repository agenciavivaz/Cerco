'use client'

import Link from 'next/link'
import type { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/data-table/data-table'
import { WorkspaceStatusBadge } from '@/components/admin/status-badges'
import { formatDate } from '@/lib/format'
import { t } from '@/lib/i18n'

export type WorkspaceRow = {
  id: string
  name: string
  slug: string
  status: 'active' | 'paused' | 'archived'
  client: { id: string; name: string } | null
  members: number
  created_at: string
}

const columns: ColumnDef<WorkspaceRow, unknown>[] = [
  {
    accessorKey: 'name',
    header: t('admin.workspaces.fields.name'),
    cell: ({ row }) => (
      <Link href={`/admin/workspaces/${row.original.id}`} className="font-medium hover:underline">
        {row.original.name}
        <span className="text-muted-foreground block text-xs font-normal">/w/{row.original.slug}</span>
      </Link>
    ),
  },
  {
    id: 'client',
    header: t('admin.workspaces.fields.client_id'),
    cell: ({ row }) =>
      row.original.client ? (
        <Link href={`/admin/clientes/${row.original.client.id}`} className="hover:underline">
          {row.original.client.name}
        </Link>
      ) : (
        '—'
      ),
  },
  {
    accessorKey: 'status',
    header: t('admin.workspaces.fields.status'),
    cell: ({ row }) => <WorkspaceStatusBadge status={row.original.status} />,
  },
  { accessorKey: 'members', header: t('admin.workspaces.members') },
  { accessorKey: 'created_at', header: t('admin.audit.fields.created_at'), cell: ({ row }) => formatDate(row.original.created_at) },
]

export function WorkspacesTable({ rows }: { rows: WorkspaceRow[] }) {
  return <DataTable columns={columns} data={rows} getRowId={(r) => r.id} emptyMessage={t('admin.workspaces.empty')} />
}
