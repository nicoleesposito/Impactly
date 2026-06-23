import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase.js';

// Session + role + org context. Wraps Supabase Auth (email/password + Google OAuth).
const AuthContext = createContext({
  session: null,
  user: null,
  role: null,
  loading: true,
});

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session ?? null);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next ?? null);
    });

    return () => {
      active = false;
      sub?.subscription?.unsubscribe();
    };
  }, []);

  // Role/org are stored in app metadata / a profile row; wired in the auth section.
  const role = session?.user?.app_metadata?.role ?? null;

  const value = { session, user: session?.user ?? null, role, loading };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
