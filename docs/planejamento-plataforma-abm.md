# Planejamento — Plataforma de ABM com IA para vendas complexas B2B

> **Status:** planejamento v0.1 (pré-PRD) · **Data:** 21/out/2026 · **Autor:** Diego Rodrigues (Vivaz)
> **Codinome provisório:** *Projeto Comitê* (nome final em aberto — ver seção 13)
> **Objetivo deste documento:** consolidar tese, mercado, posicionamento, escopo da V1, stack e plano de validação. O PRD para o Claude Code sai deste documento.

---

## 1. Resumo executivo

**O que é:** um SaaS que transforma a metodologia de ABM que já roda na Sétima e na Brandspot (e que foi desenhada para a BlueMetrics) em produto. A plataforma ajuda a **pensar** (ICP, contas, tiers, comitê, oferta, lead magnet) e a **executar** (cadência multicanal, ads sobre o comitê, sinais, score e ritual semanal), com IA no centro das decisões — não só redigindo texto.

**Para quem:** empresas brasileiras que vendem serviços ou produtos B2B complexos — ticket médio/alto, comitê de decisão, ciclo longo — e que têm time comercial e de marketing enxutos, sem RevOps. Consultorias de tecnologia e dados, produtoras e content-tech, engenharia, software house, indústria com venda técnica. E agências que operam ABM para clientes.

**Por que agora:**
- As plataformas de ABM consolidadas (6sense, Demandbase, Terminus) são caras, longas de implantar e desenhadas para enterprise americano.
- A nova geração "AI-native" e de sinais (Abmatic, Common Room, Unify, Warmly, Factors) começa em dezenas de milhares de dólares por ano, é em inglês, não fala WhatsApp e tem cobertura de dados fraca para o mid-market brasileiro.
- No Brasil, o mercado está fragmentado: dados (Speedio, Econodata), cadência (Meetime, Reev, Ramper) e gestão de ABM com consultoria (Maestro ABM). Ninguém entrega **metodologia + execução + IA estrategista** num produto para quem não tem time de RevOps.

**Tese de diferenciação (uma frase):** *"ABM em caixa para vendas complexas no Brasil: a IA monta a estratégia, a plataforma cerca o comitê com ads e cadência, e os sinais dizem quando atacar."*

**Validação 01:** usabilidade, com dois usuários reais desde o dia 1 — Sétima e Brandspot — expandindo para novos segmentos **dentro** da ferramenta, sem parar a operação atual.

---

## 2. Problema

### 2.1 A dor do ICP
1. **Escolher contas é chute.** Times pequenos não sabem quais empresas têm o problema de fato, nem quais já resolveram (dor real vista na BlueMetrics).
2. **O comitê não é mapeado.** O vendedor fala com uma pessoa; a decisão é de 3 a 7. Ninguém mede quantos papéis do comitê foram atingidos.
3. **Oferta genérica.** A mesma mensagem vai para o diretor financeiro e para o gerente de marketing. Falta oferta/dor/prova por papel.
4. **Mídia paga desconectada do outbound.** Ads rodam como campanha de leads (e dão lead ruim — caso Brandspot com lead nativo do Meta), em vez de aquecer o comitê das contas-alvo antes e durante a cadência.
5. **Sinais espalhados.** Visita no site, vaga aberta, troca de diretor, resposta de e-mail, engajamento no anúncio — tudo em ferramentas diferentes ou em lugar nenhum.
6. **Execução depende de uma pessoa sênior.** A metodologia vive na cabeça de quem montou (hoje, o Diego). Não escala para 3 segmentos, 3 BDRs ou 10 clientes.

### 2.2 O que o mercado oferece hoje (e por que não resolve)
| Opção | Por que não serve para o ICP |
|---|---|
| ABM enterprise (6sense, Demandbase) | Preço de cinco a seis dígitos em dólar/ano, implantação de meses, exige gestor de ABM dedicado |
| Plataformas de sinais/warm outbound (Common Room, Unify, Warmly) | Começam em ~US$ 10–30 mil/ano, foco SaaS americano/PLG, sem WhatsApp, dados de BR fracos |
| Clay + Apollo + planilha | Poderoso, mas exige GTM engineer; vira "frankenstack" |
| CRM com ABM nativo (HubSpot Target Accounts + Breeze) | Bom para quem já é HubSpot Pro/Enterprise; a metodologia não vem junto |
| Ferramentas BR de cadência/dados (Meetime, Reev, Ramper, Speedio) | Resolvem um pedaço (contato ou cadência), não a estratégia por conta e comitê |
| Maestro ABM (BR) | Concorrente mais direto; forte em gestão de plays e consultoria, preço sob consulta, implantação ainda de semanas |

---

## 3. Público-alvo (ICP do produto)

