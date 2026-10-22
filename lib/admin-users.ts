import 'server-only'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * Status de convite (pendente = ainda não confirmou o e-mail) vem do Auth, não do perfil.
 * Lista todos os usuários do Auth em páginas de 1.000; suficiente para a escala da V1 (dezenas).
 */
export async function authStatusById(): Promise<Map<string, { confirmed: boolean; last_sign_in_at: string | null }>> {
  const admin = createAdminClient()
  const map = new Map<string, { confirmed: boolean; last_sign_in_at: string | null }>()
  for (let page = 1; page <= 20; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 1000 })
    if (error || !data) break
    for (const u of data.users) {
      map.set(u.id, { confirmed: Boolean(u.email_confirmed_at), last_sign_in_at: u.last_sign_in_at ?? null })
    }
    if (data.users.length < 1000) break
  }
  return map
}
