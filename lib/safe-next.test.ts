import { describe, expect, it } from 'vitest'
import { safeNext } from './safe-next'

describe('safeNext', () => {
  it('aceita caminho interno e bloqueia open redirect', () => {
    expect(safeNext('/w/setima/fila')).toBe('/w/setima/fila')
    expect(safeNext('//evil.example')).toBe('/')
    expect(safeNext('https://evil.example')).toBe('/')
    expect(safeNext('/\\evil.example')).toBe('/')
    expect(safeNext(undefined)).toBe('/')
  })
})
