-- Configurações globais iniciais (editáveis no ADM-8 a partir do marco M6).
-- Nomes de modelo de IA NÃO são fixados aqui: vêm do env ou do ADM.
insert into public.platform_settings (key, value) values
  ('ai.models', '{"smart": null, "fast": null}'::jsonb),
  ('ai.pricing', '{}'::jsonb),
  ('limits', '{"default_ai_monthly_budget_usd": 50, "import_max_mb": 20, "linkedin_min_companies": 300}'::jsonb),
  ('email', '{"from": null}'::jsonb),
  ('bootstrap.admin_emails', '[]'::jsonb)
on conflict (key) do nothing;
