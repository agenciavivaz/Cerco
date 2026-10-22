'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Link2, Loader2, Mail, Plus, ShieldCheck, ShieldOff, Trash2, UserCheck, UserX } from 'lucide-react'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CopyLink } from '@/components/admin/copy-link'
import {
  generateAccessLinkAction,
  removeAccessAction,
  resendInviteAction,
  setAccessAction,
  setPlatformAdminAction,
  setUserStatusAction,
} from '@/lib/actions/users'
import type { ActionResult } from '@/lib/actions/result'
import { MEMBER_ROLES, type MemberRole } from '@/lib/schemas/user'
import { t, tDynamic } from '@/lib/i18n'

type Props = {
  user: { id: string; name: string; isPlatformAdmin: boolean; status: 'active' | 'disabled'; pending: boolean; isSelf: boolean }
  access: Array<{ workspace_id: string; name: string; role: MemberRole }>
  workspaces: Array<{ id: string; label: string }>
}

function RoleSelect({ value, onChange, disabled }: { value: MemberRole; onChange: (r: MemberRole) => void; disabled?: boolean }) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as MemberRole)} disabled={disabled}>
      <SelectTrigger className="w-32" aria-label={t('admin.users.role')}>
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
  )
}

export function UserAccessPanel({ user, access, workspaces }: Props) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [link, setLink] = useState<string | null>(null)
  const free = workspaces.filter((w) => !access.some((a) => a.workspace_id === w.id))
  const [newWs, setNewWs] = useState<string>('')
  const [newRole, setNewRole] = useState<MemberRole>('bdr')

  function run<T>(fn: () => Promise<ActionResult<T>>, success: string, after?: (data: T) => void) {
    startTransition(async () => {
      const result = await fn()
      if (!result.ok) {
        toast.error(result.error.message)
        return
      }
      toast.success(success)
      after?.(result.data)
      router.refresh()
    })
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('admin.users.access')}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          {access.length === 0 && <p className="text-muted-foreground text-sm">{t('admin.users.noAccess')}</p>}
          {access.map((a) => (
            <div key={a.workspace_id} className="flex flex-wrap items-center justify-between gap-2">
              <span className="min-w-0 truncate font-medium">{a.name}</span>
              <div className="flex items-center gap-2">
                <RoleSelect
                  value={a.role}
                  disabled={pending}
                  onChange={(role) =>
                    run(() => setAccessAction({ user_id: user.id, workspace_id: a.workspace_id, role }), t('admin.users.accessUpdated'))
                  }
                />
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={pending}
                  aria-label={t('admin.users.removeAccess')}
                  onClick={() =>
                    run(() => removeAccessAction({ user_id: user.id, workspace_id: a.workspace_id }), t('admin.users.accessRemoved'))
                  }
                >
                  <Trash2 />
                </Button>
              </div>
            </div>
          ))}
          {free.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 border-t pt-3">
              <Select value={newWs} onValueChange={setNewWs}>
                <SelectTrigger className="min-w-0 flex-1" aria-label={t('admin.users.workspace')}>
                  <SelectValue placeholder={t('admin.users.workspace')} />
                </SelectTrigger>
                <SelectContent>
                  {free.map((w) => (
                    <SelectItem key={w.id} value={w.id}>
                      {w.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <RoleSelect value={newRole} onChange={setNewRole} />
              <Button
                variant="outline"
                disabled={!newWs || pending}
                onClick={() =>
                  run(
                    () => setAccessAction({ user_id: user.id, workspace_id: newWs, role: newRole }),
                    t('admin.users.accessAdded'),
                    () => setNewWs(''),
                  )
                }
              >
                <Plus /> {t('admin.users.addAccess')}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('common.actions')}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              disabled={pending}
              onClick={() =>
                run(() => resendInviteAction({ user_id: user.id }), t('admin.users.resent'), (d) => {
                  if (!d.email_sent) toast.warning(t('admin.users.emailNotSent', { reason: 'SMTP' }))
                  if (d.link) setLink(d.link)
                })
              }
            >
              <Mail /> {t('admin.users.resendInvite')}
            </Button>
            <Button
              variant="outline"
              disabled={pending}
              onClick={() => run(() => generateAccessLinkAction({ user_id: user.id }), t('admin.users.newInviteLink'), (d) => setLink(d.link))}
            >
              <Link2 /> {t('admin.users.newInviteLink')}
            </Button>

            {!user.isSelf && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" disabled={pending}>
                    {user.isPlatformAdmin ? <ShieldOff /> : <ShieldCheck />}
                    {user.isPlatformAdmin ? t('admin.users.removeAdmin') : t('admin.users.makeAdmin')}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{user.isPlatformAdmin ? t('admin.users.removeAdmin') : t('admin.users.makeAdmin')}</AlertDialogTitle>
                    <AlertDialogDescription>
                      {user.isPlatformAdmin
                        ? t('admin.users.removeAdminConfirm', { name: user.name })
                        : t('admin.users.makeAdminConfirm', { name: user.name })}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() =>
                        run(
                          () => setPlatformAdminAction({ user_id: user.id, is_platform_admin: !user.isPlatformAdmin }),
                          t('admin.users.adminChanged'),
                        )
                      }
                    >
                      {t('common.confirm')}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}

            {!user.isSelf && (
              <Button
                variant={user.status === 'active' ? 'destructive' : 'outline'}
                disabled={pending}
                onClick={() =>
                  run(
                    () => setUserStatusAction({ user_id: user.id, status: user.status === 'active' ? 'disabled' : 'active' }),
                    user.status === 'active' ? t('admin.users.disabledToast') : t('admin.users.enabledToast'),
                  )
                }
              >
                {pending ? <Loader2 className="animate-spin" /> : user.status === 'active' ? <UserX /> : <UserCheck />}
                {user.status === 'active' ? t('admin.users.disable') : t('admin.users.enable')}
              </Button>
            )}
          </div>
          {link && <CopyLink link={link} />}
        </CardContent>
      </Card>
    </div>
  )
}
