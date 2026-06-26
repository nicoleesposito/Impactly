-- ─────────────────────────────────────────────────────────────────
-- 0002  programmes
-- ─────────────────────────────────────────────────────────────────

create table if not exists public.programmes (
  id          uuid        primary key default gen_random_uuid(),
  org_id      uuid        not null references public.organisations(id) on delete cascade,
  name        text        not null,
  description text,
  color       text,
  short_label text,
  created_at  timestamptz not null default now()
);

create index if not exists programmes_org_id_idx on public.programmes(org_id);
