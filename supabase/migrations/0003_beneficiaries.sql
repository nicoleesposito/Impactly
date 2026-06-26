-- ─────────────────────────────────────────────────────────────────
-- 0003  beneficiaries
-- ─────────────────────────────────────────────────────────────────

create table if not exists public.beneficiaries (
  id            uuid        primary key default gen_random_uuid(),
  org_id        uuid        not null references public.organisations(id) on delete cascade,
  first_name    text        not null,
  last_name     text,
  date_of_birth date,
  gender        text,
  programme_id  uuid        references public.programmes(id) on delete set null,
  status        text        not null default 'Active',
  created_at    timestamptz not null default now()
);

create index if not exists beneficiaries_org_id_idx on public.beneficiaries(org_id);
