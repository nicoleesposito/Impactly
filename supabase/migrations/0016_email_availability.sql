-- ─────────────────────────────────────────────────────────────────
-- 0016  Email availability check
--
-- Lets onboarding check whether an email is already registered before
-- the user fills out the rest of the wizard, instead of only finding out
-- from a "User already registered" error on signUp() at the final step.
-- auth.users isn't queryable directly by anon/authenticated clients, so
-- this is exposed as a narrow, read-only security definer RPC — it
-- returns nothing except a boolean, no user data.
-- ─────────────────────────────────────────────────────────────────

create or replace function public.email_available(p_email text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select not exists (
    select 1 from auth.users where lower(email) = lower(p_email)
  );
$$;

grant execute on function public.email_available(text) to anon, authenticated;
