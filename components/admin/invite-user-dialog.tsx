'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Plus, Trash2, UserPlus } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SwitchField, TextField } from '@/components/forms/fields'
import { applyServerErrors } from '@/components/forms/errors'
import { CopyLink } from '@/components/admin/copy-link'
import { inviteUserAction } from '@/lib/actions/users'
import { inviteFormSchema, MEMBER_ROLES, type InviteFormValues } from '@/lib/schemas/user'
import { t, tDynamic } from '@/lib/i18n'

type WorkspaceOption = { id: string; label: string }

const EMPTY: InviteFormValues = { full_name: '', email: '', is_platform_admin: false, accesses: [] }

export function InviteUserDialog({ workspaces }: { workspaces: WorkspaceOption[] }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [link, setLink] = useState<string | null>(null)
  const form = useForm<InviteFormValues>({ resolver: zodResolver(inviteFormSchema), defaultValues: EMPTY })
  const accesses = useFieldArray({ control: form.control, name: 'accesses' })
  const used = new Set(form.watch('accesses').map((a) => a.workspace_id))

  async function onSubmit(values: InviteFormValues) {
    const result = await inviteUserAction(values)
    if (!result.ok) {
      applyServerErrors(form, result.error)
      toast.error(result.error.message)
      return
    }
    toast.success(t('admin.users.invited', { email: values.email }))
    if (!result.data.email_sent) toast.warning(t('admin.users.emailNotSent', { reason: result.data.email_error ?? '' }))
    router.refresh()
    if (result.data.link) {
      setLink(result.data.link)
    } else {
      setOpen(false)
      form.reset(EMPTY)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v)
        if (!v) {
          setLink(null)
          form.reset(EMPTY)
        }
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <UserPlus /> {t('admin.users.invite')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t('admin.users.inviteTitle')}</DialogTitle>
          <DialogDescription>{t('admin.users.inviteHelp')}</DialogDescription>
        </DialogHeader>

        {link ? (
          <div className="grid gap-4">
            <CopyLink link={link} />
            <DialogFooter>
              <Button onClick={() => setOpen(false)}>{t('common.close')}</Button>
            </DialogFooter>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4" noValidate>
              <TextField control={form.control} name="full_name" label={t('admin.users.fields.full_name')} autoFocus />
              <TextField control={form.control} name="email" label={t('admin.users.fields.email')} type="email" />

              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{t('admin.users.access')}</span>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={used.size >= workspaces.length}
                    onClick={() => {
                      const free = workspaces.find((w) => !used.has(w.id))
                      if (free) accesses.append({ workspace_id: free.id, role: 'bdr' })
                    }}
                  >
                    <Plus /> {t('admin.users.addAccess')}
                  </Button>
                </div>
                {accesses.fields.map((item, index) => (
                  <div key={item.id} className="flex items-start gap-2">
                    <FormField
                      control={form.control}
                      name={`accesses.${index}.workspace_id`}
                      render={({ field }) => (
                        <FormItem className="min-w-0 flex-1">
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger className="w-full" aria-label={t('admin.users.workspace')}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {workspaces.map((w) => (
                                <SelectItem key={w.id} value={w.id} disabled={used.has(w.id) && w.id !== field.value}>
                                  {w.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`accesses.${index}.role`}
                      render={({ field }) => (
                        <FormItem className="w-32">
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger className="w-full" aria-label={t('admin.users.role')}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {MEMBER_ROLES.map((r) => (
                                <SelectItem key={r} value={r}>
                                  {tDynamic(`workspace.role.${r}`)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => accesses.remove(index)}
                      aria-label={t('admin.users.removeAccess')}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                ))}
                <FormField control={form.control} name="accesses" render={() => <FormItem><FormMessage /></FormItem>} />
              </div>

              <SwitchField control={form.control} name="is_platform_admin" label={t('admin.users.fields.is_platform_admin')} />

              <DialogFooter>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting && <Loader2 className="animate-spin" />}
                  {t('admin.users.invite')}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  )
}
