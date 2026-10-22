export const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/

/** "Sétima — Máquinas" → "setima-maquinas" */
export function slugify(input: string, maxLength = 60): string {
  return input
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, maxLength)
    .replace(/-+$/g, '')
}

export function isValidSlug(slug: string): boolean {
  return slug.length >= 2 && slug.length <= 60 && SLUG_PATTERN.test(slug)
}
