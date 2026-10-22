import { describe, expect, it } from 'vitest'
import { brazilianNationalHolidays, easterSunday } from './holidays'

describe('feriados nacionais', () => {
  it('calcula a Páscoa', () => {
    expect(easterSunday(2026)).toEqual({ month: 4, day: 5 })
    expect(easterSunday(2027)).toEqual({ month: 3, day: 28 })
  })

  it('lista os 10 feriados de 2026 com Sexta-feira Santa e Consciência Negra', () => {
    const h = brazilianNationalHolidays(2026)
    expect(h).toHaveLength(10)
    expect(h).toContain('2026-04-03')
    expect(h).toContain('2026-11-20')
    expect(h).toContain('2026-01-01')
    expect(h).not.toContain('2026-02-17') // Carnaval é ponto facultativo
    expect([...h].sort()).toEqual(h)
  })
})
