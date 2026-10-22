-- Advisor 0028/0029: funções security definer não podem ser chamadas via /rest/v1/rpc por anon.
-- O grant padrão vem de PUBLIC, por isso o "revoke from anon" anterior não tinha efeito.

-- Funções de trigger: ninguém da API chama diretamente (triggers continuam funcionando).
revoke all on function public.audit_row_change() from public, anon, authenticated;
revoke all on function public.handle_new_auth_user() from public, anon, authenticated;
revoke all on function public.handle_auth_user_email_change() from public, anon, authenticated;
revoke all on function public.protect_profile_fields() from public, anon, authenticated;

-- Helpers de RLS: necessários às policies de quem está logado; só revelam dados do próprio usuário.
revoke all on function public.is_platform_admin() from public, anon;
revoke all on function public.is_member(uuid) from public, anon;
revoke all on function public.member_role(uuid) from public, anon;
revoke all on function public.has_role(uuid, text[]) from public, anon;
revoke all on function public.shares_workspace_with(uuid) from public, anon;
grant execute on function public.is_platform_admin() to authenticated;
grant execute on function public.is_member(uuid) to authenticated;
grant execute on function public.member_role(uuid) to authenticated;
grant execute on function public.has_role(uuid, text[]) to authenticated;
grant execute on function public.shares_workspace_with(uuid) to authenticated;
