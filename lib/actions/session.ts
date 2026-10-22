'use server'

import { redirect } from 'next/navigation'
import { getSession, requireUser } from '@/lib/auth'
import { passwordFormSchema } from '@/lib/schemas/user'
import { fail, ok, runAction, type ActionResult } from './result'

export async function setPasswordAction(input: unknown): Promise<ActionResult> {
  return runAction(async () => {
    const parsed = passwordFormSchema.safeParse(input)
    if (!parsed.success) return fail('validation', parsed.error)
    const { supabase, user } = await requireUser()
    const { error } = await supabase.auth.updateUser({
      password: parsed.data.password,
      data: { full_name: parsed.data.full_name },
    })
    if (error) return fail('validation', null, error.message)
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ full_name: parsed.data.full_name })
      .eq('id', user.id)
    if (profileError) return fail('db', profileError)
    return ok(null)
  })
}

export async function signOutAction(): Promise<void> {
  const { supabase } = await getSession()
  await supabase.auth.signOut()
  redirect('/login')
}

/** Atualiza o "último acesso" (chamado no carregamento do app, no máximo 1x a cada 10 min). */
export async function touchLastSeen(): Promise<void> {
  const { supabase, user, profile } = await getSession()
  if (!user || !profile) return
  const last = profile.last_seen_at ? new Date(profile.last_seen_at).getTime() : 0
  if (Date.now() - last < 10 * 60 * 1000) return
  await supabase.from('profiles').update({ last_seen_at: new Date().toISOString() }).eq('id', user.id)
}
