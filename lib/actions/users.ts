'use server'

import { revalidatePath } from 'next/cache'
import { requirePlatformAdmin } from '@/lib/auth'
import { audit } from '@/lib/audit'
import { appUrl } from '@/lib/config/env'
import { createAdminClient } from '@/lib/supabase/admin'
import {
  inviteFormSchema,
  removeAccessSchema,
  setAccessSchema,
  setAdminSchema,
  setStatusSchema,
  userIdSchema,
} from '@/lib/schemas/user'
import { t } from '@/lib/i18n'
import { fail, ok, runAction, type ActionResult } from './result'

const SET_PASSWORD_PATH = '/definir-senha'

function callbackUrl() {
  return `${appUrl()}/auth/callback?next=${encodeURIComponent(SET_PASSWORD_PATH)}`
}

/**
 * Link de acesso de uso único que dispensa e-mail (DEC-008). Leva a /auth/callback, que valida o
 * token_hash e manda para "Definir senha". Gerar um novo link invalida o anterior.
 */
async function generateAccessLink(email: string, fullName?: string): Promise<string | null> {
  const admin = createAdminClient()
  for (const type of ['invite', 'magiclink'] as const) {
    const { data, error } = await admin.auth.admin.generateLink({
      type,
      email,
      options: { redirectTo: callbackUrl(), ...(type === 'invite' && fullName ? { data: { full_name: fullName } } : {}) },
    })
    if (!error && data.properties?.hashed_token) {
      const params = new URLSearchParams({
        token_hash: data.properties.hashed_token,
        type,
        next: SET_PASSWORD_PATH,
      })
      return `${appUrl()}/auth/callback?${params.toString()}`
    }
  }
  return null
}

export type InviteResult = { user_id: string; email_sent: boolean; email_error: string | null; link: string | null }

export async function inviteUserAction(input: unknown): Promise<ActionResult<InviteResult>> {
  return runAction(async () => {
    const parsed = inviteFormSchema.safeParse(input)
    if (!parsed.success) return fail('validation', parsed.error)
    const { supabase, user: actor } = await requirePlatformAdmin()
    const { email, full_name, is_platform_admin, accesses } = parsed.data
    const admin = createAdminClient()

    let { data: profile } = await admin.from('profiles').select('id').eq('email', email).maybeSingle()
    let emailSent = false
    let emailError: string | null = null
    let link: string | null = null

    if (!profile) {
      const { data, error } = await admin.auth.admin.inviteUserByEmail(email, {
        data: { full_name },
        redirectTo: callbackUrl(),
      })
      if (!error && data.user) {
        emailSent = true
      } else {
        // Sem SMTP (ou limite de envio): cria o convite sem e-mail e entrega o link copiável.
        emailError = error?.message ?? 'unknown'
        link = await generateAccessLink(email, full_name)
      }
      ;({ data: profile } = await admin.from('profiles').select('id').eq('email', email).maybeSingle())
      if (!profile) return fail('db', error, emailError ?? undefined)
    }

    const userId = profile.id

    // Nome e flag de ADM: o ADM atua com o próprio token (auditado pelo trigger com o ator).
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ full_name, ...(is_platform_admin ? { is_platform_admin: true } : {}) })
      .eq('id', userId)
    if (profileError) return fail('db', profileError)

    if (accesses.length > 0) {
      const { error: membersError } = await supabase
        .from('workspace_members')
        .upsert(accesses.map((a) => ({ workspace_id: a.workspace_id, user_id: userId, role: a.role })), {
          onConflict: 'workspace_id,user_id',
        })
      if (membersError) return fail('db', membersError)
    }

    await audit({
      action: 'user.invite',
      entity_type: 'profile',
      entity_id: userId,
      diff: { email, full_name, is_platform_admin, accesses, email_sent: emailSent, invited_by: actor.id },
    })
    revalidatePath('/admin/usuarios')
    return ok({ user_id: userId, email_sent: emailSent, email_error: emailError, link })
  })
}

