'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requirePlatformAdmin } from '@/lib/auth'
import { audit } from '@/lib/audit'
import { workspaceFormSchema, workspaceFormToRow } from '@/lib/schemas/workspace'
import { t } from '@/lib/i18n'
import { fail, ok, runAction, type ActionResult } from './result'

function slugConflict(error: { code?: string; message?: string }) {
  return error.code === '23505' && (error.message ?? '').includes('slug')
}

export async function createWorkspaceAction(input: unknown): Promise<ActionResult<{ id: string }>> {
  return runAction(async () => {
    const parsed = workspaceFormSchema.safeParse(input)
    if (!parsed.success) return fail('validation', parsed.error)
    const { supabase } = await requirePlatformAdmin()
    const { data, error } = await supabase
      .from('workspaces')
      .insert(workspaceFormToRow(parsed.data))
      .select('id')
      .single()
    if (error) {
      if (slugConflict(error))
        return { ok: false, error: { code: 'conflict', message: t('admin.workspaces.slugTaken'), fieldErrors: { slug: t('admin.workspaces.slugTaken') } } }
      return fail('db', error)
    }
    revalidatePath('/admin/workspaces')
    revalidatePath(`/admin/clientes/${parsed.data.client_id}`)
    return ok({ id: data.id })
  })
}

export async function updateWorkspaceAction(id: string, input: unknown): Promise<ActionResult<{ id: string }>> {
  return runAction(async () => {
    const parsed = workspaceFormSchema.safeParse(input)
    if (!parsed.success) return fail('validation', parsed.error)
    const { supabase } = await requirePlatformAdmin()
    const { data, error } = await supabase
      .from('workspaces')
      .update(workspaceFormToRow(parsed.data))
      .eq('id', id)
      .select('id')
      .maybeSingle()
    if (error) {
      if (slugConflict(error))
        return { ok: false, error: { code: 'conflict', message: t('admin.workspaces.slugTaken'), fieldErrors: { slug: t('admin.workspaces.slugTaken') } } }
      return fail('db', error)
    }
    if (!data) return fail('notFound')
    revalidatePath('/admin/workspaces')
    revalidatePath(`/admin/workspaces/${id}`)
    return ok({ id: data.id })
  })
}

/** "Entrar no workspace" como ADM: registra na auditoria e abre o app (usado como form action). */
export async function enterWorkspaceAction(workspaceId: string): Promise<void> {
  const { supabase } = await requirePlatformAdmin().catch(() => redirect('/'))
  const { data } = await supabase.from('workspaces').select('id, slug').eq('id', workspaceId).maybeSingle()
  if (!data) redirect('/admin/workspaces')
  await audit({ action: 'workspace.admin_enter', entity_type: 'workspace', entity_id: data.id, workspace_id: data.id })
  redirect(`/w/${data.slug}`)
}
