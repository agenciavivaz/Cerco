import * as Sentry from '@sentry/nextjs'

// Sentry no browser. No-op sem NEXT_PUBLIC_SENTRY_DSN (DEC-011).
const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN

if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.NEXT_PUBLIC_VERCEL_ENV ?? process.env.NODE_ENV,
    tracesSampleRate: 0.1,
  })
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart
