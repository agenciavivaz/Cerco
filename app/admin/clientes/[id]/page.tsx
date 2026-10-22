import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Plus } from 'lucide-react'
import { ClientForm } from '@/components/admin/client-form'
import { ClientStatusBadge, RoleBadge, WorkspaceStatusBadge } from '@/components/admin/status-badges'
import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { requirePagePlatformAdmin } from '@/lib/auth'
import { formatCnpj } from '@/lib/domain/cnpj'
import { clientRowToForm } from '@/lib/schemas/client'
import { t } from '@/lib/i18n'

export const metadata: Metadata = { title: t('admin.clients.edit') }

export default async function ClientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { supabase } = await requirePagePlatformAdmin()
  const { data: client } = await supabase.from('clients').select('*').eq('id', id).maybeSingle()
  if (!client) notFound()

  const { data: workspaces } = await supabase
    .from('workspaces')
    .select('id, name, slug, status, workspace_members(role, profiles(id, full_name, email))')
    .eq('client_id', id)
    .order('name')

  // Usuários com acesso a qualquer workspace do cliente (agrupados).
  const users = new Map<string, { id: string; name: string; email: string; access: Array<{ ws: string; role: 'manager' | 'bdr' | 'viewer' }> }>()
  for (const w of workspaces ?? []) {
    for (const m of w.workspace_members ?? []) {
      const p = m.profiles
      if (!p) continue
      const entry = users.get(p.id) ?? { id: p.id, name: p.full_name ?? p.email, email: p.email, access: [] }
      entry.access.push({ ws: w.name, role: m.role })
      users.set(p.id, entry)
    }
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-6">
      <PageHeader
        title={client.name}
        description={
          <span className="flex flex-wrap items-center gap-2">
            <ClientStatusBadge status={client.status} />
            {client.cnpj && <span>{formatCnpj(client.cnpj)}</span>}
          </span>
        }
        backHref="/admin/clientes"
        backLabel={t('admin.clients.title')}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <CardTitle className="text-base">{t('admin.clients.workspaces')}</CardTitle>
            <Button size="sm" variant="outline" asChild>
              <Link href={`/admin/workspaces/novo?cliente=${client.id}`}>
                <Plus /> {t('admin.workspaces.new')}
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {workspaces?.length ? (
              <ul className="divide-y">
                {workspaces.map((w) => (
                  <li key={w.id} className="flex items-center justify-between gap-2 py-2">
                    <Link href={`/admin/workspaces/${w.id}`} className="min-w-0 font-medium hover:underline">
                      <span className="block truncate">{w.name}</span>
                      <span className="text-muted-foreground text-xs font-normal">/w/{w.slug}</span>
                    </Link>
                    <WorkspaceStatusBadge status={w.status} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-sm">{t('admin.clients.noWorkspaces')}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t('admin.clients.users')}</CardTitle>
          </CardHeader>
          <CardContent>
            {users.size ? (
              <ul className="divide-y">
                {[...users.values()].map((u) => (
                  <li key={u.id} className="flex flex-wrap items-center justify-between gap-2 py-2">
                    <Link href={`/admin/usuarios/${u.id}`} className="min-w-0 hover:underline">
                      <span className="block truncate font-medium">{u.name}</span>
                      <span className="text-muted-foreground text-xs">{u.email}</span>
                    </Link>
                    <span className="flex flex-wrap gap-1 text-xs">
                      {u.access.map((a) => (
                        <span key={a.ws} className="flex items-center gap-1">
                          {a.ws} <RoleBadge role={a.role} />
                        </span>
                      ))}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-sm">{t('admin.clients.noUsers')}</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold">{t('admin.clients.edit')}</h2>
        <ClientForm clientId={client.id} defaultValues={clientRowToForm(client)} />
      </div>
    </div>
  )
}
