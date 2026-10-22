'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/data-table/data-table'
import { formatDateTime } from '@/lib/format'
import { t } from '@/lib/i18n'

export type AuditRow = {
  id: string
  created_at: string
  actor: string | null
  workspace: string | null
  action: string
  entity_type: string
  entity_id: string | null
  diff: unknown
  ip: string | null
}

const columns: ColumnDef<AuditRow, unknown>[] = [
  {
    accessorKey: 'created_at',
    header: t('admin.audit.fields.created_at'),
    cell: ({ row }) => <span className="whitespace-nowrap">{formatDateTime(row.original.created_at)}</span>,
  },
  {
    accessorKey: 'actor',
    header: t('admin.audit.fields.actor'),
    cell: ({ row }) => row.original.actor ?? <span className="text-muted-foreground">{t('admin.audit.system')}</span>,
  },
  { accessorKey: 'workspace', header: t('admin.audit.fields.workspace'), cell: ({ row }) => row.original.workspace ?? '—' },
  {
    accessorKey: 'action',
    header: t('admin.audit.fields.action'),
    cell: ({ row }) => <code className="text-xs">{row.original.action}</code>,
  },
  {
    id: 'entity',
    header: t('admin.audit.fields.entity'),
    cell: ({ row }) => (
      <span className="text-xs">
        {row.original.entity_type}
        {row.original.entity_id && <span className="text-muted-foreground block font-mono">{row.original.entity_id.slice(0, 8)}</span>}
      </span>
    ),
  },
  {
    id: 'diff',
    header: t('admin.audit.fields.diff'),
    cell: ({ row }) =>
      row.original.diff ? (
        <details className="max-w-md">
          <summary className="cursor-pointer text-xs underline-offset-2 hover:underline">{t('admin.audit.showDiff')}</summary>
          <pre className="bg-muted mt-1 max-h-64 overflow-auto rounded p-2 text-xs whitespace-pre-wrap">
            {JSON.stringify(row.original.diff, null, 2)}
          </pre>
        </details>
      ) : (
        '—'
      ),
  },
]

export function AuditTable({ rows }: { rows: AuditRow[] }) {
  return <DataTable columns={columns} data={rows} getRowId={(r) => r.id} emptyMessage={t('admin.audit.empty')} />
}
