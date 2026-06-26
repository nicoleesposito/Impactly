import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase.js';

const AuthContext = createContext({
  session: null,
  user: null,
  profile: null,
  role: null,
  loading: true,
  refreshProfile: async () => {},
});

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
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

  // Fetch profile row whenever the signed-in user changes
  useEffect(() => {
    const userId = session?.user?.id;
    if (!userId) { setProfile(null); return; }

    supabase
      .from('profiles')
      .select('org_id, role, first_name, last_name')
      .eq('id', userId)
      .single()
      .then(({ data }) => setProfile(data ?? null));
  }, [session?.user?.id]);

  // Exposed so onboarding can force a re-fetch after creating the org
  const refreshProfile = useCallback(async () => {
    const userId = session?.user?.id;
    if (!userId) return;
    const { data } = await supabase
      .from('profiles')
      .select('org_id, role, first_name, last_name')
      .eq('id', userId)
      .single();
    setProfile(data ?? null);
  }, [session?.user?.id]);

  const role = profile?.role ?? session?.user?.app_metadata?.role ?? null;

  const value = { session, user: session?.user ?? null, profile, role, loading, refreshProfile };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