### 3.1 ICP primário — "Vendedor complexo enxuto"
- **Modelo de venda:** B2B, serviço ou produto complexo/customizado.
- **Ticket:** a partir de ~R$ 30 mil por contrato (ideal R$ 50 mil a R$ 1 milhão+), ou recorrência relevante.
- **Comitê:** 3 a 7 papéis (econômico, técnico, usuário, campeão, compras/jurídico).
- **Ciclo:** 2 a 12 meses.
- **Tamanho:** 10 a 300 funcionários; 1 a 10 vendedores; 0 a 3 SDR/BDR; marketing de 1 a 4 pessoas; sem RevOps.
- **Universo de contas-alvo:** dezenas a poucas centenas (não milhares).
- **Segmentos de entrada:** consultorias de dados/IA e tecnologia, software house e integradores, produtoras/audiovisual e content-tech, engenharia e projetos, indústria com venda técnica, agências B2B.

### 3.2 ICP secundário — Agências e consultorias de growth/ABM
- Operam ABM para vários clientes (a própria Vivaz é o caso zero).
- Precisam de multi-workspace, white-label leve e relatório para o cliente.
- Canal de distribuição: cada agência traz N clientes.

### 3.3 Personas dentro da conta-cliente
| Persona | Job-to-be-done | O que precisa ver |
|---|---|---|
| Head de marketing / growth | Montar a estratégia e provar pipeline | Tiers, plays, cobertura do comitê, contas aquecidas, ads |
| Head comercial / founder | Saber onde atacar esta semana | Contas quentes, próximos passos, reuniões |
| SDR/BDR | Executar a cadência sem pensar no "o quê" | Fila do dia, mensagem pronta por papel, contexto da conta |
| Agência (operador) | Rodar ABM de vários clientes | Workspaces, templates de metodologia, relatório |

### 3.4 Anti-ICP (não atender na V1)
- Venda transacional / alto volume de leads.
- PLG com self-serve (o mercado americano já atende bem).
- Enterprise com 6sense/Demandbase e time de ABM dedicado.

---

## 4. A metodologia (o "motor" do produto)

O produto é **opinativo**: ele conduz o usuário por uma sequência. Isso é o que diferencia de um CRM genérico. Proposta de estrutura em 8 etapas (nome da metodologia em aberto):

| # | Etapa | O que sai | Papel da IA |
|---|---|---|---|
| 1 | **Tese & oferta** | Produto/solução, dor central, provas (cases), oferta-âncora e de expansão | Entrevista guiada; transforma site/cases/propostas em tese |
| 2 | **ICP & seleção de contas** | Critérios de fit, lista de contas (importada, Apollo ou CRM) | Sugere critérios, pontua fit, explica por que a conta entrou |
| 3 | **Tiering** | T1 (1:1, ~10–20 contas), T2 (1:poucos, ~30–60), T3 (1:muitos, ~100–300) | Sugere tier por fit + potencial + sinais; dossiê completo para T1 |
| 4 | **Comitê por cargo** | Modelo de comitê da oferta (papéis × cargos típicos) e mapeamento por conta | Sugere papéis e cargos por segmento; busca pessoas; mostra lacunas |
| 5 | **Oferta por papel** | Dor, mensagem, prova, CTA e lead magnet por papel e tier | Gera variações; sugere lead magnets (calculadora de ROI, diagnóstico, demo espelho, benchmark) |
| 6 | **Ads como topo de funil** | Audiências por tier/segmento/papel, briefing de criativo, meta de frequência | Briefing por papel; recomenda formato e frequência |
| 7 | **Cadência multicanal** | Sequência de toques (e-mail, LinkedIn, telefone, WhatsApp, toque de ads), gatilhos por sinal | Monta a cadência, escreve cada passo por papel, ajusta por sinal |
| 8 | **Sinais, score & ritual** | Score de conta, cobertura do comitê, estágio da conta, ritual semanal (PDCA) | Caça sinais, explica o score, gera o "brief da semana" e próximos passos |

**Estágios da conta (account journey) — proposta:**
`Alvo → Aquecendo (impressão/visita) → Engajada (2+ pessoas do comitê interagindo) → Conversa (resposta/reunião) → Oportunidade → Ganha / Perdida / Nutrir`

**Métricas-norte da metodologia:**
- **Cobertura do comitê** = papéis mapeados / papéis exigidos pela oferta.
- **Penetração do comitê** = papéis com engajamento real / papéis exigidos.
- **Frequência sobre o comitê** (impressões por pessoa/conta por semana) — aprendizado da BlueMetrics: frequência é a métrica-chave de topo.
- **Contas com reunião** e **SQLs/oportunidades por tier**.

> Ponto de atenção da prática: no LinkedIn, segmentação por lista de empresas só roda com no mínimo 300 membros correspondidos, e a recomendação é lista de 1.000+ empresas. Ou seja, **T1 sozinho é pequeno demais para uma audiência** — a plataforma deve agrupar audiências por segmento/tier, combinar com listas de contatos e/ou Meta. Isso precisa estar embutido na lógica de audiências.

---

## 5. Panorama competitivo

### 5.1 Mapa por categoria

