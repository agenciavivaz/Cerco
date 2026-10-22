import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { publicEnv } from '@/lib/config/env'
import type { Database } from './database.types'
import { LAST_WORKSPACE_COOKIE } from '@/lib/constants'

const PUBLIC_PATHS = ['/login', '/auth/callback']

/** Renova a sessão em toda requisição e manda quem não está logado para /login. */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient<Database>(
    publicEnv.NEXT_PUBLIC_SUPABASE_URL,
    publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
        },
      },
    },
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname
  const isPublic = PUBLIC_PATHS.some((p) => path === p || path.startsWith(`${p}/`))

  if (!user && !isPublic) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.search = ''
    if (path !== '/') url.searchParams.set('next', path + request.nextUrl.search)
    const redirect = NextResponse.redirect(url)
    response.cookies.getAll().forEach((c) => redirect.cookies.set(c))
    return redirect
  }

  // Lembra o último workspace aberto (RF-1.2).
  const ws = path.match(/^\/w\/([a-z0-9-]+)/)?.[1]
  if (user && ws && request.cookies.get(LAST_WORKSPACE_COOKIE)?.value !== ws) {
    response.cookies.set(LAST_WORKSPACE_COOKIE, ws, { path: '/', maxAge: 60 * 60 * 24 * 365, sameSite: 'lax' })
  }

  return response
}
