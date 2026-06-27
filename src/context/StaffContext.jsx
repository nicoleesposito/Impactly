import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase.js';
import { useAuth } from './AuthContext.jsx';

const StaffContext = createContext({
  activeStaff: [],
  pendingInvites: [],
  addInvite: async () => {},
  removeInvite: async () => {},
});

function dbToInvite(row) {
  return {
    id: row.id,
    email: row.email,
    accessLevel: row.access_level,
    role: row.role ?? null,
    sentAt: row.sent_at,
    acceptedAt: row.accepted_at ?? null,
  };
}

function dbToStaff(row) {
  const firstName = row.first_name ?? '';
  const lastName = row.last_name ?? '';
  return {
    id: row.id,
    firstName,
    lastName,
    name: `${firstName} ${lastName}`.trim(),
    role: row.role,
    orgId: row.org_id,
    status: row.status ?? 'Active',
    volunteer: row.volunteer ?? false,
    programme: row.programme ?? null,
  };
}

export function StaffProvider({ children }) {
  const { profile } = useAuth();
  const [activeStaff, setActiveStaff] = useState([]);
  const [pendingInvites, setPendingInvites] = useState([]);

  useEffect(() => {
    const orgId = profile?.org_id;
    if (!orgId) {
      setActiveStaff([]);
      setPendingInvites([]);
      return;
    }

    // Load pending invites
    supabase
      .from('staff_invites')
      .select('*')
      .eq('org_id', orgId)
      .is('accepted_at', null)
      .order('sent_at', { ascending: false })
      .then(({ data }) => setPendingInvites(data ? data.map(dbToInvite) : []));

    // Load active staff (all profiles in this org except the current user)
    supabase
      .from('profiles')
      .select('id, first_name, last_name, role, org_id')
      .eq('org_id', orgId)
      .then(({ data }) => setActiveStaff(data ? data.map(dbToStaff) : []));
  }, [profile?.org_id]);

  const addInvite = useCallback(async ({ email, accessLevel, role }) => {
    const orgId = profile?.org_id;
    if (!orgId) return null;

    const tempId = `temp-${Date.now()}`;
    const optimistic = {
      id: tempId,
      email: email.trim().toLowerCase(),
      accessLevel,
      role: role || null,
      sentAt: new Date().toISOString(),
      acceptedAt: null,
    };
    setPendingInvites((prev) => [...prev, optimistic]);

    const { data, error } = await supabase.from('staff_invites').insert({
      org_id: orgId,
      email: email.trim().toLowerCase(),
      access_level: accessLevel,
      role: role || null,
    }).select().single();

    if (data) {
      setPendingInvites((prev) => prev.map((i) => i.id === tempId ? dbToInvite(data) : i));
      // TODO: trigger invite email via Edge Function:
      // await supabase.functions.invoke('invite-staff', { body: { inviteId: data.id } });
      return dbToInvite(data);
    }

    if (error) {
      setPendingInvites((prev) => prev.filter((i) => i.id !== tempId));
      console.error('[StaffContext] addInvite error:', error.message);
    }
    return null;
  }, [profile?.org_id]);

  const removeInvite = useCallback(async (id) => {
    setPendingInvites((prev) => prev.filter((i) => i.id !== id));
    const { error } = await supabase.from('staff_invites').delete().eq('id', id);
    if (error) {
      console.error('[StaffContext] removeInvite error:', error.message);
    }
  }, []);

  const updateStaff = useCallback(async (id, patch) => {
    setActiveStaff((prev) => prev.map((s) => {
      if (s.id !== id) return s;
      const updated = { ...s, ...patch };
      updated.name = `${updated.firstName} ${updated.lastName}`.trim();
      return updated;
    }));
    const colMap = { firstName: 'first_name', lastName: 'last_name', role: 'role' };
    const dbPatch = {};
    for (const [k, col] of Object.entries(colMap)) {
      if (k in patch) dbPatch[col] = patch[k];
    }
    const { error } = await supabase.from('profiles').update(dbPatch).eq('id', id);
    if (error) console.error('[StaffContext] updateStaff error:', error.message);
  }, []);

  const value = useMemo(
    () => ({ activeStaff, pendingInvites, addInvite, removeInvite, updateStaff }),
    [activeStaff, pendingInvites, addInvite, removeInvite, updateStaff],
  );

  return <StaffContext.Provider value={value}>{children}</StaffContext.Provider>;
}

export function useStaff() {
  return useContext(StaffContext);
}
