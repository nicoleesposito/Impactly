-- ─────────────────────────────────────────────────────────────────
-- 0007  staff invites + auth trigger + create_organisation RPC
-- ─────────────────────────────────────────────────────────────────

create table if not exists public.staff_invites (
  id           uuid        primary key default gen_random_uuid(),
  org_id       uuid        not null references public.organisations(id) on delete cascade,
  email        text        not null,
  access_level text        not null default 'Staff',
  role         text,
  sent_at      timestamptz not null default now(),
  accepted_at  timestamptz,
  constraint uq_staff_invite unique (org_id, email)
);

create index if not exists staff_invites_org_id_idx on public.staff_invites(org_id);
create index if not exists staff_invites_email_idx  on public.staff_invites(email);

-- ── Trigger: auto-create profile row when a new auth user is created ──────────
-- For org founders: profile is created with org_id = null (set later via create_organisation).
-- For invited staff: profile is created with the org_id from the matching invite row.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
  v_role   text := 'admin';
begin
  -- Check for a pending invite matching this email address
  select org_id into v_org_id
    from public.staff_invites
   where email       = new.email
     and accepted_at is null
   limit 1;

  if v_org_id is not null then
    v_role := 'staff';
    update public.staff_invites
       set accepted_at = now()
     where email = new.email and org_id = v_org_id;
  end if;

  insert into public.profiles (id, org_id, first_name, last_name, role)
  values (
    new.id,
    v_org_id,
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name',
    v_role
  );

  return new;
end;
$$;

-- Drop before recreating so re-running the migration is idempotent
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── RPC: atomically create org + link calling user's profile ──────────────────
-- Called from the client after successful auth signup (onboarding Step 6).
-- Runs as security definer so it can insert into organisations and update
-- profiles without the caller needing direct table INSERT access.
create or replace function public.create_organisation(
  p_name              text,
  p_type              text    default null,
  p_country           text    default null,
  p_size              text    default null,
  p_beneficiary_label text    default 'Students'
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
begin
  insert into public.organisations (name, type, country, size, beneficiary_label)
  values (p_name, p_type, p_country, p_size, p_beneficiary_label)
  returning id into v_org_id;

  update public.profiles
     set org_id = v_org_id,
         role   = 'admin'
   where id = auth.uid();

  return v_org_id;
end;
$$;
