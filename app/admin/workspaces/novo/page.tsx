import type { Metadata } from 'next'
import { WorkspaceForm } from '@/components/admin/workspace-form'
import { PageHeader } from '@/components/page-header'
import { requirePagePlatformAdmin } from '@/lib/auth'
import { workspaceRowToForm } from '@/lib/schemas/workspace'
import { t } from '@/lib/i18n'

export const metadata: Metadata = { title: t('admin.workspaces.new') }

export default async function NewWorkspacePage({ searchParams }: { searchParams: Promise<{ cliente?: string }> }) {
  const { cliente } = await searchParams
  const { supabase } = await requirePagePlatformAdmin()
  const { data: clients } = await supabase.from('clients').select('id, name').order('name')
  const clientId = clients?.some((c) => c.id === cliente) ? cliente : undefined

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader title={t('admin.workspaces.new')} backHref="/admin/workspaces" backLabel={t('admin.workspaces.title')} />
      <WorkspaceForm clients={clients ?? []} defaultValues={workspaceRowToForm(undefined, { client_id: clientId })} />
    </div>
  )
}
