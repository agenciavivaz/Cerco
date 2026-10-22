import { z } from './zod'
import { t } from '@/lib/i18n'
import { brandSlug } from '@/lib/config/brand'
import { defaultHolidays } from '@/lib/domain/holidays'
import { isValidSlug } from '@/lib/domain/slug'
import { parseBRDate, formatDate } from '@/lib/format'

// ---------- Formato armazenado em workspaces.settings / feature_flags (PRD §8.1) ----------

export const workspaceSettingsSchema = z.object({
  business_days: z.array(z.number().int().min(0).max(6)).default([1, 2, 3, 4, 5]),
  holidays: z.array(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).default(() => defaultHolidays()),
  score_thresholds: z
    .object({ hot: z.number().int().min(1).max(100).default(70), warm: z.number().int().min(0).max(99).default(40) })
    .default({ hot: 70, warm: 40 }),
  frequency_target_weekly: z.number().int().min(0).nullable().default(null),
  high_intent_paths: z.array(z.string()).default([]),
  tracking_param: z
    .string()
    .regex(/^[a-z0-9_]{1,24}$/)
    .default(() => brandSlug()),
  signal_hunter: z
    .object({
      weekday: z.number().int().min(0).max(6).default(1),
      hour: z.number().int().min(0).max(23).default(6),
      include_t2: z.boolean().default(false),
    })
    .default({ weekday: 1, hour: 6, include_t2: false }),
  brief: z
    .object({ weekday: z.number().int().min(0).max(6).default(1), hour: z.number().int().min(0).max(23).default(7) })
    .default({ weekday: 1, hour: 7 }),
})
export type WorkspaceSettings = z.infer<typeof workspaceSettingsSchema>

export const FEATURE_FLAGS = ['signal_hunter', 'apollo', 'copilot'] as const
export type FeatureFlag = (typeof FEATURE_FLAGS)[number]

export const featureFlagsSchema = z.object({
  signal_hunter: z.boolean().default(false),
  apollo: z.boolean().default(false),
  copilot: z.boolean().default(true),
})
export type FeatureFlags = z.infer<typeof featureFlagsSchema>

/** Lê o jsonb do banco completando com os padrões (valores inválidos caem no padrão). */
export function parseSettings(raw: unknown): WorkspaceSettings {
  const parsed = workspaceSettingsSchema.safeParse(raw ?? {})
  return parsed.success ? parsed.data : workspaceSettingsSchema.parse({})
}

export function parseFeatureFlags(raw: unknown): FeatureFlags {
  const parsed = featureFlagsSchema.safeParse(raw ?? {})
  return parsed.success ? parsed.data : featureFlagsSchema.parse({})
}

// ---------- Formulário do ADM (campos planos, strings) ----------

export const WORKSPACE_STATUSES = ['active', 'paused', 'archived'] as const
export const TIMEZONES = [
  'America/Sao_Paulo',
  'America/Manaus',
  'America/Cuiaba',
  'America/Fortaleza',
  'America/Recife',
  'America/Belem',
  'America/Bahia',
  'America/Porto_Velho',
  'America/Rio_Branco',
  'America/Noronha',
] as const

const intString = (min: number, max: number) =>
  z
    .string()
    .trim()
    .regex(/^\d+$/, t('common.invalidField'))
    .refine((v) => Number(v) >= min && Number(v) <= max, t('common.invalidField'))

function lines(text: string): string[] {
  return text
    .split(/\r?\n|,/)
    .map((l) => l.trim())
    .filter(Boolean)
}

