import { Badge } from '@/components/ui/badge'
import { tDynamic } from '@/lib/i18n'
import { cn } from '@/lib/utils'

const tone = {
  green: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
  amber: 'bg-amber-500/15 text-amber-700 dark:text-amber-300',
  gray: 'bg-muted text-muted-foreground',
  blue: 'bg-sky-500/15 text-sky-700 dark:text-sky-300',
  red: 'bg-red-500/15 text-red-700 dark:text-red-300',
} as const

function Tone({ color, children }: { color: keyof typeof tone; children: React.ReactNode }) {
  return (
    <Badge variant="outline" className={cn('border-transparent font-medium', tone[color])}>
      {children}
    </Badge>
  )
}

export function ClientStatusBadge({ status }: { status: 'design_partner' | 'active' | 'paused' | 'churned' }) {
  const color = { design_partner: 'blue', active: 'green', paused: 'amber', churned: 'gray' } as const
  return <Tone color={color[status]}>{tDynamic(`admin.clients.status.${status}`)}</Tone>
}

export function WorkspaceStatusBadge({ status }: { status: 'active' | 'paused' | 'archived' }) {
  const color = { active: 'green', paused: 'amber', archived: 'gray' } as const
  return <Tone color={color[status]}>{tDynamic(`admin.workspaces.status.${status}`)}</Tone>
}

export function UserStatusBadge({ status }: { status: 'active' | 'disabled' | 'pending' }) {
  const color = { active: 'green', disabled: 'red', pending: 'amber' } as const
  return <Tone color={color[status]}>{tDynamic(`admin.users.status.${status}`)}</Tone>
}

export function RoleBadge({ role }: { role: 'manager' | 'bdr' | 'viewer' }) {
  return <Badge variant="secondary">{tDynamic(`workspace.role.${role}`)}</Badge>
}
