-- Funções de autorização usadas pelas policies de RLS (PRD §8.7).
-- security definer + search_path vazio: leem as tabelas de membros sem recursão de RLS.

create or replace function public.is_platform_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(
    (select p.is_platform_admin
       from public.profiles p
      where p.id = auth.uid() and p.status = 'active'),
    false
  );
$$;

create or replace function public.is_member(ws uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
      from public.workspace_members m
      join public.profiles p on p.id = m.user_id
     where m.workspace_id = ws
       and m.user_id = auth.uid()
       and p.status = 'active'
  );
$$;

create or replace function public.member_role(ws uuid)
returns public.member_role
language sql
stable
security definer
set search_path = ''
as $$
  select m.role
    from public.workspace_members m
    join public.profiles p on p.id = m.user_id
   where m.workspace_id = ws
     and m.user_id = auth.uid()
     and p.status = 'active';
$$;

create or replace function public.has_role(ws uuid, roles text[])
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(public.member_role(ws)::text = any (roles), false);
$$;

-- Dois usuários compartilham ao menos um workspace (para ver colegas, ex.: lista de responsáveis).
create or replace function public.shares_workspace_with(other uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
      from public.workspace_members mine
      join public.workspace_members theirs on theirs.workspace_id = mine.workspace_id
     where mine.user_id = auth.uid()
       and theirs.user_id = other
  );
$$;

revoke execute on function public.is_platform_admin() from anon;
revoke execute on function public.is_member(uuid) from anon;
revoke execute on function public.member_role(uuid) from anon;
revoke execute on function public.has_role(uuid, text[]) from anon;
revoke execute on function public.shares_workspace_with(uuid) from anon;

-- Cria o perfil quando um usuário é criado no Auth (só por convite do ADM).
-- Se o e-mail estiver em platform_settings['bootstrap.admin_emails'], o perfil nasce platform_admin.
create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_admin_emails jsonb;
begin
  select value into v_admin_emails from public.platform_settings where key = 'bootstrap.admin_emails';

  insert into public.profiles (id, email, full_name, is_platform_admin)
  values (
    new.id,
    lower(new.email),
    nullif(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(v_admin_emails ? lower(new.email), false)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_auth_user();

create or replace function public.handle_auth_user_email_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.profiles set email = lower(new.email) where id = new.id;
  return new;
end;
$$;

create trigger on_auth_user_email_changed
  after update of email on auth.users
  for each row when (old.email is distinct from new.email)
  execute function public.handle_auth_user_email_change();

-- Usuário comum não altera os próprios campos de controle (admin, status, e-mail).
-- auth.uid() nulo = service role / jobs do servidor.
create or replace function public.protect_profile_fields()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is not null
     and not public.is_platform_admin()
     and (new.is_platform_admin is distinct from old.is_platform_admin
          or new.status is distinct from old.status
          or new.email is distinct from old.email
          or new.id is distinct from old.id) then
    raise exception 'not allowed to change protected profile fields' using errcode = '42501';
  end if;
  return new;
end;
$$;

create trigger profiles_protect_fields
  before update on public.profiles
  for each row execute function public.protect_profile_fields();
