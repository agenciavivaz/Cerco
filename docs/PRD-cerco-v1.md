# PRD — Cerco v1 (nome provisório)

> **Produto:** Cerco *(provisório)* — plataforma de ABM com IA para vendas complexas B2B
> **Metodologia:** Método Comitê *(provisório)*
> **Versão do documento:** 1.0 · 21/out/2026 · Dono: Diego Rodrigues (Vivaz)
> **Público deste documento:** Claude Code (implementação) e Diego (produto)
> **Documento de contexto:** `planejamento-plataforma-abm.md` (tese, mercado, posicionamento). Em caso de conflito, **este PRD prevalece**.

**Regra de nomes:** "Cerco" e "Método Comitê" são provisórios. Nada pode estar fixo no código. Use `NEXT_PUBLIC_APP_NAME` e `NEXT_PUBLIC_METHOD_NAME` (variáveis de ambiente) em toda a interface, nos e-mails e nos prompts de IA.

---

## Sumário
1. Contexto e objetivo da V1
2. Decisões já tomadas
3. Escopo: dentro e fora
4. Usuários, papéis e permissões
5. Glossário e conceitos do domínio
6. Arquitetura de informação (telas e navegação)
7. Requisitos funcionais por módulo
8. Modelo de dados
9. Score, estágios e sinais
10. Agentes de IA
11. Importações, uploads de relatórios de ads e exportação de audiências
12. Integrações: API, webhooks e setup via Make
13. Área ADM (plataforma)
14. Requisitos não funcionais
15. Analytics de produto (validação de usabilidade)
16. Dados de exemplo e templates padrão
17. Plano de construção (marcos)
18. Cenários de aceite ponta a ponta
19. Itens em aberto

---

## 1. Contexto e objetivo da V1

A Vivaz roda ABM na Sétima e na Brandspot (duas soluções da mesma empresa) com uma metodologia própria:
1. contas-alvo divididas em 3 tiers;
2. comitê de compra definido por cargos;
3. oferta, dor e decisor claros por papel;
4. cadência multicanal executada por BDR;
5. ads imprimindo com frequência sobre o comitê como topo de funil;
6. sinais e score para decidir quando atacar.

Hoje isso vive em documentos, planilhas, CRM e na cabeça de quem montou.

**Objetivo da V1:** um produto web onde um usuário, com ajuda da IA, consegue:
- **criar a estrutura de ABM** de um segmento novo do zero (oferta → ICP → contas → tiers → comitê → plays → lead magnets → cadência → audiências);
- e o **BDR executa** a cadência, registra resultados e enxerga sinais e prioridades, tudo dentro da plataforma.

**Validação 01 = usabilidade.** Os primeiros usuários são a Sétima e a Brandspot, que expandem para segmentos novos dentro da ferramenta. Depois vêm de 3 a 5 design partners externos. Não há cobrança na V1.

**Critérios de sucesso da V1:**
- Um segmento novo sai do zero para "pronto para executar" em **≤ 1 dia de trabalho**.
- O BDR conclui **≥ 70% das tarefas da cadência dentro da plataforma**.
- **≥ 50% das sugestões da IA** são aceitas, com ou sem edição.
- **≥ 3 usuários ativos por semana** em cada workspace do piloto.

---

## 2. Decisões já tomadas

| # | Decisão |
|---|---|
| D1 | **Cadência = só tarefas.** A plataforma não envia e-mail nem mensagens. Ela gera a tarefa com o texto pronto e atalhos (copiar, `mailto:`, `wa.me`, abrir LinkedIn, `tel:`); o BDR executa e registra o resultado. |
| D2 | **CRMs da V1: Odoo, Pipedrive e HubSpot**, integrados **via Make** usando a API e os webhooks da plataforma. Não há conector nativo na V1. |
| D3 | **Segmentos não são pré-definidos.** O usuário com a IA cria toda a estrutura. O produto precisa ser genérico e guiado. |
| D4 | **Usuário principal do piloto: BDR.** A tela mais importante do produto é a **Fila do dia**. |
| D5 | **Metodologia tem nome próprio, separado do produto.** Ambos são provisórios e vêm de configuração. |
| D6 | **Sem integração direta com Meta e LinkedIn.** Ads entram por **upload de relatórios (CSV/XLSX)**, e isso precisa funcionar muito bem. Audiências saem por **export de CSV** nos formatos de cada plataforma. |
| D7 | **Setup não é self-service.** A Vivaz faz o setup de cada cliente (integrações, Make, importações iniciais) pela Área ADM. O onboarding solo fica para versões futuras. |
| D8 | **Cobrança só com design partners e fora da V1.** A Área ADM guarda dados de cliente e plano para a cobrança futura, mas não cobra. |
| D9 | **Área ADM na V1:** cadastro de clientes, workspaces, usuários, acessos, uso de IA, auditoria e configurações globais. |
| D10 | **Apollo é integração nativa opcional** por workspace: enriquecimento de empresa, busca de pessoas e vagas. Sempre existe a alternativa de importar CSV. |

---

## 3. Escopo

### 3.1 Dentro da V1
- Multi-tenant: cliente → workspaces → membros.
- Área ADM da plataforma.
- Oferta(s) e base de conhecimento (textos e documentos) por workspace.
- **Programas de ABM** (oferta × segmento) criados por um **assistente guiado por IA**.
- Contas, contatos, tiers, comitê (papéis × cargos), matriz de cobertura.
- Plays por tier × papel, lead magnets (ideias e status).
- Dossiê de conta por IA.
- Cadências multicanal → tarefas → **Fila do dia do BDR**.
- Registro de atividades e resultados.
- Sinais: tarefas, rastreamento web, uploads de ads, webhooks, Apollo, caçador de sinais por IA, registro manual e importação.
- Score explicável, estágios da conta, cobertura e penetração do comitê, alertas.
- Upload de relatórios de ads (LinkedIn e Meta) com correspondência de empresas; métricas de frequência.
- Construtor de audiências e export CSV (LinkedIn empresas, LinkedIn contatos, Meta lista de clientes, genérico).
- Painel e brief semanal por IA; copiloto em chat.
- API REST com chave por workspace, webhooks de saída, webhooks de entrada; receitas documentadas para o Make (Odoo, Pipedrive, HubSpot).
- Analytics de produto (PostHog) e registro de custo de IA.

### 3.2 Fora da V1 (não implementar)
- Envio de e-mail, LinkedIn ou WhatsApp pela plataforma, e infraestrutura de domínios ou caixas.
- Integração por API com Meta Ads, LinkedIn Ads ou Google Ads.
- Conectores nativos de CRM (só via Make).
- Desanonimização de visitante por IP.
- Discador ou gravação de chamadas.
- Cobrança, nota fiscal e gateway de pagamento.
- Onboarding self-service e cadastro público.
- Embeddings / pgvector (fica para V1.5; na V1 a IA recebe o texto dos documentos dentro de um orçamento de tokens).
- App mobile nativo (a web precisa ser responsiva; a Fila do dia tem que funcionar bem no celular).

---

## 4. Usuários, papéis e permissões

### 4.1 Papéis
| Papel | Escopo | Quem é |
|---|---|---|
| `platform_admin` | Toda a plataforma | Vivaz (Diego). Acessa `/admin` e qualquer workspace. |
| `manager` | Workspace | Head de marketing, comercial ou growth do cliente. Cria e edita programas, estrutura e configurações. |
| `bdr` | Workspace | Executa tarefas, registra atividades, cria e edita contatos, vê contas e sinais, usa o copiloto. |
| `viewer` | Workspace | Leitura (board e diretoria). |

Um usuário pode estar em vários workspaces com papéis diferentes. Há um seletor de workspace no topo.

### 4.2 Matriz de permissões (resumo)
| Ação | platform_admin | manager | bdr | viewer |
|---|---|---|---|---|
| Área ADM (clientes, usuários, acessos, uso) | ✅ | ❌ | ❌ | ❌ |
| Convidar e remover usuários | ✅ (só no ADM na V1) | ❌ | ❌ | ❌ |
| Criar e editar oferta, programa, comitê, plays, cadências | ✅ | ✅ | ❌ (sugere via comentário) | ❌ |
| Importar contas e contatos | ✅ | ✅ | ✅ contatos | ❌ |
| Mudar tier ou estágio manualmente | ✅ | ✅ | ✅ estágio | ❌ |
| Executar tarefas e registrar atividades | ✅ | ✅ | ✅ | ❌ |
| Gerar dossiê e personalizar mensagem com IA | ✅ | ✅ | ✅ | ❌ |
| Upload de relatórios de ads e export de audiências | ✅ | ✅ | ❌ | ❌ |
| Integrações (chaves de API, webhooks, Apollo) | ✅ | 👁 leitura | ❌ | ❌ |
| Pesos de sinais e limiares de score | ✅ | ✅ | ❌ | ❌ |
| Ver painéis e brief | ✅ | ✅ | ✅ | ✅ |

Tudo isso é aplicado **no banco via RLS** e repetido na interface.

---

## 5. Glossário e conceitos

