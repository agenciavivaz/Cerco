import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { t, tDynamic } from '@/lib/i18n'
import type { WorkspaceSection } from '@/lib/workspace-nav'

/** Estado vazio das seções de marcos futuros (DEC-012). */
export function SectionPlaceholder({ section }: { section: WorkspaceSection }) {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">{tDynamic(`workspace.nav.${section}`)}</h1>
      <Card className="border-dashed">
        <CardHeader>
          <div>
            <Badge variant="secondary">{t('common.comingSoon')}</Badge>
          </div>
          <CardTitle className="sr-only">{tDynamic(`workspace.nav.${section}`)}</CardTitle>
          <CardDescription className="text-base">{tDynamic(`workspace.empty.${section}`)}</CardDescription>
        </CardHeader>
        <CardContent />
      </Card>
    </div>
  )
}
