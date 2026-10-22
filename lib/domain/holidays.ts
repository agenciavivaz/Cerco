// Feriados nacionais do Brasil (padrão de novos workspaces; o workspace edita e inclui os locais).
// Lei 662/1949, Lei 6.802/1980 (12/10), Lei 14.759/2023 (20/11) e Sexta-feira Santa (móvel).
// Carnaval e Corpus Christi são pontos facultativos: ficam fora do padrão.

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

function iso(year: number, month: number, day: number): string {
  return `${year}-${pad(month)}-${pad(day)}`
}

/** Domingo de Páscoa (algoritmo de Meeus/Jones/Butcher). */
export function easterSunday(year: number): { month: number; day: number } {
  const a = year % 19
  const b = Math.floor(year / 100)
  const c = year % 100
  const d = Math.floor(b / 4)
  const e = b % 4
  const f = Math.floor((b + 8) / 25)
  const g = Math.floor((b - f + 1) / 3)
  const h = (19 * a + b - d - g + 15) % 30
  const i = Math.floor(c / 4)
  const k = c % 4
  const l = (32 + 2 * e + 2 * i - h - k) % 7
  const m = Math.floor((a + 11 * h + 22 * l) / 451)
  const month = Math.floor((h + l - 7 * m + 114) / 31)
  const day = ((h + l - 7 * m + 114) % 31) + 1
  return { month, day }
}

/** Datas ISO (aaaa-mm-dd) dos feriados nacionais do ano, em ordem. */
export function brazilianNationalHolidays(year: number): string[] {
  const easter = easterSunday(year)
  const goodFriday = new Date(Date.UTC(year, easter.month - 1, easter.day - 2))
  const fixed: Array<[number, number]> = [
    [1, 1],
    [4, 21],
    [5, 1],
    [9, 7],
    [10, 12],
    [11, 2],
    [11, 15],
    [11, 20],
    [12, 25],
  ]
  return [
    ...fixed.map(([m, d]) => iso(year, m, d)),
    iso(year, goodFriday.getUTCMonth() + 1, goodFriday.getUTCDate()),
  ].sort()
}

/** Feriados nacionais do ano atual e do seguinte. */
export function defaultHolidays(today: Date = new Date()): string[] {
  const year = today.getUTCFullYear()
  return [...brazilianNationalHolidays(year), ...brazilianNationalHolidays(year + 1)]
}
