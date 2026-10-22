import { z } from 'zod'

// Variáveis públicas (disponíveis no browser). Referenciadas explicitamente para o Next embutir no bundle.
const publicSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  NEXT_PUBLIC_APP_URL: z.url().optional(),
  NEXT_PUBLIC_POSTHOG_KEY: z.string().optional(),
  NEXT_PUBLIC_POSTHOG_HOST: z.url().optional(),
  NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),
})

export const publicEnv = publicSchema.parse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || undefined,
  NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY || undefined,
  NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST || undefined,
  NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN || undefined,
})

const serverSchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().optional(),
  SENTRY_DSN: z.string().optional(),
  CRON_SECRET: z.string().optional(),
})

/** Só chamar no servidor. Lança se faltar variável obrigatória. */
export function serverEnv() {
  if (typeof window !== 'undefined') throw new Error('serverEnv() chamado no browser')
  return serverSchema.parse({
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    RESEND_API_KEY: process.env.RESEND_API_KEY || undefined,
    EMAIL_FROM: process.env.EMAIL_FROM || undefined,
    SENTRY_DSN: process.env.SENTRY_DSN || undefined,
    CRON_SECRET: process.env.CRON_SECRET || undefined,
  })
}

/** URL base do app: env explícita > URL do deploy na Vercel > localhost. */
export function appUrl(): string {
  if (publicEnv.NEXT_PUBLIC_APP_URL) return publicEnv.NEXT_PUBLIC_APP_URL.replace(/\/$/, '')
  const vercel = process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL || process.env.VERCEL_BRANCH_URL || process.env.VERCEL_URL
  if (vercel) return `https://${vercel}`
  return 'http://localhost:3000'
}
