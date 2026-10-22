'use client'

import { useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { SelectField, SwitchField, TextareaField, TextField } from '@/components/forms/fields'
import { applyServerErrors } from '@/components/forms/errors'
import { createWorkspaceAction, updateWorkspaceAction } from '@/lib/actions/workspaces'
import { slugify } from '@/lib/domain/slug'
import { TIMEZONES, WORKSPACE_STATUSES, workspaceFormSchema, type WorkspaceFormValues } from '@/lib/schemas/workspace'
import { t, tDynamic } from '@/lib/i18n'

const WEEKDAYS = [1, 2, 3, 4, 5, 6, 0]
const HOURS = Array.from({ length: 24 }, (_, h) => ({ value: String(h), label: `${String(h).padStart(2, '0')}:00` }))

export function WorkspaceForm({
  workspaceId,
  defaultValues,
  clients,
}: {
  workspaceId?: string
  defaultValues: WorkspaceFormValues
  clients: Array<{ id: string; name: string }>
}) {
  const router = useRouter()
  const form = useForm<WorkspaceFormValues>({ resolver: zodResolver(workspaceFormSchema), defaultValues })
  const slugTouched = useRef(Boolean(workspaceId))
  const f = (k: string) => tDynamic(`admin.workspaces.fields.${k}`)
  const weekdayOptions = WEEKDAYS.map((d) => ({ value: String(d), label: tDynamic(`admin.workspaces.weekdays.${d}`) }))

  async function onSubmit(values: WorkspaceFormValues) {
    const result = workspaceId ? await updateWorkspaceAction(workspaceId, values) : await createWorkspaceAction(values)
    if (!result.ok) {
      applyServerErrors(form, result.error)
      toast.error(result.error.message)
      return
    }
    toast.success(workspaceId ? t('admin.workspaces.updated') : t('admin.workspaces.created'))
    if (workspaceId) {
      form.reset(values)
      router.refresh()
    } else {
      router.push(`/admin/workspaces/${result.data.id}`)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t('admin.workspaces.sections.general')}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <SelectField
              control={form.control}
              name="client_id"
              label={f('client_id')}
              options={clients.map((c) => ({ value: c.id, label: c.name }))}
            />
            <TextField
              control={form.control}
              name="name"
              label={f('name')}
              autoFocus={!workspaceId}
              onChange={(e) => {
                form.setValue('name', e.target.value, { shouldDirty: true })
                if (!slugTouched.current) form.setValue('slug', slugify(e.target.value), { shouldDirty: true })
              }}
            />
            <TextField
              control={form.control}
              name="slug"
              label={f('slug')}
              description={t('admin.workspaces.slugHelp', { slug: form.watch('slug') || 'slug' })}
              onChange={(e) => {
                slugTouched.current = true
                form.setValue('slug', e.target.value.toLowerCase(), { shouldDirty: true, shouldValidate: true })
              }}
            />
            <SelectField
              control={form.control}
              name="status"
              label={f('status')}
              options={WORKSPACE_STATUSES.map((s) => ({ value: s, label: tDynamic(`admin.workspaces.status.${s}`) }))}
            />
            <SelectField
              control={form.control}
              name="timezone"
              label={f('timezone')}
              options={TIMEZONES.map((tz) => ({ value: tz, label: tz.replace('America/', '').replace('_', ' ') }))}
            />
            <TextField control={form.control} name="ai_monthly_budget_usd" label={f('ai_monthly_budget_usd')} inputMode="decimal" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t('admin.workspaces.sections.flags')}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-3">
            <SwitchField control={form.control} name="flag_copilot" label={t('admin.workspaces.flags.copilot')} />
            <SwitchField control={form.control} name="flag_signal_hunter" label={t('admin.workspaces.flags.signal_hunter')} />
            <SwitchField control={form.control} name="flag_apollo" label={t('admin.workspaces.flags.apollo')} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t('admin.workspaces.sections.settings')}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="business_days"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>{f('business_days')}</FormLabel>
                  <div className="flex flex-wrap gap-3">
                    {WEEKDAYS.map((d) => (
                      <label key={d} className="flex items-center gap-2 text-sm">
                        <Checkbox
                          checked={field.value.includes(d)}
                          onCheckedChange={(checked) =>
                            field.onChange(checked ? [...field.value, d] : field.value.filter((v) => v !== d))
                          }
                        />
                        {tDynamic(`admin.workspaces.weekdays.${d}`)}
                      </label>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <TextareaField
              control={form.control}
              name="holidays_text"
              label={f('holidays')}
              description={f('holidaysHelp')}
              rows={6}
              className="sm:col-span-2"
            />
            <TextField control={form.control} name="score_hot" label={f('score_hot')} inputMode="numeric" />
            <TextField control={form.control} name="score_warm" label={f('score_warm')} inputMode="numeric" />
            <TextField
              control={form.control}
              name="frequency_target_weekly"
              label={f('frequency_target_weekly')}
              inputMode="numeric"
            />
            <TextField control={form.control} name="tracking_param" label={f('tracking_param')} />
            <TextareaField
              control={form.control}
              name="high_intent_paths_text"
              label={f('high_intent_paths')}
              description={f('high_intent_pathsHelp')}
              rows={3}
              className="sm:col-span-2"
            />
            <SelectField control={form.control} name="signal_hunter_weekday" label={f('signal_hunter_weekday')} options={weekdayOptions} />
            <SelectField control={form.control} name="signal_hunter_hour" label={f('signal_hunter_hour')} options={HOURS} />
            <SwitchField
              control={form.control}
              name="signal_hunter_include_t2"
              label={f('signal_hunter_include_t2')}
              className="sm:col-span-2"
            />
            <SelectField control={form.control} name="brief_weekday" label={f('brief_weekday')} options={weekdayOptions} />
            <SelectField control={form.control} name="brief_hour" label={f('brief_hour')} options={HOURS} />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting || (Boolean(workspaceId) && !form.formState.isDirty)}>
            {form.formState.isSubmitting && <Loader2 className="animate-spin" />}
            {workspaceId ? t('common.save') : t('common.create')}
          </Button>
        </div>
      </form>
    </Form>
  )
}
