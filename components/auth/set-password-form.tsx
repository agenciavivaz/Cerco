'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { setPasswordAction } from '@/lib/actions/session'
import { passwordFormSchema, type PasswordFormValues } from '@/lib/schemas/user'
import { applyServerErrors } from '@/components/forms/errors'
import { t } from '@/lib/i18n'

export function SetPasswordForm({ email, defaultName }: { email: string; defaultName: string }) {
  const router = useRouter()
  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: { full_name: defaultName, password: '', confirm: '' },
  })

  async function onSubmit(values: PasswordFormValues) {
    const result = await setPasswordAction(values)
    if (!result.ok) {
      applyServerErrors(form, result.error)
      toast.error(result.error.message)
      return
    }
    router.replace('/')
    router.refresh()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">{t('auth.setPasswordTitle')}</CardTitle>
        <CardDescription>
          {email} · {t('auth.setPasswordSubtitle')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4" noValidate>
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('auth.fullName')}</FormLabel>
                  <FormControl>
                    <Input autoComplete="name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('auth.newPassword')}</FormLabel>
                  <FormControl>
                    <Input type="password" autoComplete="new-password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('auth.confirmPassword')}</FormLabel>
                  <FormControl>
                    <Input type="password" autoComplete="new-password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && <Loader2 className="animate-spin" />}
              {t('auth.setPassword')}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
