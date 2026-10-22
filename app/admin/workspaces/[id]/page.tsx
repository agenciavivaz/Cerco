import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Copy, LogIn } from 'lucide-react'
import { WorkspaceForm } from '@/components/admin/workspace-form'
import { RoleBadge, WorkspaceStatusBadge } from '@/components/admin/status-badges'
import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { enterWorkspaceAction } from '@/lib/actions/workspaces'
import { requirePagePlatformAdmin } from '@/lib/auth'
import { workspaceRowToForm } from '@/lib/schemas/workspace'
import { t } from '@/lib/i18n'

export const metadata: Metadata = { title: t('admin.workspaces.edit') }

export default async function WorkspacePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { supabase } = await requirePagePlatformAdmin()
  const [{ data: workspace }, { data: clients }] = await Promise.all([
    supabase
      .from('workspaces')
      .select('*, clients(id, name), workspace_members(role, profiles(id, full_name, email, status))')
      .eq('id', id)
      .maybeSingle(),
    supabase.from('clients').select('id, name').order('name'),
  ])
  if (!workspace) notFound()

  const enter = enterWorkspaceAction.bind(null, workspace.id)

  return (
    <div className="mx-auto grid max-w-4xl gap-6">
      <PageHeader
        title={workspace.name}
        description={
          <span className="flex flex-wrap items-center gap-2">
            <WorkspaceStatusBadge status={workspace.status} />
            {workspace.clients && (
              <Link href={`/admin/clientes/${workspace.clients.id}`} className="hover:underline">
                {workspace.clients.name}
              </Link>
            )}
            <span>/w/{workspace.slug}</span>
          </span>
        }
        backHref="/admin/workspaces"
        backLabel={t('admin.workspaces.title')}
        actions={
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <span tabIndex={0}>
                  <Button variant="outline" disabled>
                    <Copy /> {t('admin.workspaces.duplicateStructure')}
                  </Button>
                </span>
              </TooltipTrigger>
              <TooltipContent>{t('admin.workspaces.duplicateStructureSoon')}</TooltipContent>
            </Tooltip>
            <form action={enter}>
              <Button type="submit">
                <LogIn /> {t('admin.workspaces.enter')}
              </Button>
            </form>
          </>
        }
      />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">{t('admin.workspaces.members')}</CardTitle>
          <Button size="sm" variant="outline" asChild>
            <Link href="/admin/usuarios">{t('admin.users.invite')}</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {workspace.workspace_members.length ? (
            <ul className="divide-y">
              {workspace.workspace_members.map((m) =>
                m.profiles ? (
                  <li key={m.profiles.id} className="flex items-center justify-between gap-2 py-2">
                    <Link href={`/admin/usuarios/${m.profiles.id}`} className="min-w-0 hover:underline">
                      <span className="block truncate font-medium">{m.profiles.full_name ?? m.profiles.email}</span>
                      <span className="text-muted-foreground text-xs">{m.profiles.email}</span>
                    </Link>
                    <RoleBadge role={m.role} />
                  </li>
                ) : null,
              )}
            </ul>
          ) : (
            <p className="text-muted-foreground text-sm">{t('admin.workspaces.noMembers')}</p>
          )}
        </CardContent>
      </Card>

      <div className="text-muted-foreground text-xs">
        {t('admin.workspaces.fields.tracking_public_key')}: <code className="font-mono">{workspace.tracking_public_key}</code>
      </div>

      <WorkspaceForm workspaceId={workspace.id} clients={clients ?? []} defaultValues={workspaceRowToForm(workspace)} />
    </div>
  )
}