**A. ABM enterprise**
- **6sense, Demandbase, Terminus, RollWorks.** Preço não publicado; relatos de mercado vão de cinco dígitos altos a seis dígitos em dólar/ano, implantação de 8 a 16 semanas com consultoria de US$ 15–50 mil. Fortes em intenção de terceiros, atribuição e ads programáticos. *Fora do alcance do ICP.*

**B. ABM "AI-native" mid-market**
- **Abmatic AI.** Se posiciona como "uma plataforma que substitui nove ferramentas" (identificação de visitante, intenção, personalização web, outbound agêntico, ads). Preço anunciado a partir de US$ 36 mil/ano. *Obs.: boa parte dos comparativos de preço do mercado é publicada pelo próprio Abmatic — tratar como fonte enviesada.*

**C. Plataformas de sinais / warm outbound**
- **Common Room** — agrega sinais de 50+ fontes em perfil por pessoa; plano Essential ~US$ 2.100–2.500/mês (anual), 5 assentos. Tem agente que "caça" sinais por prompt. Crítica recorrente: mostra sinais, mas não diz o que fazer.
- **Unify GTM** — "warm outbound": sinal + persona + mensagem que referencia o sinal. Growth a US$ 1.740/mês (anual), 1 usuário, caixas de e-mail gerenciadas, créditos.
- **Warmly** — desanonimização de visitante a partir de US$ 10 mil/ano; agente de TAM a US$ 15 mil/ano; inbound autopilot a US$ 30 mil/ano.
- **Factors.ai** — inteligência de contas e atribuição, forte em LinkedIn; plano free, add-on LinkedIn AdPilot de US$ 1.000/mês (controle de frequência por conta, que o Campaign Manager não tem nativamente).

**D. ABM focado em ads**
- **Metadata.io** — automação de mídia paga B2B; a partir de US$ 3.950/mês e recomenda US$ 20 mil+/mês de mídia.
- **Fibbler** (~US$ 89–159/mês) e **ZenABM** (a partir de US$ 59/mês) — ABM e atribuição em cima de LinkedIn Ads, baratos e enxutos.

**E. Dados & orquestração (camada de construção)**
- **Clay** — Launch US$ 185/mês, Growth US$ 495/mês (sync com CRM só no Growth); créditos por ação; exige GTM engineer.
- **Apollo** — US$ 49 / 79 / 119 por usuário/mês (anual); dados + sequências; intenção e API avançada só no plano Organization.

**F. CRM com ABM nativo**
- **HubSpot** — propriedades Target Account e Buying Role, painel de contas-alvo com visões como "faltam stakeholders-chave", e agentes Breeze para prospecção. Ameaça real para clientes já em HubSpot pago.

**G. Brasil**
- **Maestro ABM (SP)** — se posiciona como a primeira plataforma de orquestração de ABM do Brasil: contas-alvo, campanhas com indicadores, "plays", classificação de contatos e identificação de decisores. Usa IA generativa (Amazon Bedrock) para gerar posts de LinkedIn; reduziu implantação de 4 meses para 6 semanas. Avaliações destacam a metodologia e a consultoria; pedem mais integrações e interface mais intuitiva. Preço sob consulta. **Concorrente mais direto.**
- **Harpoon (Bowe)** — aparece na categoria ABM a partir de R$ 2.900/mês.
- **Speedio** (base de 20M+ empresas, a partir de R$ 1.149/mês), **Econodata**, **Data Stone** — dados e listas.
- **Meetime Flow, Reev, Ramper** — cadência/sales engagement; Reev cobre e-mail, telefone, WhatsApp e LinkedIn.

### 5.2 Onde fica o espaço em branco
| Critério | Enterprise | Sinais (EUA) | Clay/Apollo | HubSpot | Maestro | **Nós** |
|---|---|---|---|---|---|---|
| Metodologia embutida (passo a passo) | Parcial | Não | Não | Não | **Sim** | **Sim** |
| IA como estrategista (oferta, comitê, lead magnet) | Parcial | Parcial | Não | Parcial | Parcial | **Sim, núcleo** |
| Ads sobre o comitê como topo de funil | Sim | Não | Não | Parcial | ? | **Sim** |
| Cadência multicanal com WhatsApp | Não | Não | Parcial | Não | ? | **Sim** |
| Cobertura/penetração do comitê como métrica | Sim | Parcial | Não | Parcial | Parcial | **Sim, central** |
| Funciona sozinho ou plugado ao CRM | Plugado | Plugado | Plugado | É o CRM | Sozinho | **Ambos** |
| PT-BR, preço em real, CRMs BR | Não | Não | Não | Sim | Sim | **Sim** |
| Sem RevOps / setup em dias | Não | Não | Não | Médio | Semanas | **Meta: 1 dia** |

---

## 6. Posicionamento

**Categoria:** Plataforma de ABM com IA para vendas complexas (não "CRM", não "ferramenta de prospecção").

**Declaração de posicionamento:**
> Para empresas B2B brasileiras que vendem soluções complexas para comitês de decisão e não têm time de RevOps, **[Nome]** é a plataforma de ABM com IA que monta a estratégia por conta e cerca o comitê com ads, cadência e sinais — sem precisar de uma stack de 9 ferramentas nem de 4 meses de implantação. Diferente das plataformas americanas, fala português, WhatsApp e preço em real; diferente de CRMs e ferramentas de cadência, traz a metodologia pronta.

