import { Card, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { signOutAction } from '@/lib/actions/session'
import { t } from '@/lib/i18n'

export default async function NoAccessPage({ searchParams }: { searchParams: Promise<{ motivo?: string }> }) {
  const { motivo } = await searchParams
  const disabled = motivo === 'desativado'
  return (
    <main className="bg-muted/40 flex min-h-dvh items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{disabled ? t('auth.disabledTitle') : t('auth.noAccessTitle')}</CardTitle>
          <CardDescription>{disabled ? t('auth.disabledBody') : t('auth.noAccessBody')}</CardDescription>
        </CardHeader>
        <CardFooter>
          <form action={signOutAction}>
            <Button variant="outline" type="submit">
              {t('auth.signOut')}
            </Button>
          </form>
        </CardFooter>
      </Card>
    </main>
  )
}
