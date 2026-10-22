import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { LoginForm } from '@/components/auth/login-form'
import { getSession } from '@/lib/auth'
import { t } from '@/lib/i18n'
import { safeNext } from '@/lib/safe-next'

export const metadata: Metadata = { title: t('auth.signIn') }

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string; erro?: string }> }) {
  const { next, erro } = await searchParams
  const { user } = await getSession()
  if (user) redirect(safeNext(next))
  return <LoginForm next={safeNext(next)} linkError={erro === 'link'} />
}
