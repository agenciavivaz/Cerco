// Nome do produto e da metodologia: SEMPRE via env (PRD: "Regra de nomes").
// Fallbacks neutros para não vazar nenhum nome provisório no código.

export const brand = {
  appName: process.env.NEXT_PUBLIC_APP_NAME?.trim() || 'App',
  methodName: process.env.NEXT_PUBLIC_METHOD_NAME?.trim() || 'Método',
} as const

/** Identificador derivado do nome do app (ex.: header de webhook, parâmetro de rastreamento). */
export function brandSlug(appName: string = brand.appName): string {
  return (
    appName
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '')
      .slice(0, 24) || 'app'
  )
}
