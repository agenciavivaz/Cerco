import type { Metadata } from 'next'
import { ClientForm } from '@/components/admin/client-form'
import { PageHeader } from '@/components/page-header'
import { requirePagePlatformAdmin } from '@/lib/auth'
import { clientRowToForm } from '@/lib/schemas/client'
import { t } from '@/lib/i18n'

export const metadata: Metadata = { title: t('admin.clients.new') }

export default async function NewClientPage() {
  await requirePagePlatformAdmin()
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title={t('admin.clients.new')} backHref="/admin/clientes" backLabel={t('admin.clients.title')} />
      <ClientForm defaultValues={clientRowToForm()} />
    </div>
  )
}
