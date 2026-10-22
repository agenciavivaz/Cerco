import 'server-only'
import { headers } from 'next/headers'
import { createAdminClient } from '@/lib/supabase/admin'
import type { Json } from '@/lib/supabase/database.types'
import { getSession } from '@/lib/auth'

type AuditEntry = {
  action: string
  entity_type: string
  entity_id?: string | null
  workspace_id?: string | null
  diff?: Json
}

/**
 * Registro de auditoria da camada de aplicação (ações sem mudança de dado, ex.: convite enviado).
 * Mudanças de dado nas tabelas do ADM já são auditadas por trigger no banco.
 */
export async function audit(entry: AuditEntry): Promise<void> {
  try {
    const [{ user }, h] = await Promise.all([getSession(), headers()])
    const ip = h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('x-real-ip') || null
    const { error } = await createAdminClient()
      .from('audit_logs')
      .insert({
        action: entry.action,
        entity_type: entry.entity_type,
        entity_id: entry.entity_id ?? null,
        workspace_id: entry.workspace_id ?? null,
        diff: entry.diff ?? null,
        actor_id: user?.id ?? null,
        ip,
      })
    if (error) console.error('[audit]', error)
  } catch (e) {
    // Auditoria nunca derruba a ação principal, mas o erro fica no log/Sentry.
    console.error('[audit]', e)
  }
}
