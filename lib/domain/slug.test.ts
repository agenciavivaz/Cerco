import { describe, expect, it } from 'vitest'
import { isValidSlug, slugify } from './slug'

describe('slug', () => {
  it('remove acentos, espaços e símbolos', () => {
    expect(slugify('Sétima — Máquinas Agrícolas')).toBe('setima-maquinas-agricolas')
    expect(slugify('  Brandspot!  ')).toBe('brandspot')
    expect(slugify('Demo — Produtora B2B')).toBe('demo-produtora-b2b')
  })

  it('respeita o tamanho máximo sem terminar em hífen', () => {
    expect(slugify('a'.repeat(59) + ' b', 60)).toBe('a'.repeat(59))
  })

  it('valida o formato', () => {
    expect(isValidSlug('setima')).toBe(true)
    expect(isValidSlug('setima-2')).toBe(true)
    expect(isValidSlug('Setima')).toBe(false)
    expect(isValidSlug('-setima')).toBe(false)
    expect(isValidSlug('a')).toBe(false)
  })
})
