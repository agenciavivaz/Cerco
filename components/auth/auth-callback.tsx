'use client'

import { useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import type { EmailOtpType } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/browser'
import { safeNext } from '@/lib/safe-next'
import { t } from '@/lib/i18n'

const OTP_TYPES: EmailOtpType[] = ['invite', 'magiclink', 'recovery', 'signup', 'email', 'email_change']

/**
 * Conclui o login vindo de e-mail ou link copiado. Aceita os três formatos do Supabase Auth:
 * ?code= (PKCE, magic link do login), ?token_hash=&type= (link gerado pelo ADM) e
 * #access_token= (convite enviado pelo template padrão do Supabase).
 */
export function AuthCallback() {
  const router = useRouter()
  const params = useSearchParams()
  const ran = useRef(false)

  useEffect(() => {
    if (ran.current) return
    ran.current = true
    const supabase = createClient()
    const next = safeNext(params.get('next'))

    async function run() {
      const code = params.get('code')
      const tokenHash = params.get('token_hash')
      const type = params.get('type') as EmailOtpType | null
      const hash = new URLSearchParams(window.location.hash.slice(1))

      let error: unknown = null
      if (code) {
        ;({ error } = await supabase.auth.exchangeCodeForSession(code))
      } else if (tokenHash && type && OTP_TYPES.includes(type)) {
        ;({ error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type }))
      } else if (hash.get('access_token') && hash.get('refresh_token')) {
        ;({ error } = await supabase.auth.setSession({
          access_token: hash.get('access_token')!,
          refresh_token: hash.get('refresh_token')!,
        }))
      } else {
        error = new Error(hash.get('error_description') ?? 'missing token')
      }

      if (error) {
        router.replace('/login?erro=link')
        return
      }
      // Convite (link do e-mail padrão) também precisa definir senha.
      const target = hash.get('type') === 'invite' ? '/definir-senha' : next
      router.replace(target)
      router.refresh()
    }
    void run()
  }, [params, router])

  return (
    <main className="flex min-h-dvh items-center justify-center gap-2 text-sm text-muted-foreground" role="status">
      <Loader2 className="size-4 animate-spin" />
      {t('auth.processing')}
    </main>
  )
}
