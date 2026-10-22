import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '../lib/supabase/database.types'

config({ path: process.env.ENV_FILE ?? '.env.local' })

export function serviceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY (.env.local ou ENV_FILE).')
  return { url, client: createClient<Database>(url, key, { auth: { persistSession: false, autoRefreshToken: false } }) }
}

export function isLocal(url: string) {
  return url.includes('127.0.0.1') || url.includes('localhost')
}
