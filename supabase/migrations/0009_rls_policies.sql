-- ─────────────────────────────────────────────────────────────────
-- 0009  Row-Level Security
-- All tables restrict reads and writes to the calling user's org.
-- ─────────────────────────────────────────────────────────────────

-- Helper: returns the org_id of the currently authenticated user.
-- security definer + stable so Postgres can cache the result per statement.
create or replace function public.user_org_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select org_id from public.profiles where id = auth.uid();
$$;

-- ── organisations ─────────────────────────────────────────────────
alter table public.organisations enable row level security;

create policy "org members can read their org"
  on public.organisations for select
  using (id = public.user_org_id());

create policy "org admins can update their org"
  on public.organisations for update
  using (id = public.user_org_id());

-- ── profiles ──────────────────────────────────────────────────────
alter table public.profiles enable row level security;

create policy "users can read their own profile"
  on public.profiles for select
  using (id = auth.uid());

create policy "users can update their own profile"
  on public.profiles for update
  using (id = auth.uid());

create policy "org members can read profiles in same org"
  on public.profiles for select
  using (org_id = public.user_org_id());

-- ── programmes ────────────────────────────────────────────────────
alter table public.programmes enable row level security;

create policy "org members can read programmes"
  on public.programmes for select
  using (org_id = public.user_org_id());

create policy "org members can insert programmes"
  on public.programmes for insert
  with check (org_id = public.user_org_id());

create policy "org members can update programmes"
  on public.programmes for update
  using (org_id = public.user_org_id());

create policy "org members can delete programmes"
  on public.programmes for delete
  using (org_id = public.user_org_id());

-- ── beneficiaries ─────────────────────────────────────────────────
alter table public.beneficiaries enable row level security;

create policy "org members can read beneficiaries"
  on public.beneficiaries for select
  using (org_id = public.user_org_id());

create policy "org members can insert beneficiaries"
  on public.beneficiaries for insert
  with check (org_id = public.user_org_id());

create policy "org members can update beneficiaries"
  on public.beneficiaries for update
  using (org_id = public.user_org_id());

-- ── attendance ────────────────────────────────────────────────────
alter table public.attendance_sessions enable row level security;
alter table public.attendance_records  enable row level security;

create policy "org members can read attendance sessions"
  on public.attendance_sessions for select
  using (org_id = public.user_org_id());

create policy "org members can insert attendance sessions"
  on public.attendance_sessions for insert
  with check (org_id = public.user_org_id());

create policy "org members can read attendance records"
  on public.attendance_records for select
  using (
    session_id in (
      select id from public.attendance_sessions
       where org_id = public.user_org_id()
    )
  );

create policy "org members can insert attendance records"
  on public.attendance_records for insert
  with check (
    session_id in (
      select id from public.attendance_sessions
       where org_id = public.user_org_id()
    )
  );

-- ── funders ───────────────────────────────────────────────────────
alter table public.funders enable row level security;

create policy "org members can read funders"
  on public.funders for select
  using (org_id = public.user_org_id());

create policy "org members can insert funders"
  on public.funders for insert
  with check (org_id = public.user_org_id());

create policy "org members can update funders"
  on public.funders for update
  using (org_id = public.user_org_id());

-- ── grants ────────────────────────────────────────────────────────
alter table public.grants enable row level security;

create policy "org members can read grants"
  on public.grants for select
  using (org_id = public.user_org_id());

create policy "org members can insert grants"
  on public.grants for insert
  with check (org_id = public.user_org_id());

create policy "org members can update grants"
  on public.grants for update
  using (org_id = public.user_org_id());

-- ── staff invites ─────────────────────────────────────────────────
alter table public.staff_invites enable row level security;

create policy "org members can read invites"
  on public.staff_invites for select
  using (org_id = public.user_org_id());

create policy "org members can insert invites"
  on public.staff_invites for insert
  with check (org_id = public.user_org_id());

create policy "org members can delete invites"
  on public.staff_invites for delete
  using (org_id = public.user_org_id());

-- ── scheduled reports ─────────────────────────────────────────────
alter table public.scheduled_reports enable row level security;

create policy "org members can read scheduled reports"
  on public.scheduled_reports for select
  using (org_id = public.user_org_id());

create policy "org members can insert scheduled reports"
  on public.scheduled_reports for insert
  with check (org_id = public.user_org_id());

create policy "org members can update scheduled reports"
  on public.scheduled_reports for update
  using (org_id = public.user_org_id());

create policy "org members can delete scheduled reports"
  on public.scheduled_reports for delete
  using (org_id = public.user_org_id());

-- ── notifications ─────────────────────────────────────────────────
alter table public.notifications enable row level security;

create policy "users can read their notifications"
  on public.notifications for select
  using (user_id = auth.uid());

create policy "users can update their notifications"
  on public.notifications for update
  using (user_id = auth.uid());
