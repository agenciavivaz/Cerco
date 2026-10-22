'use client'

import Link from 'next/link'
import { useTheme } from 'next-themes'
import { LogOut, Monitor, Moon, ShieldCheck, Sun } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { signOutAction } from '@/lib/actions/session'
import { resetAnalytics } from '@/lib/analytics/client'
import { t } from '@/lib/i18n'

function initials(name: string) {
  return (
    name
      .split(/[\s@.]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join('') || '?'
  )
}

export function UserMenu({ name, email, isPlatformAdmin }: { name: string; email: string; isPlatformAdmin: boolean }) {
  const { theme, setTheme } = useTheme()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full" aria-label={name}>
          <Avatar className="size-8">
            <AvatarFallback className="text-xs">{initials(name)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel className="font-normal">
          <div className="truncate text-sm font-medium">{name}</div>
          <div className="text-muted-foreground truncate text-xs">{email}</div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isPlatformAdmin && (
          <>
            <DropdownMenuItem asChild>
              <Link href="/admin">
                <ShieldCheck />
                {t('workspace.adminArea')}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuLabel className="text-muted-foreground text-xs">{t('common.theme')}</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={theme ?? 'system'} onValueChange={setTheme}>
          <DropdownMenuRadioItem value="light">
            <Sun /> {t('common.themeLight')}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark">
            <Moon /> {t('common.themeDark')}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="system">
            <Monitor /> {t('common.themeSystem')}
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => {
            resetAnalytics()
            void signOutAction()
          }}
        >
          <LogOut />
          {t('auth.signOut')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
