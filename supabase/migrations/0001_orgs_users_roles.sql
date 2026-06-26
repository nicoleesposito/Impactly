-- ─────────────────────────────────────────────────────────────────
-- 0001  organisations + profiles
-- ─────────────────────────────────────────────────────────────────

create table if not exists public.organisations (
  id                uuid        primary key default gen_random_uuid(),
  name              text        not null,
  type              text,
  country           text,
  size              text,
  beneficiary_label text        not null default 'Students',
  created_at        timestamptz not null   default now(),
  updated_at        timestamptz not null   default now()
);

-- One profile row per Supabase Auth user
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  org_id     uuid references public.organisations(id) on delete set null,
  first_name text,
  last_name  text,
  role       text        not null default 'admin',  -- admin | staff | viewer
  created_at timestamptz not null default now()
);

-- Auto-bump updated_at on organisations
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger trg_orgs_updated_at
  before update on public.organisations
  for each row execute function public.set_updated_at();