- **Cliente:** empresa contratante (entidade de cobrança futura). Ex.: "Sétima" (com as soluções Sétima e Brandspot).
- **Workspace:** ambiente isolado de operação. Um cliente pode ter vários (ex.: workspace "Sétima" e workspace "Brandspot").
- **Oferta:** o que se vende: tese, dor, proposta de valor, provas/cases, diferenciais, objeções. Um workspace tem 1..n ofertas.
- **Programa:** unidade de ABM = **oferta × segmento** (ex.: "Configurador 3D × Máquinas agrícolas"). Tem critérios de fit, regras de tier, comitê, plays, lead magnets, cadências e audiências.
- **Conta:** empresa-alvo (pertence ao workspace). Entra em um ou mais programas via **conta no programa** (`program_account`), com tier, estágio e score próprios.
- **Tier:** T1 (1:1, poucas contas e máximo de personalização), T2 (1:poucos, por cluster), T3 (1:muitos, escala).
- **Comitê:** conjunto de **papéis** definidos por programa, cada papel com cargos típicos.
- **Papel do comitê:** tipo (`economic` decisor econômico, `champion` campeão, `technical` avaliador técnico, `user` usuário/beneficiado, `procurement` compras/jurídico, `influencer`, `blocker`), cargos típicos e se é obrigatório.
- **Contato:** pessoa de uma conta; recebe um papel por programa (`contact_role`).
- **Play:** pacote de abordagem para **tier × papel**: dor, mensagem-chave, prova, CTA e lead magnet.
- **Lead magnet:** ativo de valor (calculadora de ROI, diagnóstico, demo espelho, benchmark, conteúdo, evento).
- **Cadência:** sequência de passos (canal, dia útil, papel-alvo, template). Ao inscrever uma conta, gera **tarefas** para os contatos dos papéis correspondentes.
- **Tarefa:** ação para o BDR, com texto pronto, prazo e resultado.
- **Atividade:** registro de algo que aconteceu (toque realizado, resposta, reunião).
- **Sinal:** evento com peso que alimenta o score (engajamento, intenção/timing, negativo).
- **Score:** 0–100 = Fit (0–40) + Engajamento (0–40) + Timing (0–20), explicável.
- **Cobertura do comitê:** % de papéis obrigatórios com pelo menos 1 contato mapeado.
- **Penetração do comitê:** % de papéis obrigatórios com pelo menos 1 sinal de engajamento nos últimos 60 dias.
- **Estágio da conta:** `alvo → aquecendo → engajada → conversa → oportunidade → ganha | perdida | nutrir`.
- **Audiência:** recorte de contas/contatos de um programa (por tier, estágio, papel, score) exportado para plataformas de ads.
- **Frequência:** impressões de ads por conta por semana (vinda dos uploads), comparada a uma meta.

---

## 6. Arquitetura de informação

### 6.1 App do workspace — `/w/[workspaceSlug]/...`
Navegação lateral:
1. **Início** — painel + brief semanal (rota inicial de `manager` e `viewer`)
2. **Fila do dia** — rota inicial do `bdr`
3. **Programas** — lista → detalhe do programa com abas:
   - Visão geral (funil por estágio, tiers, cobertura, score médio, frequência)
   - Estratégia (ICP/fit, comitê, plays, lead magnets)
   - Contas (tabela do programa)
   - Comitê (matriz conta × papel)
   - Cadências
   - Audiências & Ads
   - Sinais
4. **Contas** — tabela global → **página da conta**: cabeçalho (score, tier, estágio, cobertura), score explicado, comitê, linha do tempo (atividades + sinais), dossiê, tarefas, oportunidades, programas
5. **Contatos** — tabela global → drawer do contato
6. **Ads** — uploads de relatórios, revisão de correspondência, histórico
7. **Importações** — histórico e novo import (contas, contatos, sinais)
8. **Configurações** — ofertas, base de conhecimento, catálogo de sinais e pesos, limiares, metas de frequência, dias úteis/feriados, rastreamento web (snippet), integrações (leitura para manager)

**Copiloto:** painel lateral disponível em todas as telas, com contexto da tela atual (programa ou conta abertos).

### 6.2 Área ADM — `/admin/...` (só `platform_admin`)
Clientes · Workspaces · Usuários & acessos · Integrações por workspace · Uso & custos de IA · Auditoria · Templates globais · Configurações da plataforma

### 6.3 Diretrizes de UI
- **pt-BR** em toda a interface; datas `dd/mm/aaaa`; moeda BRL; fuso padrão `America/Sao_Paulo` (configurável por workspace).
- Next.js + Tailwind + shadcn/ui; tema claro/escuro; tabelas com filtros salvos, ordenação, busca e paginação no servidor.
- Toda saída de IA aparece como **rascunho** com ações: *Aceitar*, *Editar*, *Regenerar (com instrução)*, *Descartar*. Registrar aceite ou descarte (seção 15).
- Estados vazios ensinam a metodologia (ex.: "Nenhum papel no comitê ainda — gerar sugestão com IA").
- Desktop-first, mas a **Fila do dia** e a **página da conta** precisam ser ótimas no celular.

---

## 7. Requisitos funcionais por módulo

Formato: **RF-x.y** (requisito) + critérios de aceite (**CA**).

### M1 — Autenticação, tenancy e contexto
- **RF-1.1** Login por e-mail via Supabase Auth: magic link e senha. Sem cadastro público; usuários só entram por convite do ADM.
- **RF-1.2** Seletor de workspace; lembrar o último usado.
- **RF-1.3** Toda consulta é filtrada por `workspace_id` via RLS. `platform_admin` tem acesso a todos os workspaces por uma função `is_platform_admin()`.
- **CA:** um usuário `bdr` do workspace A não consegue ler nenhuma linha do workspace B, nem por chamada direta ao Supabase com o token dele (teste automatizado).

### M2 — Ofertas e base de conhecimento
- **RF-2.1** CRUD de oferta: nome, resumo, problema/dor central, proposta de valor, provas/cases (lista com título, cliente, resultado, link), diferenciais, objeções comuns (lista objeção → resposta), status.
- **RF-2.2** Base de conhecimento: upload de PDF/DOCX/TXT/MD, URL ou texto colado. Extrair o texto no servidor e guardar em `knowledge_docs.extracted_text`. Pode vincular à oferta.
- **RF-2.3** **"Montar oferta com IA"** (agente `offer_builder`): lê os documentos e URLs e faz até 8 perguntas de entrevista (uma tela, respostas em texto). Gera rascunho da oferta para revisão.
- **CA:** com 1 PDF de apresentação comercial + 1 URL, o rascunho da oferta é gerado com todos os campos preenchidos e com as provas citando trechos do documento.

### M3 — Programas (assistente de criação com IA) ⭐
O coração do "usuário + IA criam a estrutura".

- **RF-3.1** "Novo programa" abre um **assistente em 7 passos**. Cada passo tem rascunho da IA → edição → aprovação. É possível salvar e voltar depois (status `draft`).
  1. **Oferta & segmento:** escolher a oferta; descrever o segmento em texto livre (ex.: "fabricantes de máquinas agrícolas no Brasil com rede de concessionárias"); objetivo do programa (ex.: reuniões com diretores de marketing); prazo.
  2. **ICP e critérios de fit** (agente `program_fit`): lista de critérios com nome, descrição, peso (soma 100) e como avaliar (dado de enriquecimento ou julgamento da IA). Inclui critérios eliminatórios.
  3. **Regras de tier** (agente `program_tiers`): sugestão de quantidade e regra por tier (ex.: T1 = fit ≥ 80 e potencial alto, máx. 15 contas). Editável.
  4. **Comitê** (agente `program_committee`): papéis com tipo, descrição, cargos típicos (PT e EN, porque o LinkedIn/Apollo mistura), senioridade, departamentos, obrigatório (s/n) e prioridade.
  5. **Plays por tier × papel** (agente `program_plays`): dor, mensagem-chave, prova (puxada da oferta), CTA e lead magnet sugerido. Grade com tier nas linhas e papel nas colunas; cada célula abre o editor.
  6. **Lead magnets** (agente `program_lead_magnets`): 3 a 6 ideias com tipo, descrição, papel-alvo, esforço (baixo/médio/alto) e "por que funciona para este comitê". Status: ideia, em produção, publicado (com URL).
  7. **Cadências e audiências** (agente `program_cadence`): uma cadência por tier a partir dos templates (seção 16), adaptada ao comitê e aos plays; plano de audiências (quais recortes exportar para LinkedIn e Meta e a meta de frequência por semana).
- **RF-3.2** Ao concluir, o programa vira `active`. Todos os itens continuam editáveis nas abas do programa.
- **RF-3.3** "Duplicar programa" (com ou sem contas) para clonar estrutura para outro segmento, e "Regenerar passo X com instrução".
- **RF-3.4** O contexto passado à IA em cada passo inclui: oferta, base de conhecimento (dentro do orçamento de tokens), passos já aprovados e o nome da metodologia.
- **CA:** do zero até `active` em menos de 60 minutos de interação em um segmento desconhecido, gerando ≥ 4 papéis, ≥ 8 plays, ≥ 3 lead magnets e 3 cadências.

### M4 — Contas
- **RF-4.1** Adicionar contas a um programa por:
  - (a) import CSV/XLSX com mapeamento de colunas (seção 11.1);
  - (b) cadastro manual;
  - (c) busca no Apollo, se configurado: filtros por setor, porte, localização e palavras-chave;
  - (d) seleção de contas já existentes no workspace.
- **RF-4.2** Deduplicação por domínio normalizado (sem `www`, minúsculo). Sem domínio, por nome normalizado e mesma cidade, com confirmação.
- **RF-4.3** Enriquecimento via Apollo (se configurado): setor, faixa de funcionários e faturamento, LinkedIn, descrição, tecnologias e localização. Botão por conta e em lote (fila em background).
- **RF-4.4** **Fit score por IA** (agente `account_fit`) contra os critérios do programa: nota 0–100, nota por critério e 3 motivos em texto. Em lote, roda em background com progresso.
- **RF-4.5** **Tier sugerido** pelas regras do passo 3; o usuário aceita em massa ou ajusta manualmente (`tier_source = manual`).
- **RF-4.6** Tabela de contas do programa com colunas: nome, tier, estágio, score total (barra com Fit/Eng/Timing), cobertura %, penetração %, frequência ads na semana, último sinal, próxima tarefa, dono. Filtros salvos.
- **RF-4.7** Página da conta (seção 6.1), com mudança manual de estágio (com motivo) e "não contatar" (`do_not_contact`), que bloqueia geração de tarefas.
- **RF-4.8** Aliases da conta (nomes alternativos) editáveis; usados na correspondência dos relatórios de ads.
- **CA:** importar 300 contas com 10% de duplicadas resulta em 270 criadas e 30 sinalizadas, com relatório baixável; o fit em lote de 300 contas termina sem travar a interface.

### M5 — Contatos e comitê
- **RF-5.1** Contatos por import, manual ou **busca no Apollo pela conta** (domínio + cargos típicos dos papéis obrigatórios do comitê). Antes de salvar, mostrar a lista com checkbox e o papel sugerido.
- **RF-5.2** **Classificação de papel por IA** (agente `contact_role`): a partir de cargo e departamento, atribui o papel do programa, com confiança. Abaixo de 0,6, marcar "revisar".
- **RF-5.3** Campos do contato: nome, sobrenome, cargo, senioridade, departamento, e-mail, telefone, WhatsApp, LinkedIn URL, origem do dado (`data_source`), base legal (padrão `legitimo_interesse`), `do_not_contact`, data de opt-out e token de rastreamento.
- **RF-5.4** **Matriz de cobertura do comitê** (aba Comitê do programa): linhas = contas (filtráveis por tier), colunas = papéis.
  - Célula: vazia (sem contato) · cinza (mapeado sem engajamento) · verde (engajado nos últimos 60 dias) · vermelho (negativo/opt-out).
  - Clique na célula abre os contatos ou a ação "buscar contato para este papel".
