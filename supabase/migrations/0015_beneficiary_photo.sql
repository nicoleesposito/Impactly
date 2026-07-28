-- ─────────────────────────────────────────────────────────────────
-- 0015  Beneficiary profile photo
-- ─────────────────────────────────────────────────────────────────

alter table public.beneficiaries
  add column if not exists photo_url text;

-- Stored in the existing beneficiary-images bucket (see 0011) alongside
-- story photos — no new bucket required.
