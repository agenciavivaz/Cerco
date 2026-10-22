import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SectionPlaceholder } from '@/components/workspace/section-placeholder'
import { tDynamic } from '@/lib/i18n'
import { getWorkspaceContext } from '@/lib/workspace-context'
import { sectionsFor, WORKSPACE_SECTIONS, type WorkspaceSection } from '@/lib/workspace-nav'

// Seções dos marcos seguintes: estado vazio que ensina a metodologia (DEC-012).
// Cada marco substitui o placeholder por uma rota própria (app/w/[workspaceSlug]/<secao>/page.tsx).

type Params = Promise<{ workspaceSlug: string; section: string }>

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { section } = await params
  return { title: tDynamic(`workspace.nav.${section}`) }
}

export default async function SectionPage({ params }: { params: Params }) {
  const { workspaceSlug, section } = await params
  if (!(WORKSPACE_SECTIONS as readonly string[]).includes(section)) notFound()
  const { role } = await getWorkspaceContext(workspaceSlug)
  if (!sectionsFor(role).includes(section as WorkspaceSection)) notFound()
  return <SectionPlaceholder section={section as WorkspaceSection} />
}