- **RF-5.5** Indicadores por conta: cobertura % e penetração % (seção 9).
- **CA:** numa conta com 4 papéis obrigatórios e 2 mapeados, a cobertura é 50%; registrar uma resposta de e-mail de um desses contatos faz a penetração ir para 25% e a célula ficar verde.

### M6 — Dossiê de conta
- **RF-6.1** "Gerar dossiê" (agente `account_dossier`). Profundidade `full` para T1 e `short` para T2/T3 (padrão configurável).
  - Fontes: busca na web pela IA, dados de enriquecimento, sinais registrados, oferta e play do tier.
  - Seções do `full`: resumo da empresa; momento/notícias recentes; estrutura e possíveis membros do comitê (sem inventar nomes — só fatos com fonte); hipóteses de dor ligadas à oferta; ganchos de abordagem por papel; perguntas para descoberta; riscos/objeções prováveis; fontes (URLs).
- **RF-6.2** Dossiê salvo com data, versão e fontes; botão "Atualizar". Ao gerar, fatos novos e datados viram **sinais sugeridos** para aceitar (ex.: "contratou novo diretor de marketing em 09/2026").
- **CA:** todo fato factual do dossiê tem URL de fonte; sem fonte, aparece marcado como "hipótese".

### M7 — Cadências e tarefas ⭐
- **RF-7.1** Editor de cadência:
  - nome, tiers aplicáveis, descrição, duração em dias úteis;
  - passos com: ordem, dia útil (offset a partir da inscrição), canal, papéis-alvo (um ou mais; vazio = todos), título, assunto (só e-mail), corpo-template, instruções para o BDR, e "passo de conta" (1 tarefa por conta, ex.: pesquisa ou ligação para recepção) ou "passo de contato" (1 tarefa por contato).
  - Canais: `email`, `linkedin_connect`, `linkedin_message`, `linkedin_engage` (curtir/comentar), `call`, `whatsapp`, `ads_touch` (só informativo, não gera tarefa: marca na linha do tempo que a conta está em audiência), `research`, `other`.
- **RF-7.2** Variáveis de template:
  - `{{contato.primeiro_nome}}`, `{{contato.cargo}}`, `{{conta.nome}}`
  - `{{play.dor}}`, `{{play.mensagem}}`, `{{play.prova}}`, `{{play.cta}}`
  - `{{lead_magnet.nome}}`, `{{lead_magnet.url_rastreada}}`
  - `{{sinal.mais_recente}}`, `{{bdr.primeiro_nome}}`
  - Preview com um contato real.
- **RF-7.3** **Inscrição:** inscrever contas (selecionadas, por tier ou por filtro) numa cadência.
  - Para cada passo de contato, gera tarefas para os contatos cujo papel bate com o passo e que não estejam `do_not_contact`.
  - Datas calculadas em **dias úteis** do workspace (fins de semana + feriados configurados).
  - O responsável é o dono da conta ou, na falta, o BDR padrão do programa.
- **RF-7.4** **Regras automáticas:**
  - Resultado `respondeu_positivo` ou `reuniao_agendada` → pausa a inscrição daquele **contato** e cria tarefa "Próximo passo" para o dono.
  - `nao_interessado` → para a inscrição do contato, gera sinal negativo e sugere `nutrir`.
  - `opt_out` → marca o contato `do_not_contact` e cancela as tarefas futuras dele.
  - `email_invalido` / `numero_errado` → sinal de qualidade de dado e tarefa "corrigir contato".
  - Quando todos os contatos de uma conta concluem ou param → inscrição `completed`.
- **RF-7.5** Pausar ou retomar inscrição (conta ou contato); reagendar tarefas (empurra as seguintes mantendo o espaçamento).
- **RF-7.6** **Personalizar com IA** (agente `task_personalize`): reescreve o texto do passo para aquele contato usando dossiê, sinais recentes, papel e play. Respeita o limite de caracteres por canal: LinkedIn connect ≤ 300, WhatsApp ≤ 700, e-mail ≤ 1.200. Guarda em `personalized_body`; o template original fica preservado.
- **CA:** inscrever 10 contas T1 numa cadência de 12 passos com 3 papéis gera exatamente as tarefas esperadas (teste unitário do gerador). Uma tarefa marcada `reuniao_agendada` pausa só aquele contato.

### M8 — Fila do dia (BDR) ⭐⭐
- **RF-8.1** Lista das tarefas do usuário com prazo ≤ hoje (atrasadas primeiro). Agrupamento alternável: **por canal** (padrão, para executar em bloco) ou **por conta**.
- **RF-8.2** Ordenação dentro do grupo: atrasada → tier (T1 primeiro) → score total → estágio mais avançado.
- **RF-8.3** **Card da tarefa** mostra:
  - contato (nome, cargo, papel), conta (tier, score, estágio), passo X de Y da cadência;
  - **último sinal**, texto pronto (personalizado se houver) e instruções.
  - Ações:
    - **Copiar texto**;
    - **Abrir canal**:
      - e-mail → `mailto:` com assunto e corpo;
      - WhatsApp → `https://wa.me/<numero>?text=<texto>`;
      - LinkedIn → abre o perfil;
      - ligação → `tel:`;
    - **Personalizar com IA**;
    - **Concluir** com resultado obrigatório + nota opcional;
    - **Pular** (com motivo), **Adiar** (amanhã / +2 dias úteis / data).
- **RF-8.4** Resultados por canal (enum `task_outcome`):
  - E-mail: `enviado`, `respondeu_positivo`, `respondeu_neutro`, `nao_interessado`, `email_invalido`, `opt_out`
  - LinkedIn: `convite_enviado`, `conexao_aceita`, `mensagem_enviada`, `respondeu_positivo`, `respondeu_neutro`, `nao_interessado`
  - Ligação: `nao_atendeu`, `caixa_postal`, `conversou`, `reuniao_agendada`, `numero_errado`, `nao_interessado`, `retornar_depois`
  - WhatsApp: `enviado`, `respondeu_positivo`, `respondeu_neutro`, `nao_interessado`, `numero_errado`, `opt_out`
  - Pesquisa/outro: `feito`
  - Cada resultado gera uma atividade e, quando mapeado, um sinal (seção 9.4).
- **RF-8.5** **"Registrar atividade avulsa"** (fora da cadência): conta, contato, canal, resultado e nota.
- **RF-8.6** Contadores no topo: tarefas de hoje, concluídas hoje, atrasadas, reuniões na semana. Barra de progresso do dia.
- **RF-8.7** Atalhos de teclado: `j/k` navegar, `c` copiar, `o` abrir canal, `d` concluir, `s` pular, `p` personalizar.
- **RF-8.8** Ótima no celular: card em tela cheia, botões grandes, abrir WhatsApp/telefone nativo.
- **RF-8.9** Bloco lateral **"Contas que esquentaram"**: contas que cruzaram o limiar de score ou receberam sinal de alto peso nas últimas 48h, com ação "criar tarefa".
- **CA:** um BDR conclui 20 tarefas de e-mail e LinkedIn em sequência sem sair da tela, em ≤ 3 cliques cada (abrir canal → concluir → resultado).

### M9 — Sinais e rastreamento web
- **RF-9.1** Feed de sinais (na conta, no programa e global) com filtro por tipo, origem e período. Cada sinal mostra título, data, origem, peso, contato (se houver) e link.
- **RF-9.2** **Rastreamento web:**
  - Snippet JS em `/t.js?ws=<publicKey>` para o site do cliente (Configurações → Rastreamento).
  - Registra pageview com URL, path, referrer e um `visitor_id` em first-party `localStorage`.
  - **Links rastreados** por contato: `https://<app>/r/<token>` redireciona para o destino com `?cerco=<token>` (nome do parâmetro configurável). O snippet lê o parâmetro e associa o `visitor_id` ao contato e à conta. Visitas futuras do mesmo `visitor_id` são atribuídas.
  - Regras de página de alta intenção por workspace (padrões de path, ex.: `/precos`, `/cases/*`, `/calculadora`) → tipo de sinal `site_visit_high_intent`.
  - Agregação: no máximo **1 sinal de visita por contato por dia** (os eventos brutos ficam em `web_events`).
  - Sem desanonimização por IP. Respeitar o *Do Not Track*, se presente (configurável).
- **RF-9.3** **Conversões** (formulário, lead magnet): via webhook de entrada (seção 12) ou via `cerco.track('conversion', {email, name, form})` no snippet. Busca o contato por e-mail; se não existir e o domínio do e-mail bater com uma conta, cria o contato e um sinal.
- **RF-9.4** **Apollo (opcional):** job semanal por conta T1/T2 consultando vagas abertas; vaga cujo título casa com palavras-chave do programa (definidas no passo 2) gera o sinal `hiring_relevant_role`.
- **RF-9.5** **Caçador de sinais por IA** (agente `signal_hunter`): job semanal (dia e horário configuráveis) para contas T1, e T2 opcional, com limite de custo por workspace.
  - Busca na web notícias e movimentos dos últimos 30 dias: expansão, investimento, lançamento, troca de liderança, contratação, eventos, mudança de tecnologia.
  - Cria **sinais sugeridos** (status `suggested`) com URL obrigatória. O manager ou BDR aceita ou descarta em lote. Só sinais aceitos contam no score.
- **RF-9.6** **Sinal manual:** qualquer usuário ativo cria (tipo, data, nota, URL).
- **RF-9.7** Deduplicação por `dedupe_key` (ex.: `hash(origem + tipo + conta + contato + data + url)`).
- **CA:** clique num link rastreado → visita em `/cases/x` → sinal `site_visit_high_intent` no contato certo em ≤ 1 min; score recalculado.

