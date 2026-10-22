'use client'

import Link from 'next/link'
import type { ColumnDef } from '@tanstack/react-table'
import { ShieldCheck } from 'lucide-react'
import { DataTable } from '@/components/data-table/data-table'
import { RoleBadge, UserStatusBadge } from '@/components/admin/status-badges'
import { formatDateTime } from '@/lib/format'
import { t } from '@/lib/i18n'

export type UserRow = {
  id: string
  name: string
  email: string
  status: 'active' | 'disabled' | 'pending'
  is_platform_admin: boolean
  last_seen_at: string | null
  access: Array<{ workspace: string; role: 'manager' | 'bdr' | 'viewer' }>
}

const columns: ColumnDef<UserRow, unknown>[] = [
  {
    accessorKey: 'name',
    header: t('admin.users.fields.full_name'),
    cell: ({ row }) => (
      <Link href={`/admin/usuarios/${row.original.id}`} className="font-medium hover:underline">
        <span className="flex items-center gap-1">
          {row.original.name || row.original.email}
          {row.original.is_platform_admin && (
            <ShieldCheck className="size-4 text-amber-600" aria-label={t('admin.users.fields.is_platform_admin')} />
          )}
        </span>
        <span className="text-muted-foreground block text-xs font-normal">{row.original.email}</span>
      </Link>
    ),
  },
  {
    accessorKey: 'status',
    header: t('admin.users.fields.status'),
    cell: ({ row }) => <UserStatusBadge status={row.original.status} />,
  },
  {
    id: 'access',
    header: t('admin.users.fields.workspaces'),
    cell: ({ row }) =>
      row.original.access.length ? (
        <span className="flex flex-wrap gap-1">
          {row.original.access.map((a) => (
            <span key={a.workspace} className="flex items-center gap-1 text-xs">
              {a.workspace} <RoleBadge role={a.role} />
            </span>
          ))}
        </span>
      ) : (
        <span className="text-muted-foreground text-xs">{t('admin.users.noAccess')}</span>
      ),
  },
  {
    accessorKey: 'last_seen_at',
    header: t('admin.users.fields.last_seen_at'),
    cell: ({ row }) =>
      row.original.last_seen_at ? formatDateTime(row.original.last_seen_at) : (
        <span className="text-muted-foreground text-xs">{t('admin.users.neverSeen')}</span>
      ),
  },
]

export function UsersTable({ rows }: { rows: UserRow[] }) {
  return <DataTable columns={columns} data={rows} getRowId={(r) => r.id} emptyMessage={t('admin.users.empty')} />
}
