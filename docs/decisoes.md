# Registro de decisões de implementação

Decisões tomadas durante a construção para ambiguidades **sem impacto de dados ou segurança** (as com impacto são perguntadas ao Diego). Formato: `DEC-NNN` · marco · decisão · motivo. Em caso de conflito, o PRD prevalece — e um desvio do PRD é registrado aqui.

| ID | Marco | Decisão | Motivo |
|---|---|---|---|
| DEC-001 | M0 | "M*n*" do PRD tem dois significados: módulos (§7, M1–M14) e marcos (§17, M0–M6). No repo, "marco" = §17 e "módulo" = §7. | Evitar confusão (ex.: Fila do dia é módulo M8, construída no marco M3). |
| DEC-002 | M0 | Módulo de score fica em `lib/domain/scoring.ts` (PRD §9.1 cita `lib/scoring.ts`). | Kickoff manda todas as regras puras em `lib/domain/`. Desvio só de caminho. |
| DEC-003 | M0 | Gerenciador de pacotes: pnpm; Node 22. | Disponível no ambiente; rápido e com lockfile determinístico. |
| DEC-004 | M0 | i18n com helper `t()` próprio e tipado sobre `messages/pt-BR.json` (sem `next-intl`). Placeholders `{app}`/`{method}` resolvidos automaticamente. | Só pt-BR na V1; evita roteamento por locale. Troca futura para next-intl é mecânica. |
| DEC-005 | M0 | Migrações do M0 criam só as tabelas de plataforma/tenancy (`clients`, `workspaces`, `profiles`, `workspace_members`, `platform_settings`, `audit_logs`), as extensões e as funções de RLS. As demais tabelas da §8 entram no marco em que são usadas. | Migrações por assunto, sem tabela morta; RLS testada junto com o uso. |
| DEC-006 | M0 | O seed demo do M0 cria só o cliente "Demo", o workspace "Demo — Produtora B2B" e usuários fictícios (`*@demo.example`). Cada marco estende o seed com os dados que passam a existir (oferta, programa, 30 contas, 80 contatos, tarefas, sinais, upload de ads). | As tabelas ainda não existem no M0. |
| DEC-007 | M0 | Último workspace usado guardado em cookie (`last_ws`), com fallback para o primeiro workspace do usuário. | Mais simples; não precisa de coluna nova. |
| DEC-008 | M0 | Convite: ADM chama `auth.admin.inviteUserByEmail` **e** mostra um botão "copiar link do convite" (via `generateLink`). | O SMTP padrão do Supabase hospedado é limitado; o link copiável garante o convite mesmo sem e-mail configurado. |
| DEC-009 | M0 | Primeiro acesso do convidado cai em "Definir senha"; depois pode entrar por senha ou magic link. | RF-1.1 pede os dois métodos. |
| DEC-010 | M0 | Auditoria em duas camadas: triggers genéricos nas tabelas do ADM (capturam `auth.uid()` e o diff) + `audit()` explícito no servidor para ações sem mudança de dado (convite enviado, entrar no workspace como ADM, reenviar convite). IP preenchido só nas entradas da camada de aplicação. | "Toda ação do ADM gera audit_logs" mesmo se alguém alterar dado fora das actions. |
| DEC-011 | M0 | Sentry e PostHog viram no-op quando as chaves não estão no env. | Dev local e preview funcionam sem as contas configuradas. |
| DEC-012 | M0 | Itens da navegação do workspace de marcos futuros aparecem com estado vazio explicando o que virá ("disponível em breve"), sem funcionalidade. | Mostra a metodologia desde o M0 sem implementar fora de ordem. |
