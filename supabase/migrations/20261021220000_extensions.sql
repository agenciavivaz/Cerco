-- Extensões usadas pela plataforma.
-- pg_trgm: correspondência de empresas (uploads de ads). pg_cron: jobs agendados. pgmq: fila de jobs.
create extension if not exists pgcrypto with schema extensions;
create extension if not exists pg_trgm with schema extensions;
create extension if not exists pg_cron;
create extension if not exists pgmq;

-- Trigger utilitário: mantém updated_at.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;