**Três mensagens-pilar:**
1. **Estratégia pronta em um dia** — a IA entrevista você e entrega ICP, tiers, comitê, ofertas e lead magnets.
2. **Cerque o comitê, não o lead** — ads com frequência sobre os decisores + cadência por papel + cobertura do comitê como métrica.
3. **Saiba quando atacar** — sinais e score explicáveis transformam-se em fila de próximos passos.

**Prova de origem (narrativa):** "Construída dentro de operações reais de ABM em audiovisual/content-tech e consultoria de dados" — cases Sétima/Brandspot como prova.

---

## 7. Escopo da V1 (MVP para Claude Code)

### 7.1 Princípios da V1
1. **Cockpit + cérebro, não executor de tudo.** A plataforma decide, gera e acompanha; a execução pesada (envio em massa, compra de mídia) continua nas ferramentas que já existem (Apollo, Campaign Manager, Meta, WhatsApp). Reduz risco técnico e de entregabilidade.
2. **Operar 100% dentro OU plugado ao CRM.** Mini-CRM próprio (contas, contatos, oportunidades simples) + sync com o CRM do cliente.
3. **Tudo explicável.** Score, tier e sugestões da IA sempre mostram "por quê" (crítica recorrente de mercado: score caixa-preta).
4. **Dogfooding primeiro.** Só entra na V1 o que Sétima e Brandspot vão usar nos próximos 60 dias.
5. **Multi-workspace desde o dia 1** (Vivaz opera os dois como agência).

### 7.2 Módulos e priorização (MoSCoW)

| Módulo | Must (V1) | Should (V1.5) | Could (V2+) |
|---|---|---|---|
| **1. Workspace & tese** | Onboarding guiado por IA: oferta, dores, provas, cases (upload de PDF/URL); base de conhecimento por workspace | Vários produtos/ofertas por workspace | Templates de metodologia por segmento |
| **2. Contas** | Import CSV / Apollo / CRM; enriquecimento via Apollo; score de fit com explicação; tiering T1/T2/T3; segmentos | Sugestão de lookalikes | Descoberta de contas por IA a partir de tese |
| **3. Comitê** | Modelo de comitê por oferta (papéis × cargos); busca de pessoas via Apollo; matriz conta × papel com lacunas; cobertura % | Sugestão de papéis por segmento aprendida dos ganhos | Organograma inferido |
| **4. Plays & ofertas** | Play = tier + segmento + papel → dor, mensagem, prova, CTA, lead magnet; IA gera e o usuário edita | Biblioteca de lead magnets com status | Geração do lead magnet (LP/calculadora) |
| **5. Dossiê de conta** | Dossiê de guerrilha gerado por IA (web + Apollo) para T1, resumo para T2 | Atualização automática mensal | Export .docx/PDF |
| **6. Cadências** | Builder multicanal (e-mail, LinkedIn, ligação, WhatsApp, "toque de ads"); passos viram **tarefas**; copy por papel; fila do dia do BDR com copiar/abrir LinkedIn/abrir `wa.me` | Envio de e-mail pelo Gmail/Workspace do usuário; push para sequência do Apollo | Pausa/reação automática por sinal |
| **7. Ads (topo de funil)** | Construtor de audiências por segmento/tier/papel; export CSV no formato do LinkedIn (empresas e contatos); sync de público personalizado no Meta; briefing de criativo por papel; meta de frequência | Import de relatório de impressões por empresa (CSV do Campaign Manager) | Sync via API do LinkedIn (Matched Audiences) e leitura de engajamento por empresa |
| **8. Sinais** | Feed por conta; fontes: visitas no site (script + links rastreados por conta/contato), conversões em LP/lead magnet, respostas/reuniões registradas, vagas e headcount (Apollo), **agente "caçador de sinais"** semanal (notícias, contratações, expansão, troca de liderança), registro manual | Webhooks de formulário/CRM; mudança de cargo de contatos | Intenção de terceiros |
| **9. Score & estágios** | Score de conta = Fit + Engajamento (com peso para nº de papéis) + Timing/sinais, com decaimento; estágios da conta; limiares → alerta + tarefa | Pesos ajustáveis por workspace | Modelo treinado em ganhos/perdas |
| **10. Ritual & painel** | Brief semanal da IA ("o que mudou nas contas e o que fazer"); painel: contas por estágio e tier, cobertura do comitê, reuniões, oportunidades | Relatório para cliente (modo agência) | Atribuição multi-toque |
| **11. Integrações** | Apollo; Meta Ads; CRM: **Odoo primeiro** (onde a Sétima já roda o ABM), via API ou Make; webhooks de saída | HubSpot, Pipedrive, RD Station CRM | Slack, Google Calendar, Notion |
| **12. Copiloto (chat)** | Chat com contexto do workspace e da conta ("qual lead magnet para o CFO de máquinas agrícolas?", "monte a cadência T2 de educação") | Ações via chat (criar play, mover tier) | Agente autônomo com aprovação humana |

