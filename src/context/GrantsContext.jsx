import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase.js';
import { useAuth } from './AuthContext.jsx';

const GrantsContext = createContext(null);

function dbToGrant(row) {
  return {
    id: row.id,
    title: row.title,
    funder: row.funder ?? '',
    programme: row.programme ?? '',
    amount: row.amount ?? '',
    period: row.period ?? '',
    dueDate: row.due_date ?? '',
    reminder: row.reminder ?? '',
    subtitle: row.subtitle ?? '',
    remaining: row.remaining ?? '',
    status: row.status,
    group: row.group_label,
    filter: row.filter,
    progress: row.progress,
    createdAt: row.created_at,
  };
}

export function GrantsProvider({ children }) {
  const { profile } = useAuth();
  const [grants, setGrants] = useState([]);

  useEffect(() => {
    const orgId = profile?.org_id;
    if (!orgId) { setGrants([]); return; }

    supabase
      .from('grants')
      .select('*')
      .eq('org_id', orgId)
      .order('created_at', { ascending: false })
      .then(({ data }) => setGrants(data ? data.map(dbToGrant) : []));
  }, [profile?.org_id]);

  const addGrant = useCallback(async (grant) => {
    const orgId = profile?.org_id;
    if (!orgId) return null;

    const tempId = `temp-${Date.now()}`;
    const optimistic = {
      id: tempId,
      status: 'Draft',
      group: 'draft',
      filter: 'Open',
      progress: 0,
      createdAt: new Date().toISOString(),
      ...grant,
    };
    setGrants((prev) => [optimistic, ...prev]);

    const { data, error } = await supabase.from('grants').insert({
      org_id: orgId,
      title: grant.title,
      funder: grant.funder || null,
      programme: grant.programme || null,
      amount: grant.amount || null,
      period: grant.period || null,
      due_date: grant.dueDate || null,
      reminder: grant.reminder || null,
      subtitle: grant.subtitle || null,
      remaining: grant.remaining || null,
      status: 'Draft',
      group_label: 'draft',
      filter: 'Open',
      progress: 0,
    }).select().single();

    if (data) {
      setGrants((prev) => prev.map((g) => g.id === tempId ? dbToGrant(data) : g));
      return dbToGrant(data);
    }

    if (error) {
      setGrants((prev) => prev.filter((g) => g.id !== tempId));
      console.error('[GrantsContext] addGrant error:', error.message);
    }
    return null;
  }, [profile?.org_id]);

  const updateGrant = useCallback(async (id, patch) => {
    setGrants((prev) => prev.map((g) => g.id === id ? { ...g, ...patch } : g));
    const colMap = {
      title: 'title',
      funder: 'funder',
      programme: 'programme',
      amount: 'amount',
      period: 'period',
      dueDate: 'due_date',
      reminder: 'reminder',
      subtitle: 'subtitle',
      remaining: 'remaining',
      status: 'status',
      group: 'group_label',
      filter: 'filter',
      progress: 'progress',
    };
    const dbPatch = {};
    for (const [k, col] of Object.entries(colMap)) {
      if (k in patch) dbPatch[col] = patch[k];
    }
    const { error } = await supabase.from('grants').update(dbPatch).eq('id', id);
    if (error) console.error('[GrantsContext] updateGrant error:', error.message);
  }, []);

  const value = useMemo(() => ({ grants, addGrant, updateGrant }), [grants, addGrant, updateGrant]);
  return <GrantsContext.Provider value={value}>{children}</GrantsContext.Provider>;
}

export function useGrants() {
  const ctx = useContext(GrantsContext);
  if (!ctx) throw new Error('useGrants must be used inside GrantsProvider');
  return ctx;
}
