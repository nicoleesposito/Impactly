import { createClient } from '@supabase/supabase-js';

// Single shared Supabase client. The publishable key is client-safe — access is
// governed by Row-Level Security policies (PRD §17.5). Never expose the
// secret key in client code.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabasePublishableKey) {
  // Surfaced clearly during local setup; see .env.example.
  console.warn(
    '[Impactly] Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY. ' +
      'Copy .env.example to .env and add your Supabase credentials.',
  );
}

export const supabase = createClient(supabaseUrl ?? '', supabasePublishableKey ?? '');