### 7.3 Fora da V1 (explicitamente)
- Envio de e-mail em massa com infraestrutura própria de domínios/caixas.
- Compra/gestão de mídia dentro da plataforma.
- Desanonimização de visitante (IP → empresa) por provedor terceiro.
- Discador/gravação de chamadas.
- WhatsApp API oficial com disparo ativo (usar link `wa.me` + registro manual na V1).

### 7.4 Modelo de dados (rascunho para o PRD)
`workspace` · `user` · `offer` (tese, dores, provas) · `knowledge_doc` (embeddings) · `segment` · `account` (fit, tier, estágio, score) · `committee_template` (papéis × cargos por oferta) · `contact` (papel no comitê) · `play` (tier × segmento × papel) · `lead_magnet` · `cadence` · `cadence_step` · `task` · `touch/activity` · `signal` (fonte, tipo, peso, data, conta/contato) · `score_snapshot` · `audience` (plataforma, critérios, membros, export) · `opportunity` · `integration` · `ai_run` (log de custo/tokens por workspace)

### 7.5 Lógica de score (proposta inicial, explicável)
- **Fit (0–40):** segmento, porte, faturamento/investimento (ex.: critério da Sétima de investir mais de R$ 100 mil/mês em marketing), maturidade, aderência à tese.
- **Engajamento (0–40):** visitas, conversões, respostas, reuniões — **multiplicado pelo nº de papéis do comitê engajados** (1 papel = baixo; 3+ papéis = alto).
- **Timing (0–20):** sinais recentes (vagas, troca de liderança, expansão, notícia), com meia-vida de 30–60 dias.
- **Saída:** número + "3 motivos" em linguagem natural + próximo passo sugerido.

---

## 8. Tecnologia

### 8.1 Stack V1 (o mais dentro do que o Diego já opera)
| Camada | Escolha | Por quê |
|---|---|---|
| App | **Next.js (App Router) + Vercel** | Stack já usada (Sétima, Outra Vez); deploy contínuo pelo GitHub |
| Banco/Auth | **Supabase** (Postgres + RLS por `workspace_id`, Auth, Storage) | Multi-tenant simples; já usado em produção |
| Vetores | **pgvector no Supabase** | Base de conhecimento por workspace (cases, propostas, materiais) |
| Jobs/agendamento | Supabase Edge Functions + pg_cron (ou Vercel Cron) + fila (pgmq) | Caçador de sinais semanal, recálculo de score, enriquecimento |
| IA | **Claude API** com tool use (busca web, Apollo, banco) | Agentes: estrategista, dossiê, comitê, cadência, sinais, brief |
| Dados B2B | **Apollo API** | Enriquecimento, busca de pessoas, vagas; já em uso nas contas |
| Ads | **Meta Marketing API** (públicos personalizados) + **export CSV LinkedIn** | Meta tem acesso mais simples; LinkedIn por API depende de aprovação |
| CRM | **Odoo** (API) primeiro; Make.com como cola para a cauda longa | Sétima já centraliza o ABM no Odoo integrado via Claude Code |
| Tracking web | Script JS próprio + links com parâmetro por conta/contato; sGTM opcional | Diego já opera sGTM e eventos de MQL |
| E-mail transacional | Resend (ou equivalente) | Notificações e brief semanal |
| Analytics de produto | PostHog (ou equivalente) | **A validação 01 é de usabilidade** — precisa medir uso real |
| Construção | **Claude Code** + GitHub | Padrão "vibe coding" com PRD |

### 8.2 Arquitetura de IA (agentes da V1)
1. **Estrategista** — entrevista de onboarding → tese, ICP, critérios de fit, modelo de comitê, ofertas por papel, ideias de lead magnet.
2. **Pesquisador de conta** — dossiê de guerrilha (reaproveitar a skill "Dossiê de Guerrilha" como prompt-base).
3. **Mapeador de comitê** — cargos-alvo por papel → busca no Apollo → classificação de cada pessoa em papel.
4. **Redator de cadência** — passos e copy por papel/tier/canal, referenciando sinais quando houver.
5. **Caçador de sinais** — roda semanalmente por conta T1/T2; registra sinais com fonte e data.
6. **Analista semanal** — brief "o que mudou / o que fazer", explicação de score.
- **Guardrails:** tudo que a IA gera é rascunho até aprovação humana; log de custo por workspace (`ai_run`) para calcular margem.

### 8.3 Riscos técnicos
- **API do LinkedIn:** a API de Advertising é pré-requisito para pedir Matched Audiences. As versões da documentação divergem (uma diz que está aberta a desenvolvedores aprovados, outra exige critérios adicionais e fala em até 60 dias de resposta) — tratar como incerto. → V1 com export CSV; pedir acesso já na semana 1.
- **Cobertura do Apollo no mid-market brasileiro:** hipótese de que é irregular (validar no piloto); prever import manual e outras fontes BR (Speedio/Econodata) como integração futura.
- **WhatsApp:** disparo ativo via API oficial tem regras de opt-in; V1 só com link e registro manual.
- **Custo de IA:** dossiês e caçador de sinais por conta podem pesar; medir custo por conta/mês no piloto.

