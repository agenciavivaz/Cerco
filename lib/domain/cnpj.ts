// Validação e formatação de CNPJ (numérico, 14 dígitos).

export function cnpjDigits(input: string): string {
  return input.replace(/\D/g, '')
}

function checkDigit(base: string, weights: number[]): number {
  const sum = base.split('').reduce((acc, digit, i) => acc + Number(digit) * weights[i], 0)
  const rest = sum % 11
  return rest < 2 ? 0 : 11 - rest
}

export function isValidCnpj(input: string): boolean {
  const digits = cnpjDigits(input)
  if (digits.length !== 14 || /^(\d)\1{13}$/.test(digits)) return false
  const d1 = checkDigit(digits.slice(0, 12), [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2])
  const d2 = checkDigit(digits.slice(0, 12) + d1, [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2])
  return digits.endsWith(`${d1}${d2}`)
}

/** 00.000.000/0000-00 */
export function formatCnpj(input: string | null | undefined): string {
  if (!input) return ''
  const d = cnpjDigits(input)
  if (d.length !== 14) return input
  return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`
}
