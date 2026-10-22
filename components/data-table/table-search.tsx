'use client'

import { useEffect, useState, useTransition } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { t } from '@/lib/i18n'

/** Busca com debounce que grava ?q= na URL (a consulta roda no servidor). */
export function TableSearch({ placeholder }: { placeholder?: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()
  const [value, setValue] = useState(params.get('q') ?? '')
  const [, startTransition] = useTransition()

  useEffect(() => {
    const current = params.get('q') ?? ''
    if (value === current) return
    const id = setTimeout(() => {
      const next = new URLSearchParams(params)
      if (value) next.set('q', value)
      else next.delete('q')
      next.delete('page')
      startTransition(() => router.replace(`${pathname}?${next.toString()}`))
    }, 300)
    return () => clearTimeout(id)
  }, [value, params, pathname, router])

  return (
    <div className="relative w-full max-w-sm">
      <Search className="text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
      <Input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder ?? t('common.searchPlaceholder')}
        aria-label={t('common.search')}
        className="pl-8"
      />
    </div>
  )
}
