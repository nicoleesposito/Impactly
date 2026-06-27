-- ─────────────────────────────────────────────────────────────────
-- 0014  funder profile columns
-- Adds address, phone, registration_id, contact_role and
-- linked_programmes to the funders table so FunderProfile can
-- display the full page-9 view.
-- ─────────────────────────────────────────────────────────────────

alter table public.funders
  add column if not exists address           text,
  add column if not exists phone             text,
  add column if not exists registration_id   text,
  add column if not exists contact_role      text,
  add column if not exists linked_programmes jsonb not null default '[]'::jsonb;
