import { describe, expect, it } from 'vitest'
import { formatBRL, formatDate, formatDateTime, parseBRDate } from './format'

describe('formatação pt-BR', () => {
  it('formata datas como dd/mm/aaaa no fuso de São Paulo', () => {
    // 02:00 UTC de 22/10 ainda é 21/10 em São Paulo.
    expect(formatDate('2026-10-22T02:00:00Z')).toBe('21/10/2026')
    expect(formatDate('2026-10-22T02:00:00Z', 'UTC')).toBe('22/10/2026')
  })

  it('não desloca datas civis (coluna date)', () => {
    expect(formatDate('2026-01-01')).toBe('01/01/2026')
  })

  it('formata data e hora', () => {
    expect(formatDateTime('2026-10-21T15:30:00Z')).toBe('21/10/2026 12:30')
  })

  it('formata BRL', () => {
    expect(formatBRL(1234.5).replace(/\s/g, ' ')).toBe('R$ 1.234,50')
    expect(formatBRL(null)).toBe('—')
  })

  it('converte dd/mm/aaaa em ISO e rejeita datas impossíveis', () => {
    expect(parseBRDate('09/03/2026')).toBe('2026-03-09')
    expect(parseBRDate('9/3/2026')).toBe('2026-03-09')
    expect(parseBRDate('31/02/2026')).toBeNull()
    expect(parseBRDate('2026-03-09')).toBeNull()
  })
})
