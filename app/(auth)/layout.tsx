import { brand } from '@/lib/config/brand'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="bg-muted/40 flex min-h-dvh flex-col items-center justify-center px-4 py-10">
      <div className="mb-8 flex items-center gap-2 text-lg font-semibold tracking-tight">
        <span className="bg-primary text-primary-foreground grid size-8 place-items-center rounded-md text-sm">
          {brand.appName.slice(0, 1).toUpperCase()}
        </span>
        {brand.appName}
      </div>
      <div className="w-full max-w-sm">{children}</div>
    </main>
  )
}
