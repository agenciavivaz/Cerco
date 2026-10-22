import 'server-only'
import { createClient } from '@supabase/supabase-js'
import { publicEnv, serverEnv } from '@/lib/config/env'
import type { Database } from './database.types'

/**
 * Service role: ignora RLS. Uso restrito (ver CLAUDE.md): Auth admin (convites), auditoria,
 * endpoints públicos com validação própria e jobs. NUNCA importar em componente client.
 */
export function createAdminClient() {
  return createClient<Database>(publicEnv.NEXT_PUBLIC_SUPABASE_URL, serverEnv().SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
