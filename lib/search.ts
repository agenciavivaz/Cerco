/** Termo seguro para `.or('col.ilike.%x%')` do PostgREST (remove separadores e curingas). */
export function ilikeTerm(q: string | undefined): string | null {
  const term = (q ?? '').replace(/[,()%*\\"']/g, ' ').trim().slice(0, 100)
  return term ? `%${term}%` : null
}
