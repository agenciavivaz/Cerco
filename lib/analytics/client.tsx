'use client'

import posthog from 'posthog-js'
import { useEffect } from 'react'

// PostHog (PRD §15). No-op quando NEXT_PUBLIC_POSTHOG_KEY não está definido (DEC-011).
const KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY
const HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com'

let initialized = false

function init() {
  if (initialized || !KEY || typeof window === 'undefined') return
  posthog.init(KEY, {
    api_host: HOST,
    capture_pageview: 'history_change',
    person_profiles: 'identified_only',
    // Sem gravação de sessão na V1: a tela tem dados pessoais de contatos.
    disable_session_recording: true,
  })
  initialized = true
}

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    init()
  }, [])
  return <>{children}</>
}

export type AnalyticsContext = {
  user_id: string
  workspace_id?: string | null
  role?: string | null
  is_platform_admin?: boolean
}

/** Identifica o usuário e fixa workspace_id/role como propriedades de todos os eventos. */
export function useIdentify(ctx: AnalyticsContext | null) {
  const { user_id, workspace_id, role, is_platform_admin } = ctx ?? {}
  useEffect(() => {
    init()
    if (!initialized || !user_id) return
    posthog.identify(user_id, { is_platform_admin })
    posthog.register({ workspace_id: workspace_id ?? null, role: role ?? null })
    if (workspace_id) posthog.group('workspace', workspace_id)
  }, [user_id, workspace_id, role, is_platform_admin])
}

export function track(event: string, properties?: Record<string, unknown>) {
  init()
  if (initialized) posthog.capture(event, properties)
}

export function resetAnalytics() {
  if (initialized) posthog.reset()
}
