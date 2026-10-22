import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { t } from '@/lib/i18n'

export const PAGE_SIZE = 25

export function pageFromParams(page: string | undefined): number {
  const n = Number(page)
  return Number.isInteger(n) && n > 0 ? n : 1
}

/** Intervalo (inclusivo) para `.range()` do Supabase. */
export function pageRange(page: number, size = PAGE_SIZE): [number, number] {
  return [(page - 1) * size, page * size - 1]
}

export function Pagination({
  page,
  total,
  searchParams,
  basePath,
  size = PAGE_SIZE,
}: {
  page: number
  total: number
  searchParams: Record<string, string | undefined>
  basePath: string
  size?: number
}) {
  const pages = Math.max(1, Math.ceil(total / size))
  const href = (p: number) => {
    const params = new URLSearchParams()
    for (const [k, v] of Object.entries(searchParams)) if (v && k !== 'page') params.set(k, v)
    if (p > 1) params.set('page', String(p))
    const qs = params.toString()
    return qs ? `${basePath}?${qs}` : basePath
  }
  return (
    <div className="text-muted-foreground flex items-center justify-between gap-2 text-sm">
      <span>{t('common.results', { count: total })}</span>
      <div className="flex items-center gap-2">
        <span>{t('common.pageOf', { page, total: pages })}</span>
        <Button variant="outline" size="icon" asChild={page > 1} disabled={page <= 1} aria-label={t('common.previous')}>
          {page > 1 ? (
            <Link href={href(page - 1)}>
              <ChevronLeft />
            </Link>
          ) : (
            <ChevronLeft />
          )}
        </Button>
        <Button variant="outline" size="icon" asChild={page < pages} disabled={page >= pages} aria-label={t('common.next')}>
          {page < pages ? (
            <Link href={href(page + 1)}>
              <ChevronRight />
            </Link>
          ) : (
            <ChevronRight />
          )}
        </Button>
      </div>
    </div>
  )
}
