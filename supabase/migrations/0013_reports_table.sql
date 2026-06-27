create table if not exists public.reports (
  id            uuid        primary key default gen_random_uuid(),
  org_id        uuid        not null references public.organisations(id) on delete cascade,
  title         text        not null,
  programme_id  uuid        references public.programmes(id) on delete set null,
  funder        text,
  due_date      date,
  status        text        not null default 'in-progress',
  template      text,
  sections      jsonb       not null default '{}',
  created_at    timestamptz not null default now()
);
create index if not exists reports_org_id_idx on public.reports(org_id);
alter table public.reports enable row level security;
create policy "org members can read reports"    on public.reports for select using (org_id = public.user_org_id());
create policy "org members can insert reports"  on public.reports for insert with check (org_id = public.user_org_id());
create policy "org members can update reports"  on public.reports for update using (org_id = public.user_org_id());
create policy "org members can delete reports"  on public.reports for delete using (org_id = public.user_org_id());
