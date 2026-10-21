# CLAUDE.md

Guia de trabalho para o Claude Code neste repositório. **Fonte da verdade do produto: `docs/PRD-cerco-v1.md`.** Contexto de negócio: `docs/planejamento-plataforma-abm.md` (se conflitar, o PRD vence). Decisões de implementação tomadas durante a construção: `docs/decisoes.md`.

---

## 1. Produto em uma página

SaaS de **ABM com IA para vendas complexas B2B no Brasil**. Nome do produto e da metodologia são **provisórios** ("Cerco" e "Método Comitê") e vêm sempre de variáveis de ambiente.

- **Tenancy:** cliente → workspaces → membros (`manager`, `bdr`, `viewer`) + `platform_admin` (Vivaz) com acesso a tudo via `/admin`.
- **Pensar:** ofertas + base de conhecimento → **programa** (oferta × segmento) criado por um **assistente de 7 passos com IA** (fit, tiers, comitê, plays, lead magnets, cadências/audiências).
- **Executar:** contas e contatos, comitê (papéis × cargos), cobertura/penetração, dossiê por IA, cadências que geram **tarefas** (a plataforma **não envia nada**), **Fila do dia do BDR** (tela mais importante).
- **Medir:** sinais (tarefas, rastreamento web, uploads de relatórios de ads, webhooks, Apollo, caçador de sinais por IA), **score explicável** (Fit 0–40 + Engajamento 0–40 + Timing 0–20), estágios automáticos, frequência de ads, audiências exportadas em CSV, painel, brief semanal e copiloto.
- **Integrar:** API REST v1 com chave por workspace, webhooks de saída (HMAC) e de entrada; CRMs (Odoo, Pipedrive, HubSpot) **só via Make**.
- Toda saída de IA é **rascunho** até o usuário aceitar. Nunca inventar pessoas, e-mails, números ou fatos sem fonte.

### Nomenclatura de "M" (atenção)
O PRD usa "M" para duas coisas diferentes:
- **Módulos funcionais** (seção 7): M1 Auth … M8 Fila do dia … M14 Oportunidades.
- **Marcos de construção** (seção 17): **M0 → M6**. É a ordem de trabalho.

Neste repo, "marco M*n*" = seção 17; "módulo M*n*" = seção 7.

| Marco | Conteúdo | Pronto quando |
|---|---|---|
| M0 Fundação | repo, Next, Supabase, auth por convite, tenancy, RLS base, layout, seletor de workspace, ADM (clientes, workspaces, usuários, auditoria), env de nomes, Sentry, PostHog, seed | Diego cria cliente "Sétima" com workspaces Sétima e Brandspot, convida um BDR e o BDR só vê o workspace dele |
| M1 Estratégia | ofertas, base de conhecimento, `offer_builder`, assistente de 7 passos, `ai_runs`/`ai_suggestions` | Cenário 18.1 |
| M2 Contas & comitê | import genérico, contas, fit em lote, tiers, contatos, Apollo, `contact_role`, matriz, página da conta, dossiê | 100 contas pontuadas, tiers, comitê de 10 T1 |
| M3 Execução | cadências, inscrição, gerador em dias úteis, regras automáticas, Fila do dia, atividades, personalização, oportunidades | Cenário 18.2 |
| M4 Sinais & score | catálogo, rastreamento web, links, conversões, score/estágios/cobertura/penetração, alertas, caçador, vagas Apollo | Cenário 18.3 exato |
| M5 Ads | uploads (amostras reais em `/samples/ads/`), correspondência/aliases, idempotência/reverter, frequência, audiências e exports | Cenário 18.4 |
| M6 Inteligência & integrações | painéis, brief, copiloto, API v1 + OpenAPI, webhooks, guias Make, ADM-4/5/7/8 | Cenário 18.5 |

**Um marco por vez.** Ao fim de cada um: migrações aplicadas, testes passando, commits, preview Vercel, e entregar (1) o que foi feito, (2) como testar manualmente, (3) desvios do PRD, (4) o que fica para o próximo. Depois **parar e esperar o ok**.

Se ao chegar no M5 a pasta `/samples/ads/` estiver vazia: **parar e pedir os arquivos.**

---

## 2. Stack