### M10 — Score, estágios e alertas
Regras na seção 9.
- **RF-10.1** Recalcular o score da conta no programa: em tempo quase real ao inserir sinal (função/trigger ou fila), e em job diário (para o decaimento).
- **RF-10.2** "Por que este score?": a decomposição mostra Fit (por critério), Engajamento (top sinais com peso e decaimento, multiplicador de papéis) e Timing (top sinais), mais **3 motivos em linguagem natural**. Os motivos são gerados por template, sem IA, para ser instantâneo.
- **RF-10.3** **Estágio automático** com regras (seção 9.3) e override manual com motivo. Manual "trava" até nova mudança manual ou até um evento de estágio mais avançado.
- **RF-10.4** Alertas: conta cruzou o limiar "quente"; sinal de peso ≥ 20; reunião agendada. Notificação in-app (sino) e e-mail diário opcional ao dono (via Resend).
- **CA:** com os pesos padrão, o cenário de teste da seção 18.3 produz exatamente o score esperado (teste unitário da função).

### M11 — Ads: uploads de relatórios ⭐
Especificação detalhada na seção 11.2.
- **RF-11.1** Upload de CSV/XLSX → detecção do template → mapeamento de colunas → período → correspondência de empresas → revisão → confirmar.
- **RF-11.2** Métricas por conta e semana (LinkedIn por empresa) e por campanha/conjunto ligadas a uma audiência (Meta e LinkedIn por campanha).
- **RF-11.3** Gera sinais de ads e alimenta a **frequência semanal por conta** e o estágio `aquecendo`.
- **RF-11.4** Painéis: frequência por conta vs. meta (programa → Audiências & Ads), contas da audiência sem impressão no período, evolução semanal.
- **CA:** reenviar o mesmo arquivo não duplica métricas; enviar um arquivo com 200 empresas em que 150 são contas do programa resulta em ≥ 85% de correspondência automática e o restante em fila de revisão.

### M12 — Audiências e export
Especificação na seção 11.3.
- **RF-12.1** Construtor de audiência: programa + filtros (tiers, estágios, faixa de score, papéis, segmento/tag, "só contas sem reunião") → contagem de contas e contatos em tempo real.
- **RF-12.2** Export nos formatos: LinkedIn — lista de empresas; LinkedIn — lista de contatos; Meta — lista de clientes; CSV genérico. Histórico de exports (quem, quando, quantos, arquivo).
- **RF-12.3** Avisos de tamanho: lista de empresas no LinkedIn pequena demais (mínimo de membros correspondidos) → sugere unir tiers ou segmentos ou usar lista de contatos. Contatos sem e-mail ficam fora do export de contatos (com contagem).
- **RF-12.4** Exclusões: `do_not_contact` sempre fora; opção de excluir clientes atuais e contas `perdida`.
- **CA:** o arquivo exportado abre sem erro no upload de lista do Campaign Manager e do Gerenciador de Públicos do Meta (validação manual com arquivos de exemplo).

### M13 — Painel, brief semanal e copiloto
- **RF-13.1** **Painel do workspace e do programa:**
  - funil por estágio (contas por estágio, por tier);
  - contas quentes;
  - cobertura e penetração médias;
  - tarefas concluídas por BDR na semana;
  - reuniões e oportunidades por tier;
  - frequência média vs. meta;
  - lead magnets publicados e conversões.
- **RF-13.2** **Brief semanal** (agente `weekly_brief`): toda segunda às 7h (configurável), por programa ativo. Conteúdo:
  - o que mudou (contas que avançaram ou esfriaram, sinais relevantes);
  - prioridades da semana (top 10 contas e por quê);
  - lacunas de comitê nas contas T1;
  - alertas (frequência abaixo da meta, cadências travadas);
  - 3 recomendações de ajuste da estratégia.
  - Salvo, visível no Início e enviado por e-mail ao manager.
- **RF-13.3** **Copiloto** (agente `copilot`): chat com contexto do workspace e da tela.
  - Ferramentas **somente leitura** (consultar contas, sinais, tarefas, estrutura) + **propor alterações** como cartões "Aplicar" (criar play, ajustar mensagem, mover tier, criar lead magnet), que o usuário confirma.
  - Histórico por usuário.
  - Exemplos: "qual lead magnet para o CFO deste segmento?", "por que a conta X esfriou?", "monte uma cadência T3 mais curta".
- **CA:** o brief cita contas e números reais do banco (sem valores inventados); uma ação proposta pelo copiloto só altera dados depois do clique em "Aplicar".

### M14 — Oportunidades (mini-CRM)
- **RF-14.1** Oportunidade: conta, programa, nome, valor (BRL), estágio (lista configurável por workspace; padrão: `qualificacao`, `proposta`, `negociacao`, `ganha`, `perdida`), datas e dono.
- **RF-14.2** Criar oportunidade move a conta para `oportunidade`; ganha/perdida move a conta para `ganha`/`perdida`.
- **RF-14.3** Para quem usa CRM externo, as oportunidades chegam e são atualizadas via API/Make (seção 12) com `external_refs`.

---

## 8. Modelo de dados

Postgres (Supabase). Todas as tabelas de workspace têm `workspace_id uuid not null`, `created_at`, `updated_at`, RLS ativa e índices em `(workspace_id, ...)`. Usar `uuid` (gen_random_uuid) e enums do Postgres. A lista abaixo é a especificação; os tipos exatos ficam a critério da implementação, mantendo os nomes.

### 8.1 Plataforma e tenancy
```
clients(id, name, legal_name, cnpj, status[design_partner|active|paused|churned],
        plan text null, contract_value_brl numeric null, billing_day int null,
        billing_notes text, main_contact_name, main_contact_email, started_at, notes)
workspaces(id, client_id, name, slug unique, status[active|paused|archived],
        timezone default 'America/Sao_Paulo', settings jsonb, feature_flags jsonb,
        ai_monthly_budget_usd numeric default 50, tracking_public_key text unique)
  -- settings: business_days[1..5], holidays[date], score_thresholds{hot:70,warm:40},
  --           frequency_target_weekly int, high_intent_paths[], tracking_param 'cerco',
  --           signal_hunter{weekday, hour, include_t2}, brief{weekday, hour}
profiles(id = auth.users.id, full_name, email, phone, is_platform_admin bool default false,
        status[active|disabled], last_seen_at)
workspace_members(workspace_id, user_id, role[manager|bdr|viewer], primary key(workspace_id,user_id))
platform_settings(key text pk, value jsonb)   -- tabela de preços de IA, modelos padrão etc.
audit_logs(id, workspace_id null, actor_id, action, entity_type, entity_id, diff jsonb, ip, created_at)
```

### 8.2 Estratégia
```
offers(id, workspace_id, name, summary, problem, value_prop, proofs jsonb, differentiators jsonb,
       objections jsonb, status[draft|active|archived])
knowledge_docs(id, workspace_id, offer_id null, title, source_type[file|url|text], storage_path,
       url, extracted_text, token_estimate int, created_by)
programs(id, workspace_id, offer_id, name, segment_description, objective, deadline date null,
       status[draft|active|paused|archived], wizard_step int, fit_criteria jsonb, tier_rules jsonb,
       hiring_keywords text[], default_bdr_id null, frequency_target_weekly int null)
  -- fit_criteria: [{key,name,description,weight,eliminatory:bool,evaluation:'enrichment'|'ai'}]
  -- tier_rules: [{tier:1,min_fit:80,max_accounts:15,rule_text}, ...]
committee_roles(id, workspace_id, program_id, key, name, role_type[economic|champion|technical|user|
       procurement|influencer|blocker], description, typical_titles text[], seniorities text[],
       departments text[], required bool, priority int)
plays(id, workspace_id, program_id, tier int, role_id, pain, key_message, proof, cta,
       lead_magnet_id null, status[draft|approved])  unique(program_id,tier,role_id)
lead_magnets(id, workspace_id, program_id, name, type[calculadora|diagnostico|demo_espelho|benchmark|
       conteudo|evento|outro], description, target_role_ids uuid[], effort[baixo|medio|alto],
       rationale, status[ideia|em_producao|publicado], url null)
```

### 8.3 Contas e contatos
```
accounts(id, workspace_id, name, domain null, website, linkedin_url, industry, employees_range,
       revenue_range, city, state, country default 'BR', description, aliases text[],
       enrichment jsonb, apollo_id, data_source[import|manual|apollo|api|webhook],
       do_not_contact bool default false, owner_id null, tags text[])
       unique(workspace_id, domain) where domain is not null
program_accounts(id, workspace_id, program_id, account_id, tier int null, tier_source[ai|manual],
       fit_score int, fit_breakdown jsonb, fit_reasons text[], stage[alvo|aquecendo|engajada|
       conversa|oportunidade|ganha|perdida|nutrir] default 'alvo', stage_source[auto|manual],
       stage_locked bool, engagement_score numeric, timing_score numeric, total_score numeric,
       coverage_pct numeric, penetration_pct numeric, ads_freq_last_week numeric,
       score_breakdown jsonb, last_signal_at, last_scored_at, enrolled_at)
       unique(program_id, account_id)
contacts(id, workspace_id, account_id, first_name, last_name, title, seniority, department,
       email, phone, whatsapp, linkedin_url, apollo_id, data_source, legal_basis default
       'legitimo_interesse', do_not_contact bool, opted_out_at, tracking_token text unique,
       needs_review bool)
contact_roles(workspace_id, program_id, contact_id, role_id, source[ai|manual], confidence numeric,
       primary key(program_id, contact_id))
dossiers(id, workspace_id, account_id, program_id null, depth[full|short], content_md,
       sources jsonb, version int, ai_run_id, generated_at)
opportunities(id, workspace_id, account_id, program_id null, name, stage, value_brl, status[open|won|
       lost], expected_close date, owner_id, closed_at)
external_refs(id, workspace_id, entity_type[account|contact|opportunity|activity], entity_id,
       system[odoo|pipedrive|hubspot|apollo|other], external_id, url, unique(workspace_id,
       entity_type, system, external_id))
```

### 8.4 Execução
```
cadences(id, workspace_id, program_id, name, tiers int[], description, business_days int,
       status[draft|active|archived])
cadence_steps(id, workspace_id, cadence_id, position int, day_offset int, channel, scope[contact|
       account], role_ids uuid[], title, subject_template, body_template, instructions)
enrollments(id, workspace_id, cadence_id, program_account_id, contact_id null, status[active|paused|
       completed|stopped], started_at, paused_reason, stopped_reason)
tasks(id, workspace_id, program_id, account_id, contact_id null, enrollment_id null, step_id null,
       channel, title, due_date date, assignee_id, status[pending|done|skipped|cancelled],
       outcome null, notes, rendered_subject, rendered_body, personalized_body, skip_reason,
       snoozed_from date null, completed_at, completed_by)
activities(id, workspace_id, account_id, contact_id null, program_id null, task_id null, channel,
       outcome, notes, occurred_at, created_by, source[task|manual|api|webhook])
```

