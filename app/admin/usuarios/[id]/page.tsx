import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ShieldCheck } from 'lucide-react'
import { UserAccessPanel } from '@/components/admin/user-access-panel'
import { UserStatusBadge } from '@/components/admin/status-badges'
import { PageHeader } from '@/components/page-header'
import { requirePagePlatformAdmin } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { formatDateTime } from '@/lib/format'
import { t } from '@/lib/i18n'

export const metadata: Metadata = { title: t('admin.users.title') }

export default async function UserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { supabase, user: me } = await requirePagePlatformAdmin()
  const [{ data: profile }, { data: workspaces }] = await Promise.all([
    supabase
      .from('profiles')
      .select('*, workspace_members(role, workspace_id, workspaces(id, name, slug))')
      .eq('id', id)
      .maybeSingle(),
    supabase.from('workspaces').select('id, name, clients(name)').order('name'),
  ])
  if (!profile) notFound()

  const { data: authUser } = await createAdminClient().auth.admin.getUserById(id)
  const pending = !authUser.user?.email_confirmed_at
  const status = profile.status === 'disabled' ? 'disabled' : pending ? 'pending' : 'active'
  const lastSeen = profile.last_seen_at ?? authUser.user?.last_sign_in_at ?? null

  return (
    <div className="mx-auto grid max-w-3xl gap-6">
      <PageHeader
        title={profile.full_name || profile.email}
        description={
          <span className="flex flex-wrap items-center gap-2">
            <UserStatusBadge status={status} />
            {profile.is_platform_admin && (
              <span className="flex items-center gap-1 text-amber-700 dark:text-amber-300">
                <ShieldCheck className="size-4" /> {t('admin.users.fields.is_platform_admin')}
              </span>
            )}
            <span>{profile.email}</span>
            <span>
              · {t('admin.users.fields.last_seen_at')}: {lastSeen ? formatDateTime(lastSeen) : t('admin.users.neverSeen')}
            </span>
          </span>
        }
        backHref="/admin/usuarios"
        backLabel={t('admin.users.title')}
      />
      <UserAccessPanel
        user={{
          id: profile.id,
          name: profile.full_name || profile.email,
          isPlatformAdmin: profile.is_platform_admin,
          status: profile.status,
          pending,
          isSelf: profile.id === me.id,
        }}
        access={(profile.workspace_members ?? [])
          .filter((m) => m.workspaces)
          .map((m) => ({ workspace_id: m.workspace_id, name: m.workspaces!.name, role: m.role }))}
        workspaces={(workspaces ?? []).map((w) => ({
          id: w.id,
          label: w.clients?.name ? `${w.clients.name} · ${w.name}` : w.name,
        }))}
      />
    </div>
  )
}
