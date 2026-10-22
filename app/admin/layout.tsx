import type { Metadata } from 'next'
import { AdminShell } from '@/components/admin/admin-shell'
import { touchLastSeen } from '@/lib/actions/session'
import { requirePagePlatformAdmin } from '@/lib/auth'
import { t } from '@/lib/i18n'

export const metadata: Metadata = { title: { default: t('admin.title'), template: `%s · ${t('admin.title')}` } }

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, profile } = await requirePagePlatformAdmin()
  await touchLastSeen()
  return (
    <AdminShell user={{ id: user.id, name: profile.full_name ?? profile.email, email: profile.email }}>
      {children}
    </AdminShell>
  )
}
