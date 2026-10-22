'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { t } from '@/lib/i18n'

export function CopyLink({ link, label }: { link: string; label?: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <div className="grid gap-2">
      <div className="text-sm font-medium">{label ?? t('admin.users.inviteLink')}</div>
      <div className="flex gap-2">
        <Input readOnly value={link} onFocus={(e) => e.currentTarget.select()} className="font-mono text-xs" data-testid="invite-link" />
        <Button
          type="button"
          variant="outline"
          onClick={async () => {
            await navigator.clipboard.writeText(link)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
          }}
          aria-label={t('admin.users.copyInviteLink')}
        >
          {copied ? <Check /> : <Copy />}
          {copied ? t('common.copied') : t('common.copy')}
        </Button>
      </div>
      <p className="text-muted-foreground text-xs">{t('admin.users.inviteLinkHelp')}</p>
    </div>
  )
}
