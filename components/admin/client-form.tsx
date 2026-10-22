'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import { SelectField, TextareaField, TextField } from '@/components/forms/fields'
import { applyServerErrors } from '@/components/forms/errors'
import { createClientAction, updateClientAction } from '@/lib/actions/clients'
import { CLIENT_STATUSES, clientFormSchema, type ClientFormValues } from '@/lib/schemas/client'
import { t, tDynamic } from '@/lib/i18n'

export function ClientForm({ clientId, defaultValues }: { clientId?: string; defaultValues: ClientFormValues }) {
  const router = useRouter()
  const form = useForm<ClientFormValues>({ resolver: zodResolver(clientFormSchema), defaultValues })
  const f = (k: keyof ClientFormValues) => tDynamic(`admin.clients.fields.${k}`)

  async function onSubmit(values: ClientFormValues) {
    const result = clientId ? await updateClientAction(clientId, values) : await createClientAction(values)
    if (!result.ok) {
      applyServerErrors(form, result.error)
      toast.error(result.error.message)
      return
    }
    toast.success(clientId ? t('admin.clients.updated') : t('admin.clients.created'))
    if (clientId) {
      form.reset(values)
      router.refresh()
    } else {
      router.push(`/admin/clientes/${result.data.id}`)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <Card>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <TextField control={form.control} name="name" label={f('name')} autoFocus={!clientId} />
            <TextField control={form.control} name="legal_name" label={f('legal_name')} />
            <TextField control={form.control} name="cnpj" label={f('cnpj')} inputMode="numeric" placeholder="00.000.000/0000-00" />
            <SelectField
              control={form.control}
              name="status"
              label={f('status')}
              options={CLIENT_STATUSES.map((s) => ({ value: s, label: tDynamic(`admin.clients.status.${s}`) }))}
            />
            <TextField control={form.control} name="main_contact_name" label={f('main_contact_name')} />
            <TextField control={form.control} name="main_contact_email" label={f('main_contact_email')} type="email" />
            <TextField control={form.control} name="started_at" label={f('started_at')} placeholder="dd/mm/aaaa" inputMode="numeric" />
            <div className="sm:col-span-2">
              <Alert>
                <AlertDescription>{t('admin.clients.billingNote')}</AlertDescription>
              </Alert>
            </div>
            <TextField control={form.control} name="plan" label={f('plan')} />
            <TextField control={form.control} name="contract_value_brl" label={f('contract_value_brl')} inputMode="decimal" placeholder="0,00" />
            <TextField control={form.control} name="billing_day" label={f('billing_day')} inputMode="numeric" />
            <TextareaField control={form.control} name="billing_notes" label={f('billing_notes')} className="sm:col-span-2" />
            <TextareaField control={form.control} name="notes" label={f('notes')} className="sm:col-span-2" rows={4} />
          </CardContent>
          <CardFooter className="justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting || (Boolean(clientId) && !form.formState.isDirty)}>
              {form.formState.isSubmitting && <Loader2 className="animate-spin" />}
              {clientId ? t('common.save') : t('common.create')}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}