### 8.5 Sinais, rastreamento e ads
```
signal_types(id, workspace_id null, key, name, category[engagement|timing|negative|quality],
       default_weight numeric, half_life_days int, scope[account|contact], active bool)
  -- workspace_id null = catálogo global; linha com workspace_id sobrescreve o peso
signals(id, workspace_id, account_id, contact_id null, program_id null, type_key, source[task|
       tracking|ads_upload|webhook|apollo|ai_hunter|dossier|manual|import|crm], status[active|
       suggested|dismissed], weight numeric, occurred_at, title, details jsonb, url,
       dedupe_key unique, created_by null, ai_run_id null)
tracked_links(id, workspace_id, contact_id, account_id, program_id, lead_magnet_id null,
       destination_url, token unique, clicks int)
web_visitors(id, workspace_id, visitor_id, contact_id null, account_id null, first_seen, last_seen)
web_events(id, workspace_id, visitor_id, contact_id null, account_id null, event_type[pageview|
       conversion|click], url, path, referrer, props jsonb, occurred_at)
audiences(id, workspace_id, program_id, name, filters jsonb, target[linkedin_companies|
       linkedin_contacts|meta_customers|generic], notes)
audience_exports(id, workspace_id, audience_id, format, row_count, skipped_count, storage_path,
       created_by, created_at, snapshot_account_ids uuid[])
ad_report_templates(id, workspace_id null, name, platform[linkedin|meta|google|other],
       report_kind[company_level|campaign_level], detection jsonb, column_map jsonb)
ad_report_uploads(id, workspace_id, platform, template_id, report_kind, file_name, storage_path,
       file_hash, period_start, period_end, audience_id null, program_id null,
       status[parsing|mapping|needs_review|committed|failed|reverted], stats jsonb, error,
       uploaded_by, committed_at)
ad_report_rows(id, workspace_id, upload_id, raw jsonb, company_raw text null, campaign_raw text null,
       match_status[auto|reviewed|unmatched|ignored], account_id null, similarity numeric)
ad_metrics(id, workspace_id, upload_id, platform, account_id null, audience_id null, campaign_name,
       period_start, period_end, impressions int, clicks int, engagements int, spend_brl numeric,
       reach int null, frequency numeric null, leads int null)
```

### 8.6 IA, integrações e notificações
```
ai_runs(id, workspace_id, user_id null, agent, model, prompt_version, input_tokens, output_tokens,
       web_searches int, cost_usd numeric, status[ok|error|cancelled], duration_ms, entity_type,
       entity_id, error, created_at)
ai_suggestions(id, workspace_id, ai_run_id, entity_type, entity_id null, payload jsonb,
       status[pending|accepted|edited|discarded], decided_by, decided_at)
weekly_briefs(id, workspace_id, program_id, week_start date, content_md, data jsonb, ai_run_id)
copilot_threads(id, workspace_id, user_id, title) / copilot_messages(id, thread_id, role, content,
       tool_calls jsonb, created_at)
api_keys(id, workspace_id, name, prefix, key_hash, scopes text[], last_used_at, revoked_at, created_by)
webhook_endpoints(id, workspace_id, name, url, events text[], secret, active)
webhook_deliveries(id, workspace_id, endpoint_id, event, payload jsonb, status[pending|ok|failed],
       attempts int, last_status_code, last_error, next_retry_at)
inbound_hooks(id, workspace_id, name, kind[signal|conversion|account|contact|opportunity|activity],
       token unique, mapping jsonb, active, last_received_at)
integration_settings(workspace_id, apollo_enabled bool, apollo_secret_id (Supabase Vault),
       crm_system null, notes)
notifications(id, workspace_id, user_id, kind, title, body, link, read_at)
imports(id, workspace_id, kind[accounts|contacts|signals|activities], file_name, storage_path,
       column_map jsonb, status, stats jsonb, error_report_path, created_by)
```

### 8.7 RLS (regra geral)
- Função `is_member(ws uuid)` e `member_role(ws uuid)`; função `is_platform_admin()`.
- `select`: `is_platform_admin() or is_member(workspace_id)`.
- `insert/update/delete`: conforme a matriz da seção 4.2 (ex.: `bdr` pode inserir em `tasks`, `activities`, `signals` manuais e `contacts`, mas não em `programs`).
- Tabelas de plataforma (`clients`, `platform_settings`, `profiles.is_platform_admin`): só `platform_admin`.
- Endpoints públicos (`/t.js`, `/api/t/collect`, `/r/[token]`, `/api/hooks/[token]`, `/api/v1/*`) rodam no servidor com service role e validação própria (chave pública, token, chave de API) e **nunca** expõem a service role ao cliente.

---

## 9. Score, estágios e sinais

### 9.1 Fórmula (por `program_account`)
- **Fit (0–40)** = `fit_score (0–100, do agente account_fit) × 0,4`. Critério eliminatório reprovado → fit = 0 e flag "fora do ICP".
- **Engajamento (0–40)**:
  - `E_raw = Σ (peso × 0,5^(idade_dias / meia_vida))` para sinais `category = engagement` ativos nos últimos 180 dias.
  - `papeis_engajados` = papéis distintos com sinal de engajamento nos últimos 60 dias.
  - Multiplicador: 1 papel = 1,0 · 2 papéis = 1,15 · 3+ papéis = 1,3.
  - `E = min(40, E_raw × multiplicador)`.
- **Timing (0–20)** = `min(20, Σ peso × decaimento)` para `category = timing`.
- **Negativos:** sinais `category = negative` subtraem do engajamento (sem passar de 0).
- **Total** = Fit + Engajamento + Timing (0–100). Limiares padrão: **quente ≥ 70**, **morna 40–69**, **fria < 40** (configuráveis por workspace).
- Sinais sem contato contam para a conta; sinais com contato também alimentam `papeis_engajados` via `contact_roles` do programa.
- **Cobertura** = papéis obrigatórios com ≥ 1 contato / papéis obrigatórios.
- **Penetração** = papéis obrigatórios com ≥ 1 sinal de engajamento em 60 dias / papéis obrigatórios.
- Implementar como função SQL ou módulo TypeScript **puro e testável** (`lib/scoring.ts`) e chamar a partir de jobs e triggers.

### 9.2 Catálogo padrão de sinais (editável por workspace)
| key | Nome | Categoria | Peso | Meia-vida (dias) |
|---|---|---|---|---|
| `email_reply_positive` | Resposta positiva (e-mail) | engagement | 18 | 45 |
| `email_reply_neutral` | Resposta neutra (e-mail) | engagement | 8 | 30 |
| `linkedin_accepted` | Conexão aceita | engagement | 4 | 30 |
| `linkedin_reply_positive` | Resposta positiva (LinkedIn) | engagement | 15 | 45 |
| `linkedin_reply_neutral` | Resposta neutra (LinkedIn) | engagement | 7 | 30 |
| `whatsapp_reply_positive` | Resposta positiva (WhatsApp) | engagement | 15 | 45 |
| `whatsapp_reply_neutral` | Resposta neutra (WhatsApp) | engagement | 7 | 30 |
| `call_conversation` | Conversa por telefone | engagement | 12 | 45 |
| `meeting_booked` | Reunião agendada | engagement | 30 | 90 |
| `site_visit` | Visita ao site | engagement | 3 | 14 |
| `site_visit_high_intent` | Visita a página de alta intenção | engagement | 8 | 14 |
| `lead_magnet_conversion` | Conversão em lead magnet | engagement | 20 | 60 |
| `form_submit` | Formulário enviado | engagement | 20 | 60 |
| `event_attendance` | Participou de evento/webinar | engagement | 15 | 60 |
| `ads_impressions_week` | Impressões de ads na semana (conta) | engagement | 1 a cada 100 impressões, máx. 5 | 14 |
| `ads_engagement` | Clique/engajamento em ads (conta) | engagement | 4 por clique, máx. 12 | 21 |
| `hiring_relevant_role` | Vaga relevante aberta | timing | 8 | 60 |
| `leadership_change` | Troca de liderança relevante | timing | 10 | 90 |
| `expansion_investment` | Expansão/investimento/lançamento | timing | 8 | 90 |
| `news_relevant` | Notícia relevante | timing | 5 | 45 |
| `tech_change` | Mudança de tecnologia/fornecedor | timing | 6 | 60 |
| `not_interested` | Não interessado | negative | −15 | 90 |
| `opt_out` | Pediu para não ser contatado | negative | −25 | 365 |
| `data_quality_issue` | E-mail inválido / número errado | quality | 0 | — |

### 9.3 Regras de estágio automático (aplicadas na ordem; nunca rebaixa, exceto por ação manual)
1. Oportunidade aberta → `oportunidade`; ganha → `ganha`; perdida → `perdida`.
2. `meeting_booked` ou resposta positiva ou `call_conversation` nos últimos 90 dias → `conversa`.
3. ≥ 2 contatos distintos (ou ≥ 2 papéis) com sinais de engajamento em 30 dias → `engajada`.
4. Qualquer sinal de ads, visita ou conexão aceita em 30 dias → `aquecendo`.
5. Caso contrário → `alvo`.
- `nutrir` só por ação manual ou sugestão (após `not_interested` em todos os papéis contatados).
- Manual com `stage_locked = true` só é sobrescrito por estágio mais avançado vindo das regras 1–2.

### 9.4 Mapeamento resultado de tarefa → sinal
| Resultado | Sinal |
|---|---|
| `respondeu_positivo` (e-mail/LinkedIn/WhatsApp) | `*_reply_positive` do canal |
| `respondeu_neutro` | `*_reply_neutral` do canal |
| `conexao_aceita` | `linkedin_accepted` |
| `conversou` | `call_conversation` |
| `reuniao_agendada` | `meeting_booked` |
| `nao_interessado` | `not_interested` |
| `opt_out` | `opt_out` + `do_not_contact` |
| `email_invalido`, `numero_errado` | `data_quality_issue` + tarefa "corrigir contato" |
| `enviado`, `convite_enviado`, `mensagem_enviada`, `nao_atendeu`, `caixa_postal`, `retornar_depois`, `feito` | nenhum (só atividade) |