---

## 9. Preço (hipóteses para validar)

### 9.1 Referências de mercado
| Produto | Referência de preço |
|---|---|
| 6sense / Demandbase | Sob consulta; relatos de cinco a seis dígitos (US$)/ano + implantação |
| Abmatic AI | A partir de US$ 36 mil/ano (fonte do próprio fornecedor) |
| Common Room | ~US$ 2.100–2.500/mês, anual |
| Unify | US$ 1.740/mês, anual |
| Warmly | US$ 10 mil/ano (só desanonimização) a US$ 30 mil/ano |
| Factors.ai | Free; LinkedIn AdPilot +US$ 1.000/mês |
| Metadata.io | A partir de US$ 3.950/mês |
| Clay | US$ 185 – 495/mês + créditos |
| Apollo | US$ 49 – 119/usuário/mês |
| Harpoon (BR) | A partir de R$ 2.900/mês |
| Speedio (BR) | A partir de R$ 1.149/mês |
| Maestro ABM (BR) | Sob consulta |

### 9.2 Modelo proposto
- **Cobrança por workspace e volume de contas-alvo ativas** (não por assento — o mercado está migrando para uso/volume), com franquia de créditos de IA.
- **Implantação assistida opcional** (metodologia aplicada pela Vivaz) — monetiza o know-how e acelera ativação.

| Plano | Contas-alvo ativas | Usuários | IA | Preço-hipótese |
|---|---|---|---|---|
| **Starter** | até 50 | 3 | Estrategista, dossiê resumido, cadências | R$ 1.490/mês |
| **Growth** | até 200 | 8 | + caçador de sinais semanal, dossiê completo T1, sync CRM | R$ 3.490/mês |
| **Scale** | até 600 | ilimitado | + multi-oferta, API, pesos de score customizados | a partir de R$ 6.900/mês |
| **Agência** | por workspace de cliente | — | tudo do Growth + relatório para cliente | R$ 1.990/workspace/mês (mín. 3) |
| **Implantação assistida** | — | — | Workshop de tese, ICP, comitê, plays e 1ª cadência | R$ 6 – 15 mil (único) |

- **Founding customers (design partners):** 50% de desconto por 12 meses em troca de uso semanal, feedback e case.
- **Meta de margem bruta:** ≥ 70% depois de IA + Apollo + infra (validar com o log de custo).
- Âncora de valor para o ICP: um único contrato ganho (R$ 50 mil+) paga 1–3 anos de plataforma.

### 9.3 Cenários de receita (12 meses após lançamento externo — hipótese)
| Cenário | Clientes pagantes | Ticket médio | MRR |
|---|---|---|---|
| Conservador | 10 | R$ 2.500 | R$ 25 mil |
| Base | 25 | R$ 2.500 | R$ 62,5 mil |
| Otimista | 50 | R$ 2.800 | R$ 140 mil |

---

## 10. Plano de validação

### 10.1 Validação 01 — Usabilidade (dogfooding Sétima + Brandspot)
**Regra:** a operação atual continua como está; a **expansão para novos segmentos** acontece dentro da ferramenta.
- **Sétima:** hoje foca montadoras; expandir para **máquinas agrícolas** e **educação** (segmentos já mapeados) dentro da plataforma.
- **Brandspot:** definir 1–2 segmentos novos e rodar o ciclo completo dentro da plataforma.

**Perguntas que a validação precisa responder:**
1. Um segmento novo sai do zero para "pronto para executar" (tese → contas → tiers → comitê → plays → cadência → audiência) em **≤ 1 dia de trabalho**?
2. O BDR executa a fila do dia **dentro da plataforma** sem voltar para planilha?
3. O brief semanal muda alguma decisão na reunião semanal com o cliente?
4. Os sinais e o score batem com a percepção do time (as contas "quentes" são mesmo as quentes)?
5. As pessoas novas da Sétima (comercial, marketing, design, planejamento) conseguem usar sem o Diego do lado?

**Métricas de usabilidade:**
| Métrica | Meta piloto |
|---|---|
| Tempo para montar um segmento novo completo | ≤ 1 dia |
| Usuários ativos semanais por workspace | ≥ 3 |
| % das tarefas de cadência concluídas na plataforma | ≥ 70% |
| % de sugestões da IA aceitas (com ou sem edição) | ≥ 50% |
| Contas T1/T2 com cobertura de comitê ≥ 60% | ≥ 70% das contas |
| NPS / "ficaria chateado se tirassem" (Sean Ellis) | ≥ 40% "muito chateado" |

**Métricas de resultado (secundárias nesta fase):** contas engajadas, reuniões, SQLs/oportunidades por tier nos segmentos novos.