- **Next.js** (App Router, Server Components, Server Actions, Route Handlers) + **TypeScript estrito**
- **Tailwind** + **shadcn/ui** + `next-themes` (claro/escuro) · **TanStack Table** · **React Hook Form + Zod**
- **Supabase:** Postgres com RLS em **todas** as tabelas, Auth (só convite), Storage, Vault; extensões `pg_cron`, `pg_trgm`, `pgmq`. Projeto hospedado: `Cerco` (ref `nvxkhictstezzakhnyec`).
- **Vercel** (deploy + Cron) · **Resend** (e-mail transacional) · **PostHog** (analytics) · **Sentry** (erros)
- **IA:** `@anthropic-ai/sdk`. Modelos via `AI_MODEL_SMART` / `AI_MODEL_FAST` (e `platform_settings`). **Nunca fixar nome de modelo no código.** Consultar a doc atual da Anthropic para IDs e para a ferramenta de busca na web do lado do servidor.
- **Testes:** Vitest (regras puras + RLS), Playwright (cenário do marco).
- Gerenciador de pacotes: **pnpm**. Node 22.

## 3. Comandos

> Criados no M0. Atualize esta lista sempre que adicionar um script.

| Comando | O que faz |
|---|---|
| `pnpm dev` | Next em modo dev (http://localhost:3000) |
| `pnpm build` / `pnpm start` | build e servidor de produção |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm format` | Prettier |
| `pnpm test` | Vitest (unit: `lib/**`) |
| `pnpm test:rls` | Vitest contra o Supabase local (isolamento entre workspaces) |
| `pnpm e2e` | Playwright (requer `pnpm db:start` + `pnpm dev`) |
| `pnpm db:start` / `pnpm db:stop` | Supabase local (Docker) |
| `pnpm db:reset` | recria o banco local: migrações + `supabase/seed.sql` |
| `pnpm db:new <nome>` | nova migração em `supabase/migrations` |
| `pnpm db:push` | aplica migrações no projeto hospedado (linkado) |
| `pnpm db:types` | gera `lib/supabase/database.types.ts` a partir do banco local |
| `pnpm seed:demo` | seed de demonstração via script TS (dados fictícios `.example`) |
| `pnpm admin:bootstrap <email>` | cria/promove o primeiro `platform_admin` |

Antes de cada commit: `pnpm lint && pnpm typecheck && pnpm test`. Depois de mudar migração: `pnpm db:reset && pnpm db:types`.

## 4. Estrutura de pastas

```
app/
  (auth)/            login, callback, definir-senha, convite
  w/[workspaceSlug]/ app do workspace (layout com nav lateral + copiloto)
  admin/             Área ADM (só platform_admin, layout próprio "modo ADM")
  api/               route handlers (v1, hooks, t, cron)
components/
  ui/                shadcn (gerado; não editar à mão sem motivo)
  <dominio>/         componentes por domínio (admin, workspace, queue…)
lib/
  domain/            REGRAS PURAS (sem Next/Supabase/IO) + *.test.ts
  schemas/           Zod compartilhado entre form e action
  actions/           Server Actions por domínio
  supabase/          server.ts, browser.ts, admin.ts (service role), middleware.ts, database.types.ts
  ai/                cliente Anthropic, runAgent(), custo, contexto
  config/            brand.ts (nomes via env), env.ts (validação Zod do env)
  i18n/              t() tipado sobre messages/pt-BR.json
  format.ts          datas dd/mm/aaaa, BRL, fuso
  analytics/         PostHog (server e client)
messages/pt-BR.json  TODOS os textos de interface
prompts/<agente>.md  prompts versionados (front-matter com version)
supabase/
  migrations/        YYYYMMDDHHMMSS_<descricao>.sql
  seed.sql           seed mínimo local
scripts/             seed-demo.ts, admin-bootstrap.ts
tests/
  rls/               testes de isolamento contra Supabase local
  e2e/               Playwright, um arquivo por cenário/marco
docs/                PRD, planejamento, decisoes.md, integracoes/make/
samples/ads/         exports reais de ads (fornecidos pelo Diego)
```

## 5. Convenções

### Nomes do produto (regra dura)
- **Nunca** escrever "Cerco" ou "Método Comitê" em código, UI, e-mail ou prompt. Usar `brand.appName` / `brand.methodName` de `lib/config/brand.ts` (lê `NEXT_PUBLIC_APP_NAME` e `NEXT_PUBLIC_METHOD_NAME`).
- Nos textos de `messages/pt-BR.json`, usar os placeholders `{app}` e `{method}`.
- Derivados também vêm daí: header de webhook (`X-<App>-Signature`), parâmetro de rastreamento (padrão de `settings.tracking_param`).
- Nomes de tabelas, colunas e identificadores internos não levam o nome do produto.

### Idioma e formatação
- UI 100% pt-BR; textos em `messages/pt-BR.json` acessados por `t('chave.aninhada', vars)`. Nada de string literal de interface em componente.
- Datas `dd/mm/aaaa`, moeda BRL, fuso `America/Sao_Paulo` (ou o do workspace) — sempre via `lib/format.ts`.
- Código, nomes de variáveis e commits podem ser em inglês; enums de domínio seguem os valores do PRD (ex.: `alvo`, `reuniao_agendada`).

### Banco e RLS
- Toda tabela de workspace: `id uuid default gen_random_uuid()`, `workspace_id uuid not null`, `created_at`, `updated_at` (trigger `set_updated_at`), índice começando por `workspace_id`.
- `alter table … enable row level security` em **toda** tabela, sem exceção. Sem RLS = PR rejeitado.
- Funções helper (`security definer`, `stable`, `set search_path = ''`): `is_platform_admin()`, `is_member(ws)`, `member_role(ws)`, `has_role(ws, roles text[])`.
- Padrão de policies: select = `is_platform_admin() or is_member(workspace_id)`; insert/update/delete conforme a matriz da seção 4.2 do PRD. Nome: `<tabela>_<operacao>_<quem>`.
- Tabelas de plataforma (`clients`, `platform_settings`, flag `profiles.is_platform_admin`): só `platform_admin`.
- Enums Postgres para os valores fechados do PRD. Nomes de tabelas/colunas exatamente como no PRD seção 8.
- Uma migração por assunto; nunca editar migração já aplicada no hospedado — criar outra.
- Depois de mudar o schema: regenerar tipos e commitar `database.types.ts`.

### Supabase no código
- `lib/supabase/server.ts`: cliente com o token do usuário (cookies) — padrão para tudo; a RLS é a guarda real.
- `lib/supabase/admin.ts`: service role, com `import 'server-only'`. Uso restrito a: endpoints públicos (`/t.js`, `/api/t/collect`, `/r/[token]`, `/api/hooks/[token]`, `/api/v1/*`), jobs, convites do Auth e auditoria. **Nunca** importar em componente client.
- Segredos de terceiros (Apollo etc.) no **Supabase Vault**; chaves de API guardadas só como hash (prefixo visível).

### Server Actions
```ts
'use server'
export async function createClientAction(input: unknown): Promise<ActionResult<{ id: string }>> {
  const parsed = clientSchema.safeParse(input)          // 1. Zod sempre
  if (!parsed.success) return fail('validation', parsed.error)
  const { supabase, user } = await requireUser()        // 2. sessão
  await requirePlatformAdmin()                          // 3. checagem de papel (UX; RLS repete)
  const { data, error } = await supabase.from('clients').insert(parsed.data).select('id').single()
  if (error) return fail('db', error)
  await audit({ action: 'client.create', entity_type: 'client', entity_id: data.id, diff: parsed.data })
  revalidatePath('/admin/clientes')                     // 4. revalidar
  return ok({ id: data.id })
}
```
- Retorno sempre `ActionResult<T> = { ok: true; data: T } | { ok: false; error: { code; message; fieldErrors? } }`. Não lançar exceção para erro esperado.
- Schemas Zod em `lib/schemas/`, reaproveitados pelo `zodResolver` do formulário.
- Arquivo por domínio em `lib/actions/<dominio>.ts`.

### Regras de domínio
- Score, estágios, gerador de tarefas em dias úteis, normalização/correspondência de empresas, parsers de relatório de ads, formatadores de export: **módulos TypeScript puros em `lib/domain/`**, com teste unitário ao lado (`*.test.ts`). Sem IO; recebem dados, devolvem dados.
- O cenário 18.3 do PRD (total = 67,3) é teste obrigatório e precisa bater exatamente.

### IA
- Todo agente: prompt em `prompts/<agente>.md` (front-matter `version`), schema Zod da saída, chamada via `runAgent()` que registra `ai_runs` (tokens, buscas, custo, duração, status) e respeita orçamento.
- Saída inválida → 1 nova tentativa com o erro → falha registrada.
- Todo prompt recebe nome do produto/metodologia (env), pt-BR, data atual, contexto do workspace e a regra de não inventar.
- Saída vira `ai_suggestions` (ou registro `draft`/`suggested`) até ação do usuário; registrar a decisão (evento `ai_suggestion_decided`).
- Brief e copiloto nunca calculam números: recebem agregados do servidor.

### Segurança e LGPD
- Validação Zod em toda entrada; rate limit nos endpoints públicos; HMAC nos webhooks; CORS restrito em `/api/t/collect`.
- `do_not_contact` respeitado em tarefas e exports; origem do dado (`data_source`) obrigatória em imports.
- Toda ação do ADM gera `audit_logs`.

### Seed
- Só dados fictícios, domínios `.example`. **Nunca** empresas ou pessoas reais.

### Ambiguidades
- Sem impacto de dados/segurança → escolher o mais simples, registrar em `docs/decisoes.md` e seguir.
- Com impacto de dados/segurança → perguntar ao Diego.

### Git
- Branch de trabalho definida na sessão. Commits pequenos e descritivos (em português ou inglês, consistente dentro do marco).

---

## 6. Variáveis de ambiente

Validadas em `lib/config/env.ts` (Zod). Exemplo completo em `.env.example`.

| Variável | Onde | Uso |
|---|---|---|
| `NEXT_PUBLIC_APP_NAME` | público | nome do produto (ex.: `Cerco`) |
| `NEXT_PUBLIC_METHOD_NAME` | público | nome da metodologia (ex.: `Método Comitê`) |
| `NEXT_PUBLIC_APP_URL` | público | URL base (links de convite, rastreamento) |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | público | cliente Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | **só servidor** | service role |
| `ANTHROPIC_API_KEY`, `AI_MODEL_SMART`, `AI_MODEL_FAST` | servidor | IA (a partir do M1) |
| `RESEND_API_KEY`, `EMAIL_FROM` | servidor | e-mails transacionais |
| `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST` | público | analytics (no-op se ausente) |
| `SENTRY_DSN`, `NEXT_PUBLIC_SENTRY_DSN` | ambos | erros (no-op se ausente) |
| `CRON_SECRET` | servidor | autenticação dos Vercel Cron |

---

## 7. Decisões já tomadas (PRD §2) — não rediscutir

| # | Decisão |
|---|---|
| D1 | **Cadência = só tarefas.** A plataforma não envia e-mail nem mensagens; gera tarefa com texto pronto e atalhos (copiar, `mailto:`, `wa.me`, LinkedIn, `tel:`); o BDR executa e registra. |
| D2 | **CRMs da V1: Odoo, Pipedrive e HubSpot, via Make**, usando API e webhooks da plataforma. Sem conector nativo. |
| D3 | **Segmentos não são pré-definidos.** Usuário + IA criam a estrutura; produto genérico e guiado. |
| D4 | **Usuário principal do piloto: BDR.** Tela mais importante: **Fila do dia**. |
| D5 | **Metodologia tem nome próprio, separado do produto.** Ambos provisórios, vindos de configuração. |
| D6 | **Sem integração direta com Meta e LinkedIn.** Ads entram por **upload de CSV/XLSX** (precisa funcionar muito bem); audiências saem por **export CSV**. |
| D7 | **Setup não é self-service.** A Vivaz faz o setup pela Área ADM. |
| D8 | **Sem cobrança na V1.** ADM guarda dados de cliente/plano para o futuro, mas não cobra. |
| D9 | **Área ADM na V1:** clientes, workspaces, usuários, acessos, uso de IA, auditoria, configurações globais. |
| D10 | **Apollo é integração nativa opcional** por workspace (enriquecimento, pessoas, vagas). Sempre existe alternativa por CSV. |

## 8. Fora do escopo da V1 (PRD §3.2) — não implementar, mesmo que pareça fácil

- Envio de e-mail, LinkedIn ou WhatsApp pela plataforma; infraestrutura de domínios ou caixas. (E-mail **transacional** do próprio produto — convite, brief, alertas — via Resend é permitido.)
- Integração por API com Meta Ads, LinkedIn Ads ou Google Ads.
- Conectores nativos de CRM (só via Make).
- Desanonimização de visitante por IP.
- Discador ou gravação de chamadas.
- Cobrança, nota fiscal e gateway de pagamento.
- Onboarding self-service e cadastro público.
- Embeddings / pgvector (V1.5; na V1 o texto dos docs vai no contexto dentro de um orçamento de tokens).
- App mobile nativo (web responsiva; Fila do dia ótima no celular).

## 9. Prioridades de UX

1. **Fila do dia do BDR** (módulo M8, marco M3) — excelente, inclusive no celular.
2. **Assistente de criação de programa** (módulo M3, marco M1).
3. **Upload de relatórios de ads** (§11.2, marco M5) — robusto com arquivos reais.
