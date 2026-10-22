import 'server-only'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { publicEnv } from '@/lib/config/env'
import type { Database } from './database.types'

/** Cliente com o token do usuário (cookies). Padrão para tudo: a RLS é a guarda real. */
export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient<Database>(publicEnv.NEXT_PUBLIC_SUPABASE_URL, publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // Chamado de um Server Component: o middleware renova a sessão.
        }
      },
    },
  })
}
