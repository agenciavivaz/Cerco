import { z } from 'zod'
import { t } from '@/lib/i18n'

// Mensagens padrão do Zod em pt-BR; campo vazio vira "Campo obrigatório".
// Importe `z` daqui em todos os schemas para garantir a configuração (cliente e servidor).
z.config({
  ...z.locales.ptBR(),
  customError: (issue) => {
    if (issue.input === '' || issue.input === undefined) return t('common.requiredField')
    if (issue.code === 'too_small' && issue.origin === 'string' && issue.minimum === 1) return t('common.requiredField')
    return undefined
  },
})

export { z }
