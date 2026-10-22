-- Plataforma e tenancy (PRD §8.1).

create type public.client_status as enum ('design_partner', 'active', 'paused', 'churned');
create type public.workspace_status as enum ('active', 'paused', 'archived');
create type public.member_role as enum ('manager', 'bdr', 'viewer');
create type public.profile_status as enum ('active', 'disabled');

-- Clientes (entidade de cobrança futura; nada é cobrado na V1).
create table public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(trim(name)) > 0),
  legal_name text,
  cnpj text check (cnpj is null or cnpj ~ '^[0-9]{14}$'),
  status public.client_status not null default 'design_partner',
  plan text,
  contract_value_brl numeric(14, 2) check (contract_value_brl is null or contract_value_brl >= 0),
  billing_day int check (billing_day is null or billing_day between 1 and 31),
  billing_notes text,
  main_contact_name text,
  main_contact_email text,
  started_at date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index clients_cnpj_key on public.clients (cnpj) where cnpj is not null;
create index clients_name_idx on public.clients (lower(name));

create table public.workspaces (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients (id) on delete restrict,
  name text not null check (length(trim(name)) > 0),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and length(slug) between 2 and 60),
  status public.workspace_status not null default 'active',
  timezone text not null default 'America/Sao_Paulo',
  -- business_days, holidays, score_thresholds, frequency_target_weekly, high_intent_paths,
  -- tracking_param, signal_hunter{weekday,hour,include_t2}, brief{weekday,hour}
  -- Valores padrão completos são aplicados e validados pela aplicação (lib/schemas/workspace.ts).
  settings jsonb not null default '{}'::jsonb,
  feature_flags jsonb not null default '{}'::jsonb,
  ai_monthly_budget_usd numeric(10, 2) not null default 50 check (ai_monthly_budget_usd >= 0),
  tracking_public_key text not null unique default encode(extensions.gen_random_bytes(12), 'hex'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index workspaces_client_id_idx on public.workspaces (client_id);

-- Perfil 1:1 com auth.users (criado por trigger).
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  email text not null,
  phone text,
  is_platform_admin boolean not null default false,
  status public.profile_status not null default 'active',
  last_seen_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index profiles_email_idx on public.profiles (lower(email));

create table public.workspace_members (
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  role public.member_role not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (workspace_id, user_id)
);
create index workspace_members_user_id_idx on public.workspace_members (user_id);

create table public.platform_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auditoria. Sem FKs de propósito: o registro sobrevive à exclusão da entidade, do workspace ou do ator.
create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid,
  actor_id uuid,
  action text not null,
  entity_type text not null,
  entity_id text,
  diff jsonb,
  ip text,
  created_at timestamptz not null default now()
);
create index audit_logs_created_at_idx on public.audit_logs (created_at desc);
create index audit_logs_workspace_idx on public.audit_logs (workspace_id, created_at desc);
create index audit_logs_actor_idx on public.audit_logs (actor_id, created_at desc);
create index audit_logs_entity_idx on public.audit_logs (entity_type, entity_id);

create trigger clients_set_updated_at before update on public.clients
  for each row execute function public.set_updated_at();
create trigger workspaces_set_updated_at before update on public.workspaces
  for each row execute function public.set_updated_at();
create trigger profiles_set_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger workspace_members_set_updated_at before update on public.workspace_members
  for each row execute function public.set_updated_at();
create trigger platform_settings_set_updated_at before update on public.platform_settings
  for each row execute function public.set_updated_at();
