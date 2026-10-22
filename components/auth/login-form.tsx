'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { createClient } from '@/lib/supabase/browser'
import { t } from '@/lib/i18n'

export function LoginForm({ next, linkError }: { next: string; linkError?: boolean }) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(linkError ? t('auth.linkInvalid') : null)
  const [magicSent, setMagicSent] = useState(false)

  // Convite enviado pelo painel do Supabase volta para a Site URL com o token no #hash;
  // o middleware manda para /login (o hash é preservado). Encaminha para o callback.
  useEffect(() => {
    const hash = window.location.hash
    if (hash.includes('access_token=') || hash.includes('error_description=')) {
      window.location.replace(`/auth/callback${hash}`)
    }
  }, [])

  async function signInWithPassword(e: React.FormEvent) {
    e.preventDefault()
    setPending(true)
    setError(null)
    const { error } = await createClient().auth.signInWithPassword({ email: email.trim(), password })
    if (error) {
      setError(t('auth.invalidCredentials'))
      setPending(false)
      return
    }
    router.replace(next)
    router.refresh()
  }

  async function sendMagicLink(e: React.FormEvent) {
    e.preventDefault()
    setPending(true)
    setError(null)
    const redirect = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`
    // shouldCreateUser: false → sem cadastro público. Resposta igual exista ou não o e-mail.
    await createClient().auth.signInWithOtp({
      email: email.trim(),
      options: { shouldCreateUser: false, emailRedirectTo: redirect },
    })
    setMagicSent(true)
    setPending(false)
  }

  const emailField = (
    <div className="grid gap-2">
      <Label htmlFor="email">{t('auth.email')}</Label>
      <Input
        id="email"
        type="email"
        autoComplete="email"
        inputMode="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
    </div>
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">{t('auth.loginTitle')}</CardTitle>
        <CardDescription>{t('auth.loginSubtitle')}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {error && (
          <Alert variant="destructive" role="alert">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Tabs defaultValue="password">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="password">{t('auth.withPassword')}</TabsTrigger>
            <TabsTrigger value="magic">{t('auth.withMagicLink')}</TabsTrigger>
          </TabsList>
          <TabsContent value="password">
            <form onSubmit={signInWithPassword} className="grid gap-4 pt-2">
              {emailField}
              <div className="grid gap-2">
                <Label htmlFor="password">{t('auth.password')}</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={pending} className="w-full">
                {pending && <Loader2 className="animate-spin" />}
                {t('auth.signIn')}
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="magic">
            {magicSent ? (
              <p className="text-muted-foreground pt-2 text-sm" role="status">
                {t('auth.magicLinkSent')}
              </p>
            ) : (
              <form onSubmit={sendMagicLink} className="grid gap-4 pt-2">
                {emailField}
                <Button type="submit" disabled={pending} className="w-full">
                  {pending && <Loader2 className="animate-spin" />}
                  {t('auth.sendMagicLink')}
                </Button>
              </form>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
