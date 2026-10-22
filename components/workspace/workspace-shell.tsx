'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  Building2,
  ChevronsUpDown,
  FileUp,
  Home,
  ListChecks,
  Megaphone,
  Menu,
  Settings,
  ShieldCheck,
  Target,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { UserMenu } from '@/components/user-menu'
import { brand } from '@/lib/config/brand'
import { useIdentify } from '@/lib/analytics/client'
import { t, tDynamic } from '@/lib/i18n'
import type { WorkspaceSection } from '@/lib/workspace-nav'
import { cn } from '@/lib/utils'

const ICONS: Record<WorkspaceSection, LucideIcon> = {
  inicio: Home,
  fila: ListChecks,
  programas: Target,
  contas: Building2,
  contatos: Users,
  ads: Megaphone,
  importacoes: FileUp,
  configuracoes: Settings,
}

type Role = 'manager' | 'bdr' | 'viewer' | null

type Props = {
  workspace: { id: string; name: string; slug: string }
  workspaces: Array<{ id: string; name: string; slug: string; role: Role }>
  role: Role
  sections: WorkspaceSection[]
  user: { id: string; name: string; email: string; isPlatformAdmin: boolean }
  asAdmin: boolean
  children: React.ReactNode
}

function WorkspaceSwitcher({ workspace, workspaces }: Pick<Props, 'workspace' | 'workspaces'>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-auto w-full justify-between px-2 py-2" aria-label={t('workspace.switchTo')}>
          <span className="flex min-w-0 flex-col items-start">
            <span className="text-muted-foreground text-xs font-normal">{t('workspace.switcherLabel')}</span>
            <span className="truncate text-sm font-semibold">{workspace.name}</span>
          </span>
          <ChevronsUpDown className="text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel>{t('workspace.switchTo')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {workspaces.map((w) => (
          <DropdownMenuItem key={w.id} asChild>
            <Link href={`/w/${w.slug}`} className={cn(w.id === workspace.id && 'font-semibold')}>
              <span className="truncate">{w.name}</span>
              {w.role && (
                <span className="text-muted-foreground ml-auto text-xs">{tDynamic(`workspace.role.${w.role}`)}</span>
              )}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function NavLinks({
  slug,
  sections,
  onNavigate,
}: {
  slug: string
  sections: WorkspaceSection[]
  onNavigate?: () => void
}) {
  const pathname = usePathname()
  return (
    <nav className="grid gap-1" aria-label={brand.appName}>
      {sections.map((s) => {
        const href = `/w/${slug}/${s}`
        const active = pathname === href || pathname.startsWith(`${href}/`)
        const Icon = ICONS[s]
        return (
          <Link
            key={s}
            href={href}
            onClick={onNavigate}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
              active ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            )}
          >
            <Icon className="size-4" />
            {tDynamic(`workspace.nav.${s}`)}
          </Link>
        )
      })}
    </nav>
  )
}

export function WorkspaceShell({ workspace, workspaces, role, sections, user, asAdmin, children }: Props) {
  const [open, setOpen] = useState(false)
  useIdentify({ user_id: user.id, workspace_id: workspace.id, role, is_platform_admin: user.isPlatformAdmin })

  const sidebar = (onNavigate?: () => void) => (
    <div className="flex h-full flex-col gap-4 p-3">
      <Link href="/" className="flex items-center gap-2 px-2 pt-1 font-semibold tracking-tight" onClick={onNavigate}>
        <span className="bg-primary text-primary-foreground grid size-7 place-items-center rounded-md text-xs">
          {brand.appName.slice(0, 1).toUpperCase()}
        </span>
        {brand.appName}
      </Link>
      <WorkspaceSwitcher workspace={workspace} workspaces={workspaces} />
      <NavLinks slug={workspace.slug} sections={sections} onNavigate={onNavigate} />
      {user.isPlatformAdmin && (
        <Link
          href="/admin"
          onClick={onNavigate}
          className="text-muted-foreground hover:text-foreground mt-auto flex items-center gap-3 rounded-md px-3 py-2 text-sm"
        >
          <ShieldCheck className="size-4" />
          {t('workspace.adminArea')}
        </Link>
      )}
    </div>
  )

  return (
    <div className="flex min-h-dvh">
      <aside className="bg-sidebar hidden w-64 shrink-0 border-r md:block">
        <div className="sticky top-0 h-dvh">{sidebar()}</div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        {asAdmin && (
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 bg-amber-500 px-4 py-1.5 text-center text-sm font-medium text-amber-950" role="status">
            <ShieldCheck className="size-4" />
            {t('workspace.adminBanner')}
            <Link href="/admin/workspaces" className="underline underline-offset-2">
              {t('workspace.adminBannerExit')}
            </Link>
          </div>
        )}
        <header className="bg-background/95 supports-[backdrop-filter]:bg-background/80 sticky top-0 z-30 flex h-14 items-center gap-2 border-b px-4 backdrop-blur">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label={t('common.openMenu')}>
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <SheetTitle className="sr-only">{brand.appName}</SheetTitle>
              {sidebar(() => setOpen(false))}
            </SheetContent>
          </Sheet>
          <span className="truncate text-sm font-semibold md:hidden">{workspace.name}</span>
          <div className="ml-auto flex items-center gap-2">
            {role && (
              <span className="text-muted-foreground hidden text-xs sm:inline">{tDynamic(`workspace.role.${role}`)}</span>
            )}
            <UserMenu name={user.name} email={user.email} isPlatformAdmin={user.isPlatformAdmin} />
          </div>
        </header>
        <main className="flex-1 px-4 py-6 md:px-8">{children}</main>
      </div>
    </div>
  )
}
