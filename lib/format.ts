// Formatação pt-BR: datas dd/mm/aaaa, BRL, fuso do workspace (padrão America/Sao_Paulo).

export const DEFAULT_TIMEZONE = 'America/Sao_Paulo'

type DateInput = Date | string | number | null | undefined

function toDate(value: DateInput): Date | null {
  if (value === null || value === undefined || value === '') return null
  // 'aaaa-mm-dd' (coluna date) é uma data civil: não converter de fuso.
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [y, m, d] = value.split('-').map(Number)
    return new Date(Date.UTC(y, m - 1, d, 12))
  }
  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

function isCivilDate(value: DateInput): boolean {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
}

/** dd/mm/aaaa */
export function formatDate(value: DateInput, timeZone: string = DEFAULT_TIMEZONE): string {
  const date = toDate(value)
  if (!date) return '—'
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: isCivilDate(value) ? 'UTC' : timeZone,
  }).format(date)
}

/** dd/mm/aaaa hh:mm */
export function formatDateTime(value: DateInput, timeZone: string = DEFAULT_TIMEZONE): string {
  const date = toDate(value)
  if (!date) return '—'
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone,
  })
    .format(date)
    .replace(',', '')
}

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

/** R$ 1.234,56 */
export function formatBRL(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === '') return '—'
  const n = typeof value === 'string' ? Number(value) : value
  return Number.isFinite(n) ? brl.format(n) : '—'
}

export function formatNumber(value: number | null | undefined, fractionDigits = 0): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return '—'
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value)
}

/** 'dd/mm/aaaa' → 'aaaa-mm-dd' (ou null se inválida). */
export function parseBRDate(input: string): string | null {
  const m = input.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (!m) return null
  const d = Number(m[1])
  const mo = Number(m[2])
  const y = Number(m[3])
  const date = new Date(Date.UTC(y, mo - 1, d))
  if (date.getUTCFullYear() !== y || date.getUTCMonth() !== mo - 1 || date.getUTCDate() !== d) return null
  return `${String(y).padStart(4, '0')}-${String(mo).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}