### 10.2 Validação 02 — Design partners externos
- 3 a 5 empresas do ICP (consultorias de tecnologia, produtoras, engenharia), pagando preço founding.
- Origem: rede do Diego, fluxo de prospecção de produtoras no LinkedIn, ex-contexto BlueMetrics/consultorias de dados, agências parceiras.
- **Usar a própria plataforma para vender a plataforma** (ABM de ABM) — o melhor case possível.

### 10.3 Critérios de continuar / pivotar
- **Continuar:** metas de usabilidade batidas em 2 ciclos e ≥ 3 design partners pagando.
- **Pivotar para "serviço + ferramenta interna da Vivaz":** se o uso depender sempre do Diego operando (sinal de que o valor está na consultoria, não no software).
- **Pivotar para nicho vertical:** se só um segmento (ex.: audiovisual/content-tech) tiver tração.

---

## 11. Roadmap (ciclos de 30 dias)

| Fase | Período | Entregas | Validação |
|---|---|---|---|
| **Sprint 0** | Semana 1 | PRD, modelo de dados, design system básico, pedido de acesso à API do LinkedIn, contas Apollo/Meta/Odoo de teste | PRD aprovado |
| **Ciclo 1 — Pensar** | Dias 1–30 | Workspaces, onboarding estrategista, contas + fit + tiers, comitê + Apollo, plays, dossiê, cadência como tarefas, fila do BDR, copiloto | Sétima monta "máquinas agrícolas" inteiro na plataforma |
| **Ciclo 2 — Executar e medir** | Dias 31–60 | Sinais (tracking + Apollo + caçador IA), score e estágios, audiências (CSV LinkedIn + sync Meta), sync Odoo, brief semanal, painel | Brandspot entra com segmento novo; métricas de usabilidade coletadas |
| **Ciclo 3 — Abrir** | Dias 61–90 | Correções de usabilidade, HubSpot/Pipedrive, modo agência, cobrança, onboarding self-serve | 3–5 design partners externos |
| **V2** | Mês 4+ | API LinkedIn, envio de e-mail próprio, reação automática a sinais, lookalikes, geração de lead magnet | Lançamento comercial |

---

## 12. Go-to-market (rascunho)
- **Founder-led + conteúdo:** Diego como rosto da metodologia (canal "IA para Negócios", LinkedIn), playbook público "ABM para vendas complexas no Brasil".
- **ABM próprio:** a lista de contas-alvo da plataforma roda dentro da plataforma.
- **Canal agências:** Vivaz como agência-modelo; programa para outras agências B2B (plano Agência).
- **Cases:** Sétima e Brandspot (com autorização), com métricas de cobertura de comitê e reuniões.
- **Oferta de entrada:** implantação assistida + 3 meses de plataforma — reduz o risco percebido.

---

## 13. Nome (em aberto)
Critérios: curto, PT-BR friendly, remete a cercar/comitê/alvo, domínio disponível, sem colidir com "Maestro".
Ideias para avaliar: **Cerco**, **Comitê**, **Mira**, **Malha**, **Contato Certo**, **Arco**. (Checar domínio e INPI antes.)

---

## 14. Riscos e mitigação
| Risco | Impacto | Mitigação |
|---|---|---|
| Valor estar na consultoria do Diego, não no software | Alto | Medir uso sem o Diego; onboarding por IA; implantação assistida como produto separado |
| Acesso à API do LinkedIn negado/demorado | Médio | CSV na V1; Meta como segundo canal de topo; pedir acesso já |
| Dados fracos para BR (Apollo) | Médio | Import manual, enriquecimento por IA (site, LinkedIn público, notícias), integrar fonte BR depois |
| HubSpot/Maestro avançarem em IA | Médio | Foco em metodologia + ads sobre comitê + WhatsApp + preço; nicho de vendas complexas sem RevOps |
| LGPD em prospecção | Médio | Base de legítimo interesse documentada, opt-out em todo toque, registro de origem do dado, direito de oposição atendido |
| Custo de IA corroer margem | Médio | Log de custo por workspace; franquia de créditos por plano; cache de dossiês |
| Tempo do Diego dividido com clientes da Vivaz | Alto | Escopo V1 enxuto; dogfooding = trabalho que já seria feito para Sétima/Brandspot |

---

## 15. Perguntas em aberto (responder antes do PRD)
1. A V1 terá envio de e-mail direto (Gmail do usuário) ou só tarefas + push para Apollo?
2. Odoo é a única integração de CRM da V1, ou Pipedrive também (histórico de funil da Sétima/Brandspot)?
3. Quais são os 1–2 segmentos novos da Brandspot para o piloto?
4. Quem da Sétima será o usuário principal no piloto (o BDR, marketing, planejamento)?
5. A metodologia terá nome próprio separado do produto (ex.: "Método X")?
6. Quais ferramentas adicionais você quer manter dentro da V1 além de Apollo, Meta, Odoo, Make, Supabase, Vercel e Claude?
7. Haverá cobrança já no piloto com Sétima/Brandspot ou só a partir dos design partners externos?

---