export const workspaceFormSchema = z
  .object({
    client_id: z.uuid(),
    name: z.string().trim().min(1).max(120),
    slug: z.string().trim().refine(isValidSlug, t('admin.workspaces.slugInvalid')),
    status: z.enum(WORKSPACE_STATUSES),
    timezone: z.string().min(1),
    ai_monthly_budget_usd: z
      .string()
      .trim()
      .regex(/^\d+([.,]\d{1,2})?$/, t('common.invalidField')),
    business_days: z.array(z.number().int().min(0).max(6)).min(1),
    holidays_text: z.string(),
    score_hot: intString(1, 100),
    score_warm: intString(0, 99),
    frequency_target_weekly: z.union([z.literal(''), intString(0, 1000)]),
    high_intent_paths_text: z.string(),
    tracking_param: z.string().trim().regex(/^[a-z0-9_]{1,24}$/, t('common.invalidField')),
    signal_hunter_weekday: z.string(),
    signal_hunter_hour: intString(0, 23),
    signal_hunter_include_t2: z.boolean(),
    brief_weekday: z.string(),
    brief_hour: intString(0, 23),
    flag_signal_hunter: z.boolean(),
    flag_apollo: z.boolean(),
    flag_copilot: z.boolean(),
  })
  .superRefine((v, ctx) => {
    for (const line of lines(v.holidays_text)) {
      if (!parseBRDate(line)) {
        ctx.addIssue({ code: 'custom', path: ['holidays_text'], message: t('admin.workspaces.invalidDate', { value: line }) })
        break
      }
    }
    if (/^\d+$/.test(v.score_hot) && /^\d+$/.test(v.score_warm) && Number(v.score_warm) >= Number(v.score_hot)) {
      ctx.addIssue({ code: 'custom', path: ['score_warm'], message: t('admin.workspaces.warmBelowHot') })
    }
  })
export type WorkspaceFormValues = z.infer<typeof workspaceFormSchema>

/** Converte o formulário em colunas da tabela workspaces. */
export function workspaceFormToRow(v: WorkspaceFormValues) {
  const settings: WorkspaceSettings = {
    business_days: [...new Set(v.business_days)].sort(),
    holidays: [...new Set(lines(v.holidays_text).map((l) => parseBRDate(l)!))].sort(),
    score_thresholds: { hot: Number(v.score_hot), warm: Number(v.score_warm) },
    frequency_target_weekly: v.frequency_target_weekly === '' ? null : Number(v.frequency_target_weekly),
    high_intent_paths: lines(v.high_intent_paths_text),
    tracking_param: v.tracking_param,
    signal_hunter: {
      weekday: Number(v.signal_hunter_weekday),
      hour: Number(v.signal_hunter_hour),
      include_t2: v.signal_hunter_include_t2,
    },
    brief: { weekday: Number(v.brief_weekday), hour: Number(v.brief_hour) },
  }
  const feature_flags: FeatureFlags = {
    signal_hunter: v.flag_signal_hunter,
    apollo: v.flag_apollo,
    copilot: v.flag_copilot,
  }
  return {
    client_id: v.client_id,
    name: v.name,
    slug: v.slug,
    status: v.status,
    timezone: v.timezone,
    ai_monthly_budget_usd: Number(v.ai_monthly_budget_usd.replace(',', '.')),
    settings,
    feature_flags,
  }
}

/** Valores iniciais do formulário a partir de uma linha (ou padrões, para criação). */
export function workspaceRowToForm(row?: {
  client_id: string
  name: string
  slug: string
  status: (typeof WORKSPACE_STATUSES)[number]
  timezone: string
  ai_monthly_budget_usd: number
  settings: unknown
  feature_flags: unknown
}, defaults?: { client_id?: string }): WorkspaceFormValues {
  const s = parseSettings(row?.settings)
  const f = parseFeatureFlags(row?.feature_flags)
  return {
    client_id: row?.client_id ?? defaults?.client_id ?? '',
    name: row?.name ?? '',
    slug: row?.slug ?? '',
    status: row?.status ?? 'active',
    timezone: row?.timezone ?? 'America/Sao_Paulo',
    ai_monthly_budget_usd: String(row?.ai_monthly_budget_usd ?? 50),
    business_days: s.business_days,
    holidays_text: s.holidays.map((d) => formatDate(d)).join('\n'),
    score_hot: String(s.score_thresholds.hot),
    score_warm: String(s.score_thresholds.warm),
    frequency_target_weekly: s.frequency_target_weekly === null ? '' : String(s.frequency_target_weekly),
    high_intent_paths_text: s.high_intent_paths.join('\n'),
    tracking_param: s.tracking_param,
    signal_hunter_weekday: String(s.signal_hunter.weekday),
    signal_hunter_hour: String(s.signal_hunter.hour),
    signal_hunter_include_t2: s.signal_hunter.include_t2,
    brief_weekday: String(s.brief.weekday),
    brief_hour: String(s.brief.hour),
    flag_signal_hunter: f.signal_hunter,
    flag_apollo: f.apollo,
    flag_copilot: f.copilot,
  }
}
