-- ─────────────────────────────────────────────────────────────────
-- 0006  scheduled reports
-- ─────────────────────────────────────────────────────────────────

create table if not exists public.scheduled_reports (
  id               uuid        primary key default gen_random_uuid(),
  org_id           uuid        not null references public.organisations(id) on delete cascade,
  name             text        not null,
  programme        text,
  report_type      text,
  frequency        text        not null default 'One-time',
  send_date        date,
  send_time        time,
  timezone         text,
  recipients       text,
  channels         jsonb       not null default '[]',
  content          jsonb       not null default '{}',
  schedule_summary text,
  enabled          boolean     not null default true,
  created_at       timestamptz not null default now()
);

create index if not exists scheduled_reports_org_id_idx on public.scheduled_reports(org_id);
