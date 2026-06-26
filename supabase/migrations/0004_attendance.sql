-- ─────────────────────────────────────────────────────────────────
-- 0004  attendance
-- ─────────────────────────────────────────────────────────────────

create table if not exists public.attendance_sessions (
  id           uuid        primary key default gen_random_uuid(),
  org_id       uuid        not null references public.organisations(id) on delete cascade,
  programme_id uuid        references public.programmes(id) on delete set null,
  session_date date        not null,
  created_by   uuid        references auth.users(id) on delete set null,
  created_at   timestamptz not null default now()
);

create table if not exists public.attendance_records (
  id             uuid        primary key default gen_random_uuid(),
  session_id     uuid        not null references public.attendance_sessions(id) on delete cascade,
  beneficiary_id uuid        not null references public.beneficiaries(id) on delete cascade,
  present        boolean     not null default false,
  created_at     timestamptz not null default now(),
  unique(session_id, beneficiary_id)
);

create index if not exists attendance_sessions_org_id_idx on public.attendance_sessions(org_id);
