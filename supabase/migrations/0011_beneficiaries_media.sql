-- ─────────────────────────────────────────────────────────────────
-- 0011  Beneficiary media & story content columns
-- ─────────────────────────────────────────────────────────────────

alter table public.beneficiaries
  add column if not exists document_urls    jsonb not null default '[]',
  add column if not exists story_image_urls jsonb not null default '[]',
  add column if not exists story_quotes     text;

-- Storage buckets are created via the Supabase dashboard:
--   1. beneficiary-docs   (for consent / form PDFs)
--   2. beneficiary-images (for story photos)
-- Both should be set to public so the app can display them without signed URLs.