## 16. Próximo passo: o que o PRD precisa conter
- Histórias de usuário por persona (marketing, comercial, BDR, agência) para os módulos "Must".
- Esquema do banco (tabelas, relações, RLS) a partir do modelo da seção 7.4.
- Especificação de cada agente de IA: entrada, ferramentas, saída, formato, guardrails.
- Fórmula de score detalhada e eventos de sinal.
- Telas da V1 (onboarding, contas, conta/comitê, plays, cadência/fila, audiências, painel/brief).
- Contratos de integração (Apollo, Meta, Odoo, webhooks).
- Critérios de aceite e eventos de analytics de produto (para medir a Validação 01).

---

## Fontes
*Observação: vários comparativos de preço de ABM são publicados por fornecedores concorrentes (ex.: Abmatic, MarketBetter, Salesmotion, ZenABM) e devem ser lidos como referência, não como preço de tabela.*

- Abmatic — ABM Platform Pricing Guide 2026: https://abmatic.ai/blog/abm-platform-pricing-guide-2026
- Abmatic — ABM Platform Pricing Comparison 2026: https://abmatic.ai/blog/blog/abm-platform-pricing-comparison-2026-1777558062626
- Abmatic — ABM Software Pricing Guide: https://blog.abmatic.ai/abm-software-pricing-guide-2027
- Abmatic — Metadata.io alternatives: https://abmatic.ai/blog/metadata-pricing-too-expensive-alternatives-2026
- Abmatic — Top ABM Trends 2026: https://blog.abmatic.ai/top-abm-trends-2026
- Valley — Common Room Pricing Explained 2026: https://www.joinvalley.co/blog/common-room-pricing-explained-2026
- Salesmotion — Common Room Pricing: https://salesmotion.io/blog/common-room-pricing
- Common Room vs 6sense: https://commonroom.io/solutions/compete/6sense
- MarketBetter — Common Room Review 2026: https://marketbetter.ai/blog/common-room-review-2026/
- Salesmotion — Unify GTM Pricing 2026: https://salesmotion.io/blog/unify-gtm-pricing
- Unify — Warm Outbound Examples: https://unifygtm.com/explore/warm-outbound-examples
- The AI Agent Index — Warmly: https://theaiagentindex.com/agents/warmly
- Modern Inbound — Warmly vs Common Room: https://moderninbound.com/blog/warmly-vs-common-room
- Docket — Factors.ai pricing: https://docket.io/resources/research/factors-pricing
- Zeliq/ZoomInfo — Factors.ai pricing: https://pipeline.zoominfo.com/sales/factors-ai-pricing
- FitGap — Metadata.io: https://us.fitgap.com/products/000889/metadata-io
- Docket — Fibbler alternatives: https://docket.io/resources/research/fibbler-alternatives
- ZenABM — resposta sobre Fibbler: https://zenabm.com/blog/fibblers-zenabm-alternatives-article-our-response
- Enrich — Clay Review 2026: https://enrich.so/blog/clay-review
- Amplemarket — How much does Clay cost: https://amplemarket.com/blog/how-much-does-clay-really-cost
- Salesgear — Apollo pricing 2026: https://www.salesgear.io/blog/apollo-pricing/
- Salesmotion — Apollo pricing: https://salesmotion.io/blog/apollo-pricing
- WhiteHat — ABM in HubSpot: https://whitehat-seo.co.uk/blog/account-based-marketing-abm-in-hubspot
- New Breed — HubSpot native ABM: https://www.newbreedrevenue.com/blog/how-to-use-hubspot-native-abm-capabilities
- AWS Brasil — Maestro ABM com IA generativa: https://aws.amazon.com/pt/blogs/aws-brasil/como-a-maestro-abm-esta-transformando-vendas-b2b-complexas-com-ia-generativa-usando-amazon-bedrock-e-amazon-nova-e-amazon-titan/
- B2B Stack — Maestro ABM: https://www.b2bstack.com.br/product/maestro-abm
- B2B Stack — Maestro ABM avaliações: https://www.b2bstack.com.br/product/maestro-abm/avaliacoes
- B2B Stack — Harpoon vs Maestro: https://www.b2bstack.com.br/compare/harpoon-vs-maestro-abm
- B2B Stack — Speedio vs Ramper: https://www.b2bstack.com.br/compare/speedio-vs-ramper
- B2B Stack — Meetime: https://www.b2bstack.com.br/empresa/meetime
- CB Insights — Reev: https://www.cbinsights.com/investor/reev
- Microsoft Learn — LinkedIn Marketing API, Increasing Access: https://learn.microsoft.com/pt-br/linkedin/marketing/increasing-access
- Microsoft Learn — LinkedIn Account Based Targeting (company lists): https://learn.microsoft.com/en-us/linkedin/marketing/usecases/matched-audiences/company-lists?view=li-lms-2024-04
- Salesforge — Cold email e LGPD: https://www.salesforge.ai/pt/blog/cold-email
- Confidata — LGPD no marketing digital: https://confidata.com.br/blog/lgpd-marketing-digital-campanhas-crm-automacao
