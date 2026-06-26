-- ─────────────────────────────────────────────────────────────────
-- 0005  funders + grants
-- ─────────────────────────────────────────────────────────────────

create table if not exists public.funders (
  id            uuid        primary key default gen_random_uuid(),
  org_id        uuid        not null references public.organisations(id) on delete cascade,
  name          text        not null,
  type          text,
  contact_name  text,
  contact_email text,
  status        text        not null default 'Active',
  report_due    boolean     not null default false,
  notes         text,
  created_at    timestamptz not null default now()
);

create table if not exists public.grants (
  id          uuid        primary key default gen_random_uuid(),
  org_id      uuid        not null references public.organisations(id) on delete cascade,
  title       text        not null,
  funder      text,
  programme   text,
  amount      text,
  period      text,
  due_date    date,
  reminder    text,
  subtitle    text,
  remaining   text,
  status      text        not null default 'Draft',
  group_label text        not null default 'draft',
  filter      text        not null default 'Open',
  progress    integer     not null default 0,
  created_at  timestamptz not null default now()
);

create index if not exists funders_org_id_idx on public.funders(org_id);
create index if not exists grants_org_id_idx  on public.grants(org_id);
