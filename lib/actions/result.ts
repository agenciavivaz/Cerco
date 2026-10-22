import type { z } from 'zod'
import { t, type MessageKey } from '@/lib/i18n'

export type ActionErrorCode = 'validation' | 'forbidden' | 'notFound' | 'unauthenticated' | 'db' | 'conflict'

export type ActionError = {
  code: ActionErrorCode
  message: string
  fieldErrors?: Record<string, string>
}

export type ActionResult<T = null> = { ok: true; data: T } | { ok: false; error: ActionError }

export function ok<T>(data: T): ActionResult<T> {
  return { ok: true, data }
}

export function fail(code: ActionErrorCode, detail?: unknown, message?: string): ActionResult<never> {
  const error: ActionError = { code, message: message ?? t(`errors.${code}` as MessageKey) }
  if (code === 'validation' && detail && typeof detail === 'object' && 'issues' in detail) {
    error.fieldErrors = {}
    for (const issue of (detail as z.ZodError).issues) {
      const key = issue.path.join('.')
      if (!(key in error.fieldErrors)) error.fieldErrors[key] = issue.message
    }
  }
  if (code === 'db' && detail && typeof detail === 'object' && 'code' in detail) {
    const pgCode = (detail as { code?: string }).code
    if (pgCode === '23505') return { ok: false, error: { ...error, code: 'conflict', message: t('errors.conflict') } }
    if (pgCode === '42501') return { ok: false, error: { ...error, code: 'forbidden', message: t('errors.forbidden') } }
    console.error('[action:db]', detail)
  }
  return { ok: false, error }
}

/** Para erros esperados lançados de helpers (ex.: requirePlatformAdmin). */
export class ActionFailure extends Error {
  constructor(public readonly result: ActionResult<never>) {
    super(result.ok ? 'ok' : result.error.message)
  }
}

/** Executa a action convertendo ActionFailure em resultado. */
export async function runAction<T>(fn: () => Promise<ActionResult<T>>): Promise<ActionResult<T>> {
  try {
    return await fn()
  } catch (e) {
    if (e instanceof ActionFailure) return e.result
    throw e
  }
}