---

## 10. Agentes de IA

### 10.1 Regras gerais
- **Provedor:** Claude API (SDK oficial `@anthropic-ai/sdk`).
- **Modelos configuráveis** em `platform_settings` e por env, com padrões:
  - `AI_MODEL_SMART` (estratégia, dossiê, brief, copiloto);
  - `AI_MODEL_FAST` (classificações em lote, personalização curta).
  - Consultar a documentação atual da Anthropic para os identificadores de modelo vigentes e para a ferramenta de busca na web do lado do servidor. Não fixar os nomes no código.
- **Saídas estruturadas:** cada agente define um **JSON Schema** e usa tool use / saída estruturada; validar com **Zod** antes de salvar. Inválido → 1 nova tentativa com o erro → falha registrada.
- **Prompts versionados** em `/prompts/<agente>.md`, com `prompt_version` registrada em `ai_runs`. Todo prompt recebe: nome do produto e da metodologia (env), idioma pt-BR, data atual, contexto do workspace (oferta resumida), e a regra de **não inventar** pessoas, e-mails, números ou fatos sem fonte.
- **Rascunho primeiro:** toda saída vira `ai_suggestions` (ou registro em `draft`/`suggested`) até a ação do usuário.
- **Custo:**
  - registrar tokens, buscas na web e custo estimado (tabela de preços em `platform_settings`, editável no ADM) em `ai_runs`;
  - bloquear jobs automáticos quando o workspace passar do orçamento mensal (`ai_monthly_budget_usd`), com aviso ao manager e ao ADM;
  - ações manuais continuam, com aviso.
- **Background:** jobs em lote (fit, dossiês, caçador, brief) rodam em fila com concorrência limitada, retry com backoff e progresso visível.
- **Contexto de documentos:** sem embeddings na V1. Montar o contexto com a oferta + resumos dos `knowledge_docs` + texto completo dos docs marcados como "essenciais", até um orçamento de tokens (padrão 30k).

### 10.2 Catálogo de agentes
| Agente | Gatilho | Entrada | Ferramentas | Saída (schema resumido) |
|---|---|---|---|---|
| `offer_builder` | M2 | docs, URLs, respostas da entrevista | web_fetch/search (URLs informadas) | `{name, summary, problem, value_prop, proofs[{title,client,result,source}], differentiators[], objections[{objection,answer}], interview_questions[]}` |
| `program_fit` | Assistente, passo 2 | oferta, segmento, objetivo | web_search (opcional, entender o segmento) | `{criteria[{key,name,description,weight,eliminatory,evaluation}], hiring_keywords[], segment_notes}` |
| `program_tiers` | Passo 3 | critérios, tamanho estimado da lista | — | `{tiers[{tier,rule_text,min_fit,max_accounts,personalization_level}]}` |
| `program_committee` | Passo 4 | oferta, segmento, critérios | web_search opcional | `{roles[{key,name,role_type,description,typical_titles_pt[],typical_titles_en[],seniorities[],departments[],required,priority}]}` |
| `program_plays` | Passo 5 | oferta, comitê, tiers | — | `{plays[{tier,role_key,pain,key_message,proof,cta,lead_magnet_key}]}` |
| `program_lead_magnets` | Passo 6 | oferta, comitê, plays | — | `{lead_magnets[{key,name,type,description,target_role_keys[],effort,rationale}]}` |
| `program_cadence` | Passo 7 | templates de cadência, plays, comitê | — | `{cadences[{tiers[],name,business_days,steps[{day_offset,channel,scope,role_keys[],title,subject_template,body_template,instructions}]}], audiences[{name,filters,target}], frequency_target_weekly}` |
| `account_fit` | M4 (lote) | conta + enriquecimento + critérios | web_search (se faltar dado; configurável) | `{score, breakdown[{key,score,evidence}], reasons[3], eliminated:bool, eliminated_reason}` |
| `contact_role` | M5 (lote) | cargo, departamento, papéis do programa | — | `{role_key, confidence, rationale}` |
| `account_dossier` | M6 | conta, programa, oferta, sinais | web_search | `{content_md, facts[{text,url,date}], hypotheses[], suggested_signals[{type_key,title,date,url}]}` |
| `task_personalize` | M7/M8 | template, contato, conta, dossiê, sinais, play | — | `{subject?, body, used_signals[]}` |
| `signal_hunter` | Job semanal | conta, oferta, palavras-chave, sinais existentes | web_search | `{signals[{type_key,title,occurred_at,url,summary,confidence}]}` |
| `weekly_brief` | Job semanal | dados agregados do programa (JSON pronto, calculado no servidor) | — | `{content_md, top_accounts[{account_id,why}], recommendations[3]}` |
| `copilot` | Chat | mensagem + contexto de tela | ferramentas internas: `search_accounts`, `get_account`, `list_signals`, `get_program_structure`, `get_metrics`, `propose_change` | texto + cartões `propose_change{entity_type, action, payload}` |

**Brief e copiloto nunca calculam números:** recebem os números já agregados pelo servidor e só interpretam.

---

## 11. Importações, uploads de ads e exportação de audiências

### 11.1 Importação de contas, contatos, sinais e atividades (CSV/XLSX)
Fluxo padrão (componente reutilizável):
1. **Upload** (até 20 MB; CSV com detecção de separador `,`/`;` e encoding UTF-8/Latin-1; XLSX com escolha de aba).
2. **Mapeamento de colunas:** sugestão automática por nome (PT/EN, sem acento, sinônimos) + ajuste manual. Salvar como "modelo de mapeamento" reutilizável.
3. **Pré-visualização** das 20 primeiras linhas já transformadas + validação (e-mail, URL, domínio).
4. **Regras:**
   - contas deduplicadas por domínio/nome;
   - contatos ligados à conta por coluna de domínio, coluna de empresa (correspondência) ou domínio do e-mail;
   - opção "atualizar existentes" vs. "só criar novos".
5. **Execução em background** com progresso; **relatório de erros** em CSV para baixar.
6. Registro em `imports` + `audit_logs`.

Campo obrigatório de **origem do dado** (texto livre, ex.: "Apollo export 10/2026", "Lista evento X"), gravado em `data_source` — exigência de LGPD.

### 11.2 Upload de relatórios de ads ⭐ (precisa funcionar muito bem)
**Objetivo:** medir quanto cada conta do comitê está sendo impactada (frequência) e gerar sinais, sem integração por API.

**Tipos de relatório suportados na V1:**
| Template | Nível | Uso |
|---|---|---|
| LinkedIn — relatório por empresa (dados demográficos por empresa ou relatório de engajamento de empresas do Campaign Manager) | por empresa | impressões, cliques e engajamento por **conta** |
| LinkedIn — desempenho de campanha | por campanha | frequência e investimento por **audiência** |
| Meta — exportação do Gerenciador de Anúncios (campanha/conjunto/anúncio) | por campanha/conjunto | frequência, alcance e investimento por **audiência** (o Meta não informa empresa) |
| Genérico | qualquer | colunas mapeadas manualmente |

**Pasta de amostras:** o Diego vai colocar exports reais em `/samples/ads/` (`linkedin_company_*.csv`, `linkedin_campaign_*.csv`, `meta_*.csv|xlsx`). **Os parsers e templates de detecção devem ser construídos e testados com esses arquivos.** Os nomes de colunas variam por idioma da conta (PT/EN) e mudam com o tempo, então:
- a detecção usa assinaturas de colunas (conjunto de cabeçalhos esperados, com sinônimos PT/EN) e pontua a melhor correspondência;
- linhas de metadados no topo do arquivo (comuns em exports do LinkedIn, ex.: nome do relatório e período) são detectadas e puladas; o período é extraído delas quando existir;
- se nenhum template passar de 70% de confiança, ir para o mapeamento manual e oferecer "salvar como template do workspace".

**Fluxo:**
1. **Upload** → hash do arquivo. Se o hash já foi confirmado → aviso "arquivo já importado" (permite reverter e reimportar).
2. **Detecção do template** + confirmação do usuário.
3. **Mapeamento de colunas** (pré-preenchido pelo template): empresa, campanha, conjunto, impressões, cliques, engajamentos, investimento, alcance, frequência, leads, data/período.
4. **Período:** extraído do arquivo ou informado (início/fim). Se o arquivo tiver coluna de data por linha, agregar por semana ISO.
5. **Vínculo:** relatórios por campanha exigem escolher a **audiência** (ou programa + tier) a que a campanha corresponde. Lembrar o vínculo por nome de campanha para os próximos uploads.
6. **Correspondência de empresas** (relatórios por empresa):
   - a. Normalizar nome: minúsculas, sem acento, sem sufixos societários (`ltda`, `s.a.`, `s/a`, `sa`, `eireli`, `me`, `epp`, `inc`, `group`, `grupo`, `do brasil`, `brasil`) e sem pontuação.
   - b. Exato com `accounts.name` normalizado ou `aliases` → **auto**.
   - c. Similaridade (`pg_trgm`) ≥ 0,85 → **auto**; entre 0,6 e 0,85 → **fila de revisão** com top 3 sugestões; < 0,6 → **sem correspondência**.
   - d. Na revisão: confirmar sugestão, escolher outra conta, **criar alias** (próximos uploads casam sozinhos) ou ignorar. Ação em lote "ignorar todos os sem correspondência".
   - e. Empresas da lista que não são contas do workspace aparecem num relatório à parte ("empresas impactadas fora da lista"), útil para descobrir contas novas, com ação "adicionar como conta".
7. **Pré-visualização:** totais do arquivo vs. totais atribuídos, % de correspondência, contas da audiência **sem impressão**.
8. **Confirmar:** grava `ad_metrics`, gera sinais `ads_impressions_week` e `ads_engagement` por conta e semana (com `dedupe_key` por conta + semana + plataforma) e recalcula score e estágio.
9. **Reverter:** desfaz métricas e sinais daquele upload.

**Idempotência:** confirmar o mesmo período + plataforma + campanha/conta **substitui** os valores (não soma). Teste automatizado obrigatório.

