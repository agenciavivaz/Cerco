-- RLS das tabelas de plataforma e tenancy.

alter table public.clients enable row level security;
alter table public.workspaces enable row level security;
alter table public.profiles enable row level security;
alter table public.workspace_members enable row level security;
alter table public.platform_settings enable row level security;
alter table public.audit_logs enable row level security;

-- clients: só platform_admin.
create policy clients_all_admin on public.clients
  for all to authenticated
  using (public.is_platform_admin())
  with check (public.is_platform_admin());

-- workspaces: membro lê; só ADM escreve.
create policy workspaces_select_member on public.workspaces
  for select to authenticated
  using (public.is_platform_admin() or public.is_member(id));
create policy workspaces_insert_admin on public.workspaces
  for insert to authenticated
  with check (public.is_platform_admin());
create policy workspaces_update_admin on public.workspaces
  for update to authenticated
  using (public.is_platform_admin())
  with check (public.is_platform_admin());
create policy workspaces_delete_admin on public.workspaces
  for delete to authenticated
  using (public.is_platform_admin());

-- workspace_members: membros do workspace veem a lista; só ADM gerencia (PRD §4.2: convites só no ADM na V1).
create policy workspace_members_select_member on public.workspace_members
  for select to authenticated
  using (public.is_platform_admin() or public.is_member(workspace_id));
create policy workspace_members_insert_admin on public.workspace_members
  for insert to authenticated
  with check (public.is_platform_admin());
create policy workspace_members_update_admin on public.workspace_members
  for update to authenticated
  using (public.is_platform_admin())
  with check (public.is_platform_admin());
create policy workspace_members_delete_admin on public.workspace_members
  for delete to authenticated
  using (public.is_platform_admin());

-- profiles: o próprio, colegas de workspace e o ADM leem. O próprio edita nome/telefone
-- (campos de controle protegidos por trigger). Criação/remoção só pelo servidor ou ADM.
create policy profiles_select_self_or_colleague on public.profiles
  for select to authenticated
  using (id = auth.uid() or public.is_platform_admin() or public.shares_workspace_with(id));
create policy profiles_update_self_or_admin on public.profiles
  for update to authenticated
  using (id = auth.uid() or public.is_platform_admin())
  with check (id = auth.uid() or public.is_platform_admin());
create policy profiles_delete_admin on public.profiles
  for delete to authenticated
  using (public.is_platform_admin());

-- platform_settings: só ADM.
create policy platform_settings_all_admin on public.platform_settings
  for all to authenticated
  using (public.is_platform_admin())
  with check (public.is_platform_admin());

-- audit_logs: só ADM lê. Escrita só por triggers (security definer) e pelo servidor (service role).
create policy audit_logs_select_admin on public.audit_logs
  for select to authenticated
  using (public.is_platform_admin());

-- anon não toca em nada.
revoke all on public.clients, public.workspaces, public.profiles, public.workspace_members,
  public.platform_settings, public.audit_logs from anon;
