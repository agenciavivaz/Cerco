import { WorkspaceShell } from '@/components/workspace/workspace-shell'
import { touchLastSeen } from '@/lib/actions/session'
import { getWorkspaceContext } from '@/lib/workspace-context'
import { sectionsFor } from '@/lib/workspace-nav'

export default async function WorkspaceLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ workspaceSlug: string }>
}) {
  const { workspaceSlug } = await params
  const ctx = await getWorkspaceContext(workspaceSlug)
  await touchLastSeen()

  return (
    <WorkspaceShell
      workspace={{ id: ctx.workspace.id, name: ctx.workspace.name, slug: ctx.workspace.slug }}
      workspaces={ctx.memberships.map((m) => ({ id: m.id, name: m.name, slug: m.slug, role: m.role }))}
      role={ctx.role}
      sections={sectionsFor(ctx.role)}
      user={{
        id: ctx.user.id,
        name: ctx.profile.full_name ?? ctx.profile.email,
        email: ctx.profile.email,
        isPlatformAdmin: ctx.profile.is_platform_admin,
      }}
      asAdmin={ctx.asAdmin}
    >
      {children}
    </WorkspaceShell>
  )
}
