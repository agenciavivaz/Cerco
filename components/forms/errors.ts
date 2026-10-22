import type { FieldValues, Path, UseFormReturn } from 'react-hook-form'
import type { ActionError } from '@/lib/actions/result'

/** Aplica no formulário os erros por campo devolvidos pela Server Action. */
export function applyServerErrors<T extends FieldValues>(form: UseFormReturn<T>, error: ActionError) {
  for (const [field, message] of Object.entries(error.fieldErrors ?? {})) {
    form.setError(field as Path<T>, { type: 'server', message })
  }
}
