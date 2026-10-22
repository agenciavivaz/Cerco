import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export function PageHeader({
  title,
  description,
  actions,
  backHref,
  backLabel,
}: {
  title: string
  description?: React.ReactNode
  actions?: React.ReactNode
  backHref?: string
  backLabel?: string
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {backHref && (
          <Link href={backHref} className="text-muted-foreground hover:text-foreground mb-1 inline-flex items-center gap-1 text-sm">
            <ChevronLeft className="size-4" />
            {backLabel}
          </Link>
        )}
        <h1 className="truncate text-2xl font-semibold tracking-tight">{title}</h1>
        {description && <div className="text-muted-foreground mt-1 text-sm">{description}</div>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
    </div>
  )
}
