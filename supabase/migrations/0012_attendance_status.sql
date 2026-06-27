-- ─────────────────────────────────────────────────────────────────
-- 0012  attendance enhancements
--
-- 1. Add status column (present | absent | late) to attendance_records
-- 2. Add unique constraint on (programme_id, session_date) for upsert
-- 3. Add RLS update / delete policies needed to overwrite a saved session
-- ─────────────────────────────────────────────────────────────────

-- 1. Status column (keep existing present boolean for backwards compat)
alter table public.attendance_records
  add column if not exists status text
  check (status in ('present', 'absent', 'late'));

-- 2. Unique constraint so ON CONFLICT upsert works for sessions
do $$
begin
  if not exists (
    select 1 from pg_constraint
     where conname = 'attendance_sessions_programme_date_key'
  ) then
    alter table public.attendance_sessions
      add constraint attendance_sessions_programme_date_key
      unique (programme_id, session_date);
  end if;
end $$;

-- 3. RLS: allow updating sessions (needed after first insert)
create policy "org members can update attendance sessions"
  on public.attendance_sessions for update
  using (org_id = public.user_org_id());

-- 4. RLS: allow deleting records (needed to replace a session's records on re-save)
create policy "org members can delete attendance records"
  on public.attendance_records for delete
  using (
    session_id in (
      select id from public.attendance_sessions
       where org_id = public.user_org_id()
    )
  );
