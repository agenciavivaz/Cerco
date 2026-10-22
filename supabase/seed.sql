-- Seed mínimo do banco LOCAL (roda em `pnpm db:reset`). Só dados fictícios.
-- Usuários e dados de demonstração são criados por `pnpm seed:demo` (scripts/seed-demo.ts).
update public.platform_settings
   set value = '["admin@demo.example"]'::jsonb
 where key = 'bootstrap.admin_emails';
