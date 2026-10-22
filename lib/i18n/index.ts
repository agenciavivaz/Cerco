import messages from '@/messages/pt-BR.json'
import { brand } from '@/lib/config/brand'

type Messages = typeof messages

// "a.b.c" para cada folha string do JSON.
type Leaves<T, P extends string = ''> = {
  [K in keyof T & string]: T[K] extends string ? `${P}${K}` : Leaves<T[K], `${P}${K}.`>
}[keyof T & string]

export type MessageKey = Leaves<Messages>

function lookup(key: string): string | undefined {
  let node: unknown = messages
  for (const part of key.split('.')) {
    if (node && typeof node === 'object' && part in node) node = (node as Record<string, unknown>)[part]
    else return undefined
  }
  return typeof node === 'string' ? node : undefined
}

export function interpolate(template: string, vars: Record<string, string | number> = {}): string {
  const all: Record<string, string | number> = { app: brand.appName, method: brand.methodName, ...vars }
  return template.replace(/\{(\w+)\}/g, (match, name: string) => (name in all ? String(all[name]) : match))
}

/** Texto de interface. `{app}` e `{method}` são preenchidos com os nomes do env. */
export function t(key: MessageKey, vars?: Record<string, string | number>): string {
  const template = lookup(key)
  return template === undefined ? key : interpolate(template, vars)
}

/** Para chaves montadas dinamicamente (ex.: enums). Cai para a própria chave se não existir. */
export function tDynamic(key: string, vars?: Record<string, string | number>): string {
  const template = lookup(key)
  return template === undefined ? key : interpolate(template, vars)
}
