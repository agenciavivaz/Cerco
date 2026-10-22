'use client'

import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { t } from '@/lib/i18n'

type Option = { id: string; label: string }
type Values = { ator?: string; ws?: string; acao?: string; entidade?: string; de?: string; ate?: string }

const ALL = '__all'
const ENTITIES = ['client', 'workspace', 'workspace_member', 'profile', 'platform_setting']

export function AuditFilters({ actors, workspaces, values }: { actors: Option[]; workspaces: Option[]; values: Values }) {
  const router = useRouter()
  const pathname = usePathname()
  const [v, setV] = useState<Values>(values)
  const set = (k: keyof Values) => (value: string) => setV((s) => ({ ...s, [k]: value === ALL ? undefined : value }))

  function apply(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    for (const [k, val] of Object.entries(v)) if (val) params.set(k, val)
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <form onSubmit={apply} className="grid gap-3 rounded-md border p-3 sm:grid-cols-3 lg:grid-cols-6">
      <div className="grid gap-1">
        <Label className="text-xs">{t('admin.audit.fields.actor')}</Label>
        <Select value={v.ator ?? ALL} onValueChange={set('ator')}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>{t('admin.audit.allActors')}</SelectItem>
            <SelectItem value="sistema">{t('admin.audit.system')}</SelectItem>
            {actors.map((a) => (
              <SelectItem key={a.id} value={a.id}>
                {a.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-1">
        <Label className="text-xs">{t('admin.audit.fields.workspace')}</Label>
        <Select value={v.ws ?? ALL} onValueChange={set('ws')}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>{t('admin.audit.allWorkspaces')}</SelectItem>
            {workspaces.map((w) => (
              <SelectItem key={w.id} value={w.id}>
                {w.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-1">
        <Label className="text-xs">{t('admin.audit.fields.entity')}</Label>
        <Select value={v.entidade ?? ALL} onValueChange={set('entidade')}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>—</SelectItem>
            {ENTITIES.map((e) => (
              <SelectItem key={e} value={e}>
                {e}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-1">
        <Label className="text-xs" htmlFor="f-acao">
          {t('admin.audit.fields.action')}
        </Label>
        <Input id="f-acao" value={v.acao ?? ''} onChange={(e) => set('acao')(e.target.value)} />
      </div>
      <div className="grid gap-1">
        <Label className="text-xs" htmlFor="f-de">
          {t('admin.audit.fields.from')}
        </Label>
        <Input id="f-de" placeholder="dd/mm/aaaa" value={v.de ?? ''} onChange={(e) => set('de')(e.target.value)} />
      </div>
      <div className="grid gap-1">
        <Label className="text-xs" htmlFor="f-ate">
          {t('admin.audit.fields.to')}
        </Label>
        <Input id="f-ate" placeholder="dd/mm/aaaa" value={v.ate ?? ''} onChange={(e) => set('ate')(e.target.value)} />
      </div>
      <div className="flex gap-2 sm:col-span-3 lg:col-span-6">
        <Button type="submit" size="sm">
          {t('admin.audit.filter')}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => {
            setV({})
            router.push(pathname)
          }}
        >
          {t('admin.audit.clear')}
        </Button>
      </div>
    </form>
  )
}