**Métricas derivadas:**
- Frequência semanal por conta = impressões da conta na semana (LinkedIn por empresa). Comparar com `frequency_target_weekly` do programa.
- Frequência por audiência = coluna de frequência do relatório (Meta/LinkedIn campanha) ou impressões / alcance.
- Painel: distribuição de contas por faixa de frequência (0, 1–4, 5–9, 10+), tendência semanal e lista "contas sem impressão há 2+ semanas".

### 11.3 Export de audiências
| Formato | Colunas (validar contra o template atual de cada plataforma) | Regras |
|---|---|---|
| LinkedIn — empresas | `companyname, companywebsite, companyemaildomain, linkedincompanypageurl, industry, city, state, companycountry` | usar domínio e URL do LinkedIn quando houver; país como código ISO |
| LinkedIn — contatos | `email, firstname, lastname, jobtitle, employeecompany, country` | só contatos com e-mail; excluir `do_not_contact` |
| Meta — lista de clientes | `email, phone, fn, ln, ct, st, country` | telefone em E.164 (+55…); opção de exportar com hash SHA-256 normalizado |
| Genérico | todas as colunas principais + tier, estágio, score, papel | — |

- Templates de colunas configuráveis em `platform_settings` (sem mudar código caso a plataforma altere o formato).
- Aviso de tamanho para LinkedIn: lista de empresas abaixo de ~300 contas → "provável que não atinja o mínimo de membros correspondidos; una tiers/segmentos ou use lista de contatos" (limiar configurável).
- Cada export guarda o snapshot das contas incluídas, para depois comparar com o relatório de impressões ("contas exportadas que não receberam impressão").

---

## 12. Integrações: API, webhooks e setup via Make

Princípio da V1: a plataforma expõe uma **API simples e estável + webhooks**. A Vivaz monta no Make as pontes com Odoo, Pipedrive e HubSpot durante o setup do cliente. Conectores nativos ficam para depois.

### 12.1 API REST `v1`
- Base: `/api/v1`. Autenticação: `Authorization: Bearer <chave>`, chave por workspace criada no ADM (exibida uma vez, com prefixo visível e hash armazenado). Escopos: `read`, `write`.
- JSON, paginação por cursor, `Idempotency-Key` aceito nos POST/PUT, rate limit (ex.: 60 req/min por chave), erros no formato `{error:{code,message,details}}`.
- **Upsert por referência externa:** toda entidade aceita `external_ref: {system, external_id}` e/ou chaves naturais (domínio, e-mail).

| Método | Rota | Uso |
|---|---|---|
| GET | `/accounts`, `/accounts/{id}` | filtros: `program_id`, `stage`, `tier`, `updated_since`, `min_score` |
| PUT | `/accounts` | upsert por `domain` ou `external_ref` |
| GET/PUT | `/contacts` | upsert por `email` ou `external_ref`; vincula à conta por domínio ou id |
| POST | `/signals` | criar sinal (`type_key`, conta por domínio/id/ref, contato por e-mail opcional, `occurred_at`, `title`, `url`) |
| POST | `/activities` | registrar atividade vinda do CRM (ex.: reunião realizada) |
| GET/PUT | `/opportunities` | upsert por `external_ref`; mudança de status atualiza o estágio da conta |
| GET | `/programs`, `/programs/{id}/accounts` | leitura de estrutura e contas |
| GET | `/tasks` | leitura (ex.: espelhar tarefas no CRM) |

- Documentação **OpenAPI 3** gerada e servida em `/api/v1/docs` (protegida por login).

### 12.2 Webhooks de saída
- Configurados no ADM por workspace: URL, eventos e segredo. Assinatura `X-Cerco-Signature: sha256=<hmac>` com timestamp. O prefixo do header também vem do nome do app em env.
- Retries com backoff exponencial (até 6 tentativas em 24h); log de entregas com reenviar manual.

| Evento | Quando |
|---|---|
| `account.created` / `account.updated` | criação/edição |
| `account.stage_changed` | mudança de estágio (inclui anterior e novo) |
| `account.became_hot` | cruzou o limiar "quente" |
| `contact.created` / `contact.updated` / `contact.opted_out` | — |
| `task.completed` | com resultado |
| `meeting.booked` | resultado `reuniao_agendada` |
| `opportunity.created` / `opportunity.updated` | — |
| `signal.created` | sinal ativo novo (filtrável por tipo) |

### 12.3 Webhooks de entrada (sem chave de API)
- `POST /api/hooks/{token}`: cada `inbound_hook` tem tipo (`signal`, `conversion`, `account`, `contact`, `opportunity`, `activity`) e um **mapeamento JSON** (caminhos do payload → campos). Isso permite apontar formulários (RD Station, Typeform, LP própria, Make) direto para a plataforma.
- Tela de teste no ADM: "último payload recebido" + resultado do mapeamento.

### 12.4 Receitas de setup no Make (documentação entregue junto)
Criar `docs/integracoes/make/` com um guia por CRM (Odoo, Pipedrive, HubSpot), cada um com:
1. **CRM → Cerco: empresas e contatos** (sincronização inicial e incremental) → `PUT /accounts` e `PUT /contacts` com `external_ref`.
2. **CRM → Cerco: negócios** (criado / mudança de etapa / ganho / perdido) → `PUT /opportunities`.
3. **CRM → Cerco: atividades relevantes** (reunião realizada) → `POST /activities` ou `/signals`.
4. **Cerco → CRM: conta virou `conversa` ou `meeting.booked`** → criar/atualizar lead ou negócio no CRM e devolver o id via `PUT /opportunities` com `external_ref`.
5. **Cerco → CRM: `contact.opted_out`** → marcar no CRM.
6. Tabela de mapeamento de campos sugerida para cada CRM e lista de checagem de teste.

Formato: passo a passo em Markdown com módulos do Make e exemplos de payload. Não precisa de blueprint exportado na V1.

### 12.5 Apollo (nativo, opcional)
- Chave por workspace guardada no **Supabase Vault**, configurada no ADM.
- Uso: enriquecimento de organização, busca de pessoas por domínio + cargos, vagas da organização.
- Todas as chamadas são do servidor, com cache de 7 dias por domínio, contagem de chamadas por workspace e tratamento de limites/erros.
- Sem Apollo, as mesmas telas funcionam por importação.

---

## 13. Área ADM (plataforma)

Rota `/admin`, só `platform_admin`. Layout próprio e indicação visual clara de "modo ADM".

- **ADM-1 Clientes:** lista e CRUD.
  - Campos: nome, razão social, CNPJ (validação), status (`design_partner`, `active`, `paused`, `churned`), plano (texto livre na V1), valor de contrato, dia de cobrança, observações de cobrança, contato principal, data de início, notas.
  - Mostra seus workspaces e usuários.
  - *Nenhuma cobrança é executada; os campos existem para a cobrança futura.*
- **ADM-2 Workspaces:** criar sob um cliente; nome, slug, fuso, status, feature flags (ex.: `signal_hunter`, `apollo`, `copilot`), orçamento mensal de IA, configurações (seção 8.1).
  - Botões: "**Entrar no workspace**" (abre o app com banner "você está como ADM") e "Duplicar estrutura de outro workspace" (copia ofertas, programas, comitês, plays e cadências, sem contas).
- **ADM-3 Usuários & acessos:**
  - convidar por e-mail (convite do Supabase Auth) com nome;
  - atribuir 1..n workspaces com papel;
  - desativar/reativar; reenviar convite; marcar/desmarcar `platform_admin` (com confirmação);
  - ver último acesso.
- **ADM-4 Integrações por workspace:**
  - chaves de API (criar, revogar, último uso);
  - webhooks de saída (CRUD, teste, log de entregas);
  - webhooks de entrada (CRUD, token, mapeamento, último payload);
  - Apollo (chave, testar conexão);
  - CRM do cliente (qual sistema, notas do setup no Make, link para o cenário);
  - **checklist de setup** do cliente (itens marcáveis: oferta criada, docs enviados, programa 1 ativo, contas importadas, BDR convidado, snippet instalado, integração CRM testada, primeiro upload de ads).
- **ADM-5 Uso & custos:** por workspace e mês:
  - execuções de IA por agente, tokens, buscas, custo USD vs. orçamento;
  - chamadas Apollo;
  - usuários ativos, tarefas concluídas, contas por programa.
  - Exportar CSV.
- **ADM-6 Auditoria:** busca no `audit_logs` (ator, workspace, ação, entidade, período).
- **ADM-7 Templates globais:**
  - biblioteca de papéis de comitê;
  - templates de cadência;
  - catálogo de sinais e pesos padrão;
  - templates de relatório de ads e de export de audiências;
  - versões ativas dos prompts (leitura).
- **ADM-8 Configurações da plataforma:** modelos de IA padrão, tabela de preços de IA, limites padrão, remetente de e-mail.

Toda ação do ADM gera `audit_logs`.

---

## 14. Requisitos não funcionais

- **Stack:**
  - Next.js (App Router, TypeScript estrito, Server Actions/Route Handlers), Tailwind, shadcn/ui, TanStack Table, React Hook Form + Zod;
  - Supabase (Postgres, Auth, Storage, Vault, `pg_cron`, `pg_trgm`, `pgmq` ou fila equivalente; Edge Functions se necessário);
  - Vercel (deploy + Cron); Resend (e-mails); PostHog (analytics); Sentry (erros).
- **Banco:** migrações versionadas em `supabase/migrations`; seeds em `supabase/seed.sql` e scripts TS; tipos gerados (`supabase gen types`).
- **Jobs:**
  - recalcular score (diário 3h, e por evento);
  - caçador de sinais (semanal);
  - brief (semanal);
  - Apollo vagas (semanal);
  - entrega de webhooks (contínua);
  - processamento de imports e uploads.
  - Todos idempotentes, com lock por workspace e log.
- **Performance:** tabelas paginadas no servidor; até 10 mil contas e 50 mil contatos por workspace sem degradação perceptível; Fila do dia carrega em < 1,5 s com 200 tarefas.
- **Segurança:**
  - RLS em todas as tabelas;
  - service role só no servidor;
  - segredos no Vault;
  - chaves de API com hash;
  - HMAC em webhooks;
  - validação Zod em toda entrada;
  - rate limit nos endpoints públicos;
  - CORS restrito em `/api/t/collect` aos domínios cadastrados no workspace.
