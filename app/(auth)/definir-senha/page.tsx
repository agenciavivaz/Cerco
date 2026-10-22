import type { Metadata } from 'next'
import { SetPasswordForm } from '@/components/auth/set-password-form'
import { requirePageUser } from '@/lib/auth'
import { t } from '@/lib/i18n'

export const metadata: Metadata = { title: t('auth.setPasswordTitle') }

export default async function SetPasswordPage() {
  const { profile } = await requirePageUser()
  return <SetPasswordForm email={profile.email} defaultName={profile.full_name ?? ''} />
}
