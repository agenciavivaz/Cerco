import * as Sentry from '@sentry/nextjs'

// Sentry no servidor e no edge. No-op sem SENTRY_DSN (DEC-011).
export async function register() {
  const dsn = process.env.SENTRY_DSN
  if (!dsn) return
  Sentry.init({
    dsn,
    environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV,
    tracesSampleRate: 0.1,
  })
}

export const onRequestError = Sentry.captureRequestError
