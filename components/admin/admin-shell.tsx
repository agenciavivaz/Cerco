'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { ArrowLeftRight, Building, History, Layers, Menu, ShieldCheck, Users, type LucideIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { UserMenu } from '@/components/user-menu'
import { useIdentify } from '@/lib/analytics/client'
import { brand } from '@/lib/config/brand'
import { t } from '@/lib/i18n'
import { cn } from '@/lib/utils'

const NAV: Array<{ href: string; label: string; icon: LucideIcon }> = [
  { href: '/admin/clientes', label: t('admin.nav.clientes'), icon: Building },
  { href: '/admin/workspaces', label: t('admin.nav.workspaces'), icon: Layers },
  { href: '/admin/usuarios', label: t('admin.nav.usuarios'), icon: Users },
  { href: '/admin/auditoria', label: t('admin.nav.auditoria'), icon: History },
]

export function AdminShell({
  user,
  children,
}: {
  user: { id: string; name: string; email: string }
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  useIdentify({ user_id: user.id, is_platform_admin: true })

  const nav = (onNavigate?: () => void) => (
    <div className="flex h-full flex-col gap-4 p-3">
      <Link href="/admin" onClick={onNavigate} className="flex items-center gap-2 px-2 pt-1 font-semibold tracking-tight">
        <span className="grid size-7 place-items-center rounded-md bg-amber-500 text-amber-950">
          <ShieldCheck className="size-4" />
        </span>
        {brand.appName}
        <Badge className="bg-amber-500 text-amber-950 hover:bg-amber-500">{t('admin.modeBadge')}</Badge>
      </Link>
      <nav className="grid gap-1" aria-label={t('admin.title')}>
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`)
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                active
                  ? 'bg-amber-500/15 text-amber-900 dark:text-amber-200'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              <Icon className="size-4" />
              {label}
            </Link>
          )
        })}
      </nav>
      <Link
        href="/"
        onClick={onNavigate}
        className="text-muted-foreground hover:text-foreground mt-auto flex items-center gap-3 rounded-md px-3 py-2 text-sm"
      >
        <ArrowLeftRight className="size-4" />
        {t('admin.goToApp')}
      </Link>
    </div>
  )

  return (
    <div className="flex min-h-dvh">
      <aside className="hidden w-64 shrink-0 border-r border-amber-500/30 bg-amber-50/40 md:block dark:bg-amber-950/10">
        <div className="sticky top-0 h-dvh">{nav()}</div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="h-1 bg-amber-500" aria-hidden />
        <header className="bg-background/95 sticky top-0 z-30 flex h-14 items-center gap-2 border-b px-4 backdrop-blur">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label={t('common.openMenu')}>
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <SheetTitle className="sr-only">{t('admin.title')}</SheetTitle>
              {nav(() => setOpen(false))}
            </SheetContent>
          </Sheet>
          <span className="text-sm font-semibold">{t('admin.title')}</span>
          <div className="ml-auto">
            <UserMenu name={user.name} email={user.email} isPlatformAdmin />
          </div>
        </header>
        <main className="flex-1 px-4 py-6 md:px-8">{children}</main>
      </div>
    </div>
  )
}
