import { redirect } from 'next/navigation'
import { getWorkspaceContext } from '@/lib/workspace-context'
import { homeSection } from '@/lib/workspace-nav'

export default async function WorkspaceIndex({ params }: { params: Promise<{ workspaceSlug: string }> }) {
  const { workspaceSlug } = await params
  const { role } = await getWorkspaceContext(workspaceSlug)
  redirect(`/w/${workspaceSlug}/${homeSection(role)}`)
}
