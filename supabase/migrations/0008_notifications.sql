-- ─────────────────────────────────────────────────────────────────
-- 0008  notifications
-- ─────────────────────────────────────────────────────────────────

create table if not exists public.notifications (
  id         uuid        primary key default gen_random_uuid(),
  org_id     uuid        not null references public.organisations(id) on delete cascade,
  user_id    uuid        references auth.users(id) on delete cascade,
  type       text        not null,
  title      text        not null,
  body       text,
  read       boolean     not null default false,
  created_at timestamptz not null default now()
);

create index if not exists notifications_user_id_idx on public.notifications(user_id);
