import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase.js';
import { useAuth } from './AuthContext.jsx';

const OrgContext = createContext({
  org: null,
  orgLoading: false,
  beneficiaryLabel: 'Students',
  setOrg: () => {},
  saveOrg: async () => {},
  addProgramme: async () => {},
});

function dbToProgramme(row) {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? '',
    color: row.color ?? null,
    shortLabel: row.short_label ?? '',
  };
}

export function OrgProvider({ children }) {
  const { profile } = useAuth();
  const [org, setOrg] = useState(null);
  const [orgLoading, setOrgLoading] = useState(false);

  // Load org + programmes from Supabase whenever the user's org_id changes
  useEffect(() => {
    const orgId = profile?.org_id;
    if (!orgId) { setOrg(null); return; }

    setOrgLoading(true);

    Promise.all([
      supabase.from('organisations').select('*').eq('id', orgId).single(),
      supabase.from('programmes').select('*').eq('org_id', orgId).order('created_at'),
    ]).then(([{ data: orgData }, { data: programmes }]) => {
      if (orgData) {
        setOrg({
          id: orgData.id,
          name: orgData.name,
          type: orgData.type ?? '',
          country: orgData.country ?? '',
          size: orgData.size ?? '',
          beneficiaryLabel: orgData.beneficiary_label ?? 'Students',
          programmes: (programmes ?? []).map(dbToProgramme),
        });
      }
      setOrgLoading(false);
    });
  }, [profile?.org_id]);

  // Persist org settings changes and update local state
  const saveOrg = useCallback(async (updates) => {
    const orgId = org?.id ?? profile?.org_id;
    if (!orgId) return;

    // Optimistic local update
    setOrg((prev) => (prev ? { ...prev, ...updates } : prev));

    await supabase.from('organisations').update({
      name: updates.name,
      type: updates.type,
      country: updates.country,
      size: updates.size,
      beneficiary_label: updates.beneficiaryLabel,
    }).eq('id', orgId);
  }, [org?.id, profile?.org_id]);

  // Add a programme. Local-first: the pill appears (and becomes clickable as a
  // filter) immediately, regardless of backend state. Persistence to Supabase
  // happens in the background and swaps the temp id for the real UUID on success.
  const addProgramme = useCallback(async (programme) => {
    const orgId = org?.id ?? profile?.org_id;

    const tempId = `temp-${Date.now()}`;
    const optimistic = { id: tempId, ...programme };

    // Always append — even if org hasn't fully loaded, build a shell so the
    // pill bar shows the new pill immediately.
    setOrg((prev) => {
      const base = prev ?? {
        id: orgId ?? tempId,
        name: '',
        type: '',
        country: '',
        size: '',
        beneficiaryLabel: 'Students',
        programmes: [],
      };
      return { ...base, programmes: [...(base.programmes ?? []), optimistic] };
    });

    // No org row to attach to yet — keep the programme in local state for this
    // session so the pill/filter still works. It will persist once an org exists.
    if (!orgId) {
      console.warn('[OrgContext] addProgramme: no org_id yet; programme kept locally only.');
      return optimistic;
    }

    const { data, error } = await supabase.from('programmes').insert({
      org_id: orgId,
      name: programme.name,
      description: programme.description || null,
      color: programme.color || null,
      short_label: programme.shortLabel || null,
    }).select().single();

    if (data) {
      // Swap temp record for the persisted one (real UUID)
      setOrg((prev) => prev
        ? { ...prev, programmes: prev.programmes.map((p) => p.id === tempId ? dbToProgramme(data) : p) }
        : prev,
      );
      return dbToProgramme(data);
    }

    if (error) {
      // Persistence failed — keep the optimistic pill so the user still sees it
      // (it just won't survive a reload until the backend issue is resolved).
      console.error('[OrgContext] addProgramme error:', error.message);
    }
    return optimistic;
  }, [org?.id, profile?.org_id]);

  const value = useMemo(
    () => ({
      org,
      orgLoading,
      setOrg,
      saveOrg,
      addProgramme,
      beneficiaryLabel: org?.beneficiaryLabel ?? 'Students',
    }),
    [org, orgLoading, saveOrg, addProgramme],
  );

  return <OrgContext.Provider value={value}>{children}</OrgContext.Provider>;
}

export function useOrg() {
  return useContext(OrgContext);
}
