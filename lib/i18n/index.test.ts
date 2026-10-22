import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { brandSlug } from '@/lib/config/brand'
import { interpolate, t } from './index'

describe('i18n e nomes via env', () => {
  it('preenche {app} e {method} a partir do env', () => {
    expect(t('auth.loginTitle')).toBe('Entrar no Cerco Teste')
    expect(t('workspace.empty.programas')).toContain('Método Teste')
  })

  it('interpola variáveis e mantém placeholders desconhecidos', () => {
    expect(interpolate('{a} e {b}', { a: 1 })).toBe('1 e {b}')
  })

  it('deriva slug do nome do app', () => {
    expect(brandSlug('Método Comitê')).toBe('metodocomite')
  })

  it('nenhum nome provisório fixo no código-fonte', () => {
    const roots = ['app', 'components', 'lib', 'messages']
    const offenders: string[] = []
    const walk = (dir: string) => {
      for (const name of readdirSync(dir)) {
        const path = join(dir, name)
        if (statSync(path).isDirectory()) walk(path)
        else if (/\.(tsx?|json)$/.test(name) && !name.endsWith('.test.ts') && name !== 'database.types.ts') {
          if (/\bCerco\b|Método Comitê/.test(readFileSync(path, 'utf8'))) offenders.push(path)
        }
      }
    }
    roots.forEach(walk)
    expect(offenders).toEqual([])
  })
})
