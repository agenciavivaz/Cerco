import { z } from './zod'
import { t } from '@/lib/i18n'

export const MEMBER_ROLES = ['manager', 'bdr', 'viewer'] as const
export type MemberRole = (typeof MEMBER_ROLES)[number]

export const accessSchema = z.object({
  workspace_id: z.uuid(),
  role: z.enum(MEMBER_ROLES),
})

export const inviteFormSchema = z
  .object({
    full_name: z.string().trim().min(1).max(160),
    email: z.email().trim().toLowerCase(),
    is_platform_admin: z.boolean(),
    accesses: z.array(accessSchema),
  })
  .refine((v) => v.is_platform_admin || v.accesses.length > 0, {
    path: ['accesses'],
    message: t('admin.users.atLeastOneAccess'),
  })
export type InviteFormValues = z.infer<typeof inviteFormSchema>

export const setAccessSchema = z.object({
  user_id: z.uuid(),
  workspace_id: z.uuid(),
  role: z.enum(MEMBER_ROLES),
})

export const removeAccessSchema = z.object({
  user_id: z.uuid(),
  workspace_id: z.uuid(),
})

export const userIdSchema = z.object({ user_id: z.uuid() })

export const setAdminSchema = z.object({ user_id: z.uuid(), is_platform_admin: z.boolean() })
export const setStatusSchema = z.object({ user_id: z.uuid(), status: z.enum(['active', 'disabled']) })

export const passwordFormSchema = z
  .object({
    full_name: z.string().trim().min(1).max(160),
    password: z.string().min(8, t('auth.passwordMin')).max(72),
    confirm: z.string(),
  })
  .refine((v) => v.password === v.confirm, { path: ['confirm'], message: t('auth.passwordMismatch') })
export type PasswordFormValues = z.infer<typeof passwordFormSchema>
