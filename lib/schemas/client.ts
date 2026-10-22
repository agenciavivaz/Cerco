import { z } from './zod'
import { t } from '@/lib/i18n'
import { cnpjDigits, isValidCnpj, formatCnpj } from '@/lib/domain/cnpj'
import { parseBRDate, formatDate } from '@/lib/format'

export const CLIENT_STATUSES = ['design_partner', 'active', 'paused', 'churned'] as const
export type ClientStatus = (typeof CLIENT_STATUSES)[number]

const optionalText = (max = 2000) => z.string().trim().max(max)

export const clientFormSchema = z.object({
  name: z.string().trim().min(1).max(160),
  legal_name: optionalText(200),
  cnpj: z
    .string()
    .trim()
    .refine((v) => v === '' || isValidCnpj(v), t('admin.clients.invalidCnpj')),
  status: z.enum(CLIENT_STATUSES),
  plan: optionalText(120),
  contract_value_brl: z
    .string()
    .trim()
    .refine((v) => v === '' || /^\d{1,3}(\.?\d{3})*(,\d{1,2})?$|^\d+([.,]\d{1,2})?$/.test(v), t('common.invalidField')),
  billing_day: z
    .string()
    .trim()
    .refine((v) => v === '' || (/^\d+$/.test(v) && Number(v) >= 1 && Number(v) <= 31), t('common.invalidField')),
  billing_notes: optionalText(),
  main_contact_name: optionalText(160),
  main_contact_email: z.union([z.literal(''), z.email()]),
  started_at: z
    .string()
    .trim()
    .refine((v) => v === '' || parseBRDate(v) !== null, t('common.invalidField')),
  notes: optionalText(5000),
})
export type ClientFormValues = z.infer<typeof clientFormSchema>

/** "1.234,56" | "1234.56" | "1234,5" → 1234.56 */
export function parseMoney(input: string): number | null {
  const v = input.trim()
  if (v === '') return null
  const normalized = v.includes(',') ? v.replace(/\./g, '').replace(',', '.') : v
  const n = Number(normalized)
  return Number.isFinite(n) ? n : null
}

const blank = (v: string) => (v.trim() === '' ? null : v.trim())

export function clientFormToRow(v: ClientFormValues) {
  return {
    name: v.name,
    legal_name: blank(v.legal_name),
    cnpj: v.cnpj ? cnpjDigits(v.cnpj) : null,
    status: v.status,
    plan: blank(v.plan),
    contract_value_brl: parseMoney(v.contract_value_brl),
    billing_day: v.billing_day ? Number(v.billing_day) : null,
    billing_notes: blank(v.billing_notes),
    main_contact_name: blank(v.main_contact_name),
    main_contact_email: blank(v.main_contact_email)?.toLowerCase() ?? null,
    started_at: v.started_at ? parseBRDate(v.started_at) : null,
    notes: blank(v.notes),
  }
}

export function clientRowToForm(row?: {
  name: string
  legal_name: string | null
  cnpj: string | null
  status: ClientStatus
  plan: string | null
  contract_value_brl: number | null
  billing_day: number | null
  billing_notes: string | null
  main_contact_name: string | null
  main_contact_email: string | null
  started_at: string | null
  notes: string | null
}): ClientFormValues {
  return {
    name: row?.name ?? '',
    legal_name: row?.legal_name ?? '',
    cnpj: row?.cnpj ? formatCnpj(row.cnpj) : '',
    status: row?.status ?? 'design_partner',
    plan: row?.plan ?? '',
    contract_value_brl:
      row?.contract_value_brl === null || row?.contract_value_brl === undefined
        ? ''
        : String(row.contract_value_brl).replace('.', ','),
    billing_day: row?.billing_day ? String(row.billing_day) : '',
    billing_notes: row?.billing_notes ?? '',
    main_contact_name: row?.main_contact_name ?? '',
    main_contact_email: row?.main_contact_email ?? '',
    started_at: row?.started_at ? formatDate(row.started_at) : '',
    notes: row?.notes ?? '',
  }
}
