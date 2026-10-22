import 'server-only'
import { cache } from 'react'
import { notFound } from 'next/navigation'
import { getMemberships, requirePageUser } from '@/lib/auth'

/** Workspace do slug da URL + papel do usuário. 404 se não tiver acesso (RLS já esconde o workspace). */
export const getWorkspaceContext = cache(async (slug: string) => {
  const session = await requirePageUser()
  const memberships = await getMemberships()
  const workspace = memberships.find((m) => m.slug === slug)
  if (!workspace) notFound()
  return { ...session, workspace, memberships, role: workspace.role, asAdmin: workspace.role === null }
})
