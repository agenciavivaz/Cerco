import type { MemberRole } from '@/lib/auth'

export const WORKSPACE_SECTIONS = [
  'inicio',
  'fila',
  'programas',
  'contas',
  'contatos',
  'ads',
  'importacoes',
  'configuracoes',
] as const
export type WorkspaceSection = (typeof WORKSPACE_SECTIONS)[number]

/** Seções visíveis por papel (PRD §4.2 e §6.1). ADM sem papel (role null) vê tudo. */
export function sectionsFor(role: MemberRole | null): WorkspaceSection[] {
  switch (role) {
    case 'viewer':
      return ['inicio', 'programas', 'contas', 'contatos']
    case 'bdr':
      return ['fila', 'inicio', 'programas', 'contas', 'contatos', 'importacoes']
    default:
      return [...WORKSPACE_SECTIONS]
  }
}

/** Rota inicial: BDR cai na Fila do dia; os demais no Início (PRD §6.1). */
export function homeSection(role: MemberRole | null): WorkspaceSection {
  return role === 'bdr' ? 'fila' : 'inicio'
}
