-- ─────────────────────────────────────────────────────────────────
-- 0010  Extra fields on beneficiaries
--       address, id_number, emergency contact columns
-- ─────────────────────────────────────────────────────────────────

alter table public.beneficiaries
  add column if not exists address                   text,
  add column if not exists id_number                 text,
  add column if not exists emergency_contact_name    text,
  add column if not exists emergency_contact_dob     date,
  add column if not exists emergency_contact_relation text;
