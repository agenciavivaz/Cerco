import 'server-only'
import { PostHog } from 'posthog-node'

// Eventos de servidor (ex.: jobs, imports). No-op sem chave (DEC-011).
let client: PostHog | null | undefined

function getClient(): PostHog | null {
  if (client !== undefined) return client
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
  client = key
    ? new PostHog(key, { host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com', flushAt: 1, flushInterval: 0 })
    : null
  return client
}

export async function captureServer(
  event: string,
  ctx: { user_id: string; workspace_id?: string | null; role?: string | null; program_id?: string | null },
  properties: Record<string, unknown> = {},
) {
  const ph = getClient()
  if (!ph) return
  ph.capture({
    distinctId: ctx.user_id,
    event,
    properties: { ...properties, workspace_id: ctx.workspace_id, role: ctx.role, program_id: ctx.program_id },
    groups: ctx.workspace_id ? { workspace: ctx.workspace_id } : undefined,
  })
  await ph.flush()
}
