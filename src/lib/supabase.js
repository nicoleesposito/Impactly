import { createClient } from '@supabase/supabase-js';

// Single shared Supabase client. The anon key is client-safe — access is
// governed by Row-Level Security policies (PRD §17.5). Never expose the
// service-role key in client code.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Surfaced clearly during local setup; see .env.example.
  console.warn(
    '[Impactly] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. ' +
      'Copy .env.example to .env and add your Supabase credentials.',
  );
}

export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '');
