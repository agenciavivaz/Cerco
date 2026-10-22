'use server'

import { revalidatePath } from 'next/cache'
import { requirePlatformAdmin } from '@/lib/auth'
import { clientFormSchema, clientFormToRow } from '@/lib/schemas/client'
import { fail, ok, runAction, type ActionResult } from './result'

export async function createClientAction(input: unknown): Promise<ActionResult<{ id: string }>> {
  return runAction(async () => {
    const parsed = clientFormSchema.safeParse(input)
    if (!parsed.success) return fail('validation', parsed.error)
    const { supabase } = await requirePlatformAdmin()
    const { data, error } = await supabase.from('clients').insert(clientFormToRow(parsed.data)).select('id').single()
    if (error) return fail('db', error)
    revalidatePath('/admin/clientes')
    return ok({ id: data.id })
  })
}

export async function updateClientAction(id: string, input: unknown): Promise<ActionResult<{ id: string }>> {
  return runAction(async () => {
    const parsed = clientFormSchema.safeParse(input)
    if (!parsed.success) return fail('validation', parsed.error)
    const { supabase } = await requirePlatformAdmin()
    const { data, error } = await supabase
      .from('clients')
      .update(clientFormToRow(parsed.data))
      .eq('id', id)
      .select('id')
      .maybeSingle()
    if (error) return fail('db', error)
    if (!data) return fail('notFound')
    revalidatePath('/admin/clientes')
    revalidatePath(`/admin/clientes/${id}`)
    return ok({ id: data.id })
  })
}