export async function resendInviteAction(input: unknown): Promise<ActionResult<{ email_sent: boolean; link: string | null }>> {
  return runAction(async () => {
    const parsed = userIdSchema.safeParse(input)
    if (!parsed.success) return fail('validation', parsed.error)
    await requirePlatformAdmin()
    const admin = createAdminClient()
    const { data: profile } = await admin.from('profiles').select('id, email').eq('id', parsed.data.user_id).maybeSingle()
    if (!profile) return fail('notFound')

    const { data: authUser } = await admin.auth.admin.getUserById(profile.id)
    const confirmed = Boolean(authUser.user?.email_confirmed_at)

    // Pendente: reenvia o convite. Já ativo: envia link de acesso por e-mail.
    const { error } = confirmed
      ? await admin.auth.signInWithOtp({ email: profile.email, options: { shouldCreateUser: false, emailRedirectTo: callbackUrl() } })
      : await admin.auth.admin.inviteUserByEmail(profile.email, { redirectTo: callbackUrl() })

    let link: string | null = null
    if (error) link = await generateAccessLink(profile.email)
    await audit({ action: 'user.resend_invite', entity_type: 'profile', entity_id: profile.id, diff: { email_sent: !error } })
    return ok({ email_sent: !error, link })
  })
}

export async function generateAccessLinkAction(input: unknown): Promise<ActionResult<{ link: string }>> {
  return runAction(async () => {
    const parsed = userIdSchema.safeParse(input)
    if (!parsed.success) return fail('validation', parsed.error)
    await requirePlatformAdmin()
    const admin = createAdminClient()
    const { data: profile } = await admin.from('profiles').select('id, email, full_name').eq('id', parsed.data.user_id).maybeSingle()
    if (!profile) return fail('notFound')
    const link = await generateAccessLink(profile.email, profile.full_name ?? undefined)
    if (!link) return fail('db')
    await audit({ action: 'user.generate_access_link', entity_type: 'profile', entity_id: profile.id })
    return ok({ link })
  })
}

export async function setAccessAction(input: unknown): Promise<ActionResult> {
  return runAction(async () => {
    const parsed = setAccessSchema.safeParse(input)
    if (!parsed.success) return fail('validation', parsed.error)
    const { supabase } = await requirePlatformAdmin()
    const { error } = await supabase
      .from('workspace_members')
      .upsert(parsed.data, { onConflict: 'workspace_id,user_id' })
    if (error) return fail('db', error)
    revalidatePath('/admin/usuarios')
    revalidatePath(`/admin/usuarios/${parsed.data.user_id}`)
    return ok(null)
  })
}

export async function removeAccessAction(input: unknown): Promise<ActionResult> {
  return runAction(async () => {
    const parsed = removeAccessSchema.safeParse(input)
    if (!parsed.success) return fail('validation', parsed.error)
    const { supabase } = await requirePlatformAdmin()
    const { error } = await supabase
      .from('workspace_members')
      .delete()
      .eq('workspace_id', parsed.data.workspace_id)
      .eq('user_id', parsed.data.user_id)
    if (error) return fail('db', error)
    revalidatePath('/admin/usuarios')
    revalidatePath(`/admin/usuarios/${parsed.data.user_id}`)
    return ok(null)
  })
}

export async function setPlatformAdminAction(input: unknown): Promise<ActionResult> {
  return runAction(async () => {
    const parsed = setAdminSchema.safeParse(input)
    if (!parsed.success) return fail('validation', parsed.error)
    const { supabase, user } = await requirePlatformAdmin()
    if (parsed.data.user_id === user.id) return fail('forbidden', null, t('admin.users.cannotChangeSelf'))
    const { error } = await supabase
      .from('profiles')
      .update({ is_platform_admin: parsed.data.is_platform_admin })
      .eq('id', parsed.data.user_id)
    if (error) return fail('db', error)
    revalidatePath('/admin/usuarios')
    revalidatePath(`/admin/usuarios/${parsed.data.user_id}`)
    return ok(null)
  })
}

export async function setUserStatusAction(input: unknown): Promise<ActionResult> {
  return runAction(async () => {
    const parsed = setStatusSchema.safeParse(input)
    if (!parsed.success) return fail('validation', parsed.error)
    const { supabase, user } = await requirePlatformAdmin()
    if (parsed.data.user_id === user.id) return fail('forbidden', null, t('admin.users.cannotChangeSelf'))
    const { error } = await supabase
      .from('profiles')
      .update({ status: parsed.data.status })
      .eq('id', parsed.data.user_id)
    if (error) return fail('db', error)

    // Desativar também bloqueia o login no Auth (e encerra sessões ao expirar o token).
    const admin = createAdminClient()
    await admin.auth.admin.updateUserById(parsed.data.user_id, {
      ban_duration: parsed.data.status === 'disabled' ? '876000h' : 'none',
    })
    revalidatePath('/admin/usuarios')
    revalidatePath(`/admin/usuarios/${parsed.data.user_id}`)
    return ok(null)
  })
}