- **LGPD:**
  - base legal e origem do dado por contato;
  - `do_not_contact` e opt-out respeitados em tarefas e exports;
  - ação "Excluir dados deste contato" (exclusão definitiva de contato, atividades e eventos web ligados, mantendo só o registro de auditoria sem dados pessoais);
  - export dos dados de um contato (atendimento a titular);
  - texto padrão sugerido para o rodapé de e-mails de prospecção com opção de descadastro (exibido nas instruções dos passos de e-mail);
  - o rastreamento web depende de o cliente ter política de privacidade/aviso de cookies — mostrar checklist na tela de instalação do snippet.
- **Observabilidade:** Sentry; logs estruturados em jobs; tela de status de jobs no ADM.
- **Testes:**
  - Vitest para regras puras (score, estágios, gerador de tarefas, dias úteis, normalização/correspondência de empresas, parsers de relatório, formatadores de export);
  - Playwright para os fluxos E2E da seção 18;
  - testes de RLS (acesso entre workspaces).
- **Acessibilidade:** navegação por teclado, contraste AA, labels nos formulários.
- **i18n:** só pt-BR na V1, mas textos centralizados (ex.: `messages/pt-BR.json`) para facilitar o futuro.

---

## 15. Analytics de produto (para a Validação 01)

PostHog com `workspace_id`, `user_id`, `role` e `program_id` como propriedades.

| Evento | Propriedades |
|---|---|
| `program_wizard_step_completed` | step, duração_s, ai_used |
| `program_activated` | tempo_total_desde_criação_min |
| `ai_suggestion_decided` | agent, decision(accepted/edited/discarded/regenerated) |
| `accounts_imported` | count, source |
| `contacts_added` | count, source |
| `cadence_enrolled` | accounts, tasks_created |
| `task_completed` | channel, outcome, used_personalization, via(fila/conta), segundos_desde_abertura |
| `task_skipped` / `task_snoozed` | reason |
| `queue_opened` | tasks_due |
| `ad_report_committed` | platform, rows, match_rate_auto, review_count |
| `audience_exported` | format, rows |
| `dossier_generated` | depth |
| `signal_suggestions_decided` | accepted, dismissed |
| `brief_viewed` | — |
| `copilot_message_sent` / `copilot_change_applied` | — |

**Painel interno no ADM (ADM-5)** com as métricas da seção 1:
- tempo de ativação de programa;
- % de tarefas concluídas na plataforma;
- taxa de aceite da IA;
- usuários ativos por semana.

---

## 16. Dados de exemplo e templates padrão

### 16.1 Workspace de demonstração (seed)
Um cliente "Demo" com workspace "Demo — Produtora B2B":
- 1 oferta fictícia;
- 1 programa ativo;
- 30 contas fictícias (nomes inventados, domínios `.example`);
- 80 contatos, tarefas em vários estados e sinais variados;
- 1 upload de ads de exemplo.
- **Nunca usar empresas ou pessoas reais no seed.**

### 16.2 Biblioteca de papéis de comitê (global)
`economic` (diretor/VP da área, CEO em empresas menores) · `champion` (gerente da área que sente a dor) · `technical` (TI, engenharia, produto) · `user` (time operacional que usa) · `procurement` (compras, jurídico) · `influencer` (consultores, agência atual) · `blocker` (quem perde com a mudança).

### 16.3 Templates de cadência (globais)
Base: prática atual da Sétima (30–40 dias úteis, BDR com e-mail, telefone, LinkedIn e WhatsApp, ads rodando o tempo todo).

**T1 — "1:1 profunda" (35 dias úteis, por contato do papel):**

| Dia útil | Canal | Passo |
|---|---|---|
| 0 | research (conta) | revisar dossiê e escolher gancho |
| 1 | linkedin_engage | interagir com post recente |
| 2 | linkedin_connect | convite sem pitch |
| 3 | email | e-mail 1 com gancho + dor |
| 5 | call | ligação 1 |
| 8 | linkedin_message | mensagem com prova/case |
| 10 | email | e-mail 2 com lead magnet |
| 13 | whatsapp | mensagem curta com referência ao e-mail |
| 16 | call | ligação 2 |
| 20 | email | e-mail 3 com outro papel do comitê citado (multi-thread) |
| 25 | linkedin_message | conteúdo de valor |
| 30 | call | ligação 3 |
| 35 | email | encerramento ("fecho o assunto?") |

Durante toda a cadência: `ads_touch`.

**T2 — "1:poucos" (25 dias úteis):** 8 passos (connect, e-mail 1, ligação, e-mail 2 com lead magnet, WhatsApp, LinkedIn, ligação, encerramento).

**T3 — "1:muitos" (15 dias úteis):** 5 passos (connect, e-mail 1, e-mail 2 com lead magnet, LinkedIn, encerramento). Ads como principal motor.

### 16.4 Templates de relatório de ads e de export
Conforme seções 11.2 e 11.3, refinados com os arquivos em `/samples/ads/`.

---

## 17. Plano de construção (marcos)

Cada marco termina com: migrações aplicadas, testes passando, deploy de preview na Vercel, **resumo do que foi feito + o que testar manualmente** e pausa para validação do Diego.

| Marco | Conteúdo | Definição de pronto |
|---|---|---|
| **M0 — Fundação** | Repo, Next.js, Supabase, auth por convite, tenancy, RLS base, layout, seletor de workspace, Área ADM (clientes, workspaces, usuários & acessos, auditoria), env de nomes, Sentry, PostHog, seed demo | Diego cria cliente "Sétima" com workspaces Sétima e Brandspot, convida um BDR e o BDR só vê o workspace dele |
| **M1 — Estratégia** | Ofertas + base de conhecimento + `offer_builder`; programas + assistente de 7 passos com todos os agentes de estratégia; registro de `ai_runs`/`ai_suggestions` | Cenário 18.1 até "programa ativo" |
| **M2 — Contas & comitê** | Import genérico (11.1), contas, fit em lote, tiers, contatos, Apollo opcional, `contact_role`, matriz de cobertura, página da conta, dossiê | Importar 100 contas, pontuar, classificar tiers, mapear comitê de 10 contas T1 |
| **M3 — Execução** | Cadências, inscrição, gerador de tarefas em dias úteis, regras automáticas, **Fila do dia** completa, atividades, personalização com IA, oportunidades | Cenário 18.2 |
| **M4 — Sinais & score** | Catálogo de sinais, sinais de tarefa, rastreamento web + links rastreados, conversões, score/estágios/cobertura/penetração, alertas, caçador de sinais, vagas Apollo | Cenário 18.3 com score exato |
| **M5 — Ads** | Uploads de relatório (templates com amostras reais), correspondência + revisão + aliases, idempotência/reverter, frequência, audiências e exports | Cenário 18.4 |
| **M6 — Inteligência & integrações** | Painéis, brief semanal, copiloto, API v1 + OpenAPI, webhooks de saída/entrada, guias do Make (Odoo, Pipedrive, HubSpot), ADM-4/5/7/8, checklist de setup | Cenário 18.5 + painel de uso funcionando |

---

## 18. Cenários de aceite ponta a ponta

### 18.1 Criar um programa novo com IA (manager)
1. Entrar no workspace "Sétima"; criar a oferta "Configurador 3D" a partir de um PDF e da URL do site.
2. Novo programa: "Configurador 3D × Máquinas agrícolas", segmento descrito em texto.
3. Percorrer os 7 passos aceitando e editando sugestões; ativar.
4. **Esperado:** ≥ 5 critérios de fit com pesos que somam 100; ≥ 4 papéis com cargos PT/EN; plays para cada tier × papel obrigatório; ≥ 3 lead magnets; 3 cadências; ≥ 2 audiências planejadas; tudo em < 60 min; eventos de analytics registrados.

### 18.2 Execução pelo BDR
1. Importar 40 contas (CSV) e 120 contatos; rodar fit e aceitar os tiers sugeridos; classificar papéis.
2. Inscrever as contas T1 na cadência T1.
3. Logar como BDR: Fila do dia mostra as tarefas de hoje agrupadas por canal.
4. Concluir 10 tarefas, sendo 1 com `reuniao_agendada`, 1 com `opt_out` e 1 com `email_invalido`.
5. **Esperado:**
   - inscrição do contato com reunião pausada + tarefa "Próximo passo";
   - contato com opt-out marcado `do_not_contact` e sem tarefas futuras;
   - tarefa "corrigir contato" criada;
   - conta com reunião em `conversa`;
   - webhook `meeting.booked` disparado (se configurado).

### 18.3 Score determinístico
Conta com fit 80; contato com papel `champion` com `email_reply_positive` há 0 dias; contato `economic` com `site_visit_high_intent` há 14 dias; sinal `leadership_change` há 0 dias.
- Fit = 32.
- E_raw = 18 + 8 × 0,5 = 22; 2 papéis → × 1,15 = 25,3.
- Timing = 10.
- **Total = 67,3** (morna); estágio `conversa` (resposta positiva).
- Teste unitário deve reproduzir exatamente.

### 18.4 Upload de ads
1. Subir um relatório LinkedIn por empresa (amostra real) de 1 semana.
2. **Esperado:** template detectado; período extraído; ≥ 85% de correspondência automática nas contas do programa; fila de revisão com o restante; criar 2 aliases; confirmar.
   - `ad_metrics` e sinais criados; contas `alvo` com impressão → `aquecendo`; painel de frequência atualizado.
3. Reenviar o mesmo arquivo → aviso; reverter → métricas e sinais removidos.

### 18.5 Integração via Make (CRM)
1. Criar chave de API e webhook de saída no ADM.
2. Com um cenário do Make (Pipedrive), criar um negócio para uma conta.
3. **Esperado:** `PUT /opportunities` com `external_ref` cria a oportunidade e move a conta para `oportunidade`; marcar como ganho no CRM move para `ganha`; a entrega de webhook aparece no log.

---

## 19. Itens em aberto (não bloqueiam a V1)
1. Nome final do produto e da metodologia (trocar só as variáveis de ambiente).
2. Arquivos reais de exemplo de ads em `/samples/ads/` (o Diego fornece antes do M5).
3. Lista final de feriados e dias úteis (padrão: nacionais; o workspace edita).
4. Domínio e remetente de e-mail transacional.
5. Política de retenção de `web_events` (sugestão: 13 meses).
6. Modelo de cobrança (fica no ADM para a V2).
