import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getMemberships, requirePageUser } from '@/lib/auth'
import { LAST_WORKSPACE_COOKIE } from '@/lib/constants'

/** Decide para onde o usuário vai ao abrir o app. */
export default async function Home() {
  const { profile } = await requirePageUser()
  const memberships = await getMemberships()
  // ADM sem papel em nenhum workspace vai para a Área ADM.
  const own = memberships.filter((m) => m.role !== null)

  if (own.length === 0) {
    redirect(profile.is_platform_admin ? '/admin' : '/sem-acesso')
  }

  const last = (await cookies()).get(LAST_WORKSPACE_COOKIE)?.value
  const target = memberships.find((m) => m.slug === last) ?? own[0]
  redirect(`/w/${target.slug}`)
}
