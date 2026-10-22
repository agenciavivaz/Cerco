import 'server-only'
import { cache } from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ActionFailure, fail } from '@/lib/actions/result'
import type { Database } from '@/lib/supabase/database.types'

export type Profile = Database['public']['Tables']['profiles']['Row']
export type MemberRole = Database['public']['Enums']['member_role']

export type WorkspaceMembership = {
  id: string
  name: string
  slug: string
  status: Database['public']['Enums']['workspace_status']
  timezone: string
  role: MemberRole | null // null = ADM sem papel no workspace
}

/** Sessão do request atual (memoizada por request). */
export const getSession = cache(async () => {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { supabase, user: null, profile: null }
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle()
  return { supabase, user, profile }
})

/** Para páginas: redireciona se não estiver logado ou estiver desativado. */
export async function requirePageUser() {
  const session = await getSession()
  if (!session.user || !session.profile) redirect('/login')
  if (session.profile.status !== 'active') redirect('/sem-acesso?motivo=desativado')
  return { ...session, user: session.user, profile: session.profile }
}

export async function requirePagePlatformAdmin() {
  const session = await requirePageUser()
  if (!session.profile.is_platform_admin) redirect('/')
  return session
}

/** Para Server Actions: lança ActionFailure (convertida por runAction). */
export async function requireUser() {
  const session = await getSession()
  if (!session.user || !session.profile) throw new ActionFailure(fail('unauthenticated'))
  if (session.profile.status !== 'active') throw new ActionFailure(fail('forbidden'))
  return { ...session, user: session.user, profile: session.profile }
}

export async function requirePlatformAdmin() {
  const session = await requireUser()
  if (!session.profile.is_platform_admin) throw new ActionFailure(fail('forbidden'))
  return session
}

/** Workspaces que o usuário enxerga (RLS decide: membro, ou todos se ADM). */
export const getMemberships = cache(async (): Promise<WorkspaceMembership[]> => {
  const { supabase, user } = await getSession()
  if (!user) return []
  const [{ data: workspaces }, { data: members }] = await Promise.all([
    supabase.from('workspaces').select('id, name, slug, status, timezone').order('name'),
    supabase.from('workspace_members').select('workspace_id, role').eq('user_id', user.id),
  ])
  const roleBy = new Map((members ?? []).map((m) => [m.workspace_id, m.role]))
  return (workspaces ?? []).map((w) => ({ ...w, role: roleBy.get(w.id) ?? null }))
})
