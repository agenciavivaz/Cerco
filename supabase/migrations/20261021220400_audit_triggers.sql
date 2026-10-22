-- Auditoria genérica das tabelas administradas pelo ADM (PRD §13: toda ação do ADM gera audit_logs).
-- Ações sem mudança de dado (convite enviado, entrar no workspace) são registradas pela aplicação.

create or replace function public.audit_row_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_old jsonb := case when tg_op in ('UPDATE', 'DELETE') then to_jsonb(old) end;
  v_new jsonb := case when tg_op in ('INSERT', 'UPDATE') then to_jsonb(new) end;
  v_row jsonb := coalesce(v_new, v_old);
  v_diff jsonb;
  v_ws uuid;
  v_entity_id text;
begin
  if tg_op = 'UPDATE' then
    select jsonb_object_agg(n.key, jsonb_build_object('old', v_old -> n.key, 'new', n.value))
      into v_diff
      from jsonb_each(v_new) n
     where n.key not in ('updated_at', 'last_seen_at')
       and (v_old -> n.key) is distinct from n.value;
    if v_diff is null then
      return new;
    end if;
  elsif tg_op = 'INSERT' then
    v_diff := v_new - 'created_at' - 'updated_at';
  else
    v_diff := v_old - 'created_at' - 'updated_at';
  end if;

  v_ws := case tg_table_name
            when 'workspaces' then (v_row ->> 'id')::uuid
            when 'workspace_members' then (v_row ->> 'workspace_id')::uuid
          end;
  v_entity_id := case tg_table_name
                   when 'workspace_members' then v_row ->> 'user_id'
                   when 'platform_settings' then v_row ->> 'key'
                   else v_row ->> 'id'
                 end;

  insert into public.audit_logs (workspace_id, actor_id, action, entity_type, entity_id, diff)
  values (v_ws, auth.uid(), tg_argv[0] || '.' || lower(tg_op), tg_argv[0], v_entity_id, v_diff);

  return coalesce(new, old);
end;
$$;

create trigger clients_audit after insert or update or delete on public.clients
  for each row execute function public.audit_row_change('client');
create trigger workspaces_audit after insert or update or delete on public.workspaces
  for each row execute function public.audit_row_change('workspace');
create trigger workspace_members_audit after insert or update or delete on public.workspace_members
  for each row execute function public.audit_row_change('workspace_member');
create trigger profiles_audit after insert or update or delete on public.profiles
  for each row execute function public.audit_row_change('profile');
create trigger platform_settings_audit after insert or update or delete on public.platform_settings
  for each row execute function public.audit_row_change('platform_setting');
