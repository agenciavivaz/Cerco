import { config } from 'dotenv'
import { randomUUID } from 'node:crypto'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/supabase/database.types'

config({ path: '.env.local' })

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!url?.includes('127.0.0.1') && !url?.includes('localhost')) {
  // Testes criam e apagam usuários: nunca rodar contra o projeto hospedado.
  throw new Error('Testes de RLS só rodam contra o Supabase local (pnpm db:start).')
}

export type Client = SupabaseClient<Database>

const opts = { auth: { persistSession: false, autoRefreshToken: false } }

export const service: Client = createClient<Database>(url, serviceKey, opts)
export const anon = (): Client => createClient<Database>(url, anonKey, opts)

export const PASSWORD = 'senha-de-teste-123'
export const runId = randomUUID().slice(0, 8)

export async function createUser(label: string, opts2: { admin?: boolean } = {}) {
  const email = `${label}-${runId}@rls.example`
  const { data, error } = await service.auth.admin.createUser({
    email,
    password: PASSWORD,
    email_confirm: true,
    user_metadata: { full_name: label },
  })
  if (error || !data.user) throw error ?? new Error('createUser')
  if (opts2.admin) {
    const { error: e } = await service.from('profiles').update({ is_platform_admin: true }).eq('id', data.user.id)
    if (e) throw e
  }
  return { id: data.user.id, email }
}

/** Cliente autenticado com o token do próprio usuário (como no browser). */
export async function signIn(email: string): Promise<Client> {
  const client = anon()
  const { error } = await client.auth.signInWithPassword({ email, password: PASSWORD })
  if (error) throw error
  return client
}
