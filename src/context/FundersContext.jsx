import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase.js';
import { useAuth } from './AuthContext.jsx';

const FundersContext = createContext({
  funders: [],
  addFunder: async () => {},
});

function dbToFunder(row) {
  return {
    id: row.id,
    name: row.name,
    type: row.type ?? '',
    contactName: row.contact_name ?? '',
    contactEmail: row.contact_email ?? '',
    status: row.status,
    reportDue: row.report_due,
    notes: row.notes ?? '',
    createdAt: row.created_at,
  };
}

export function FundersProvider({ children }) {
  const { profile } = useAuth();
  const [funders, setFunders] = useState([]);

  useEffect(() => {
    const orgId = profile?.org_id;
    if (!orgId) { setFunders([]); return; }

    supabase
      .from('funders')
      .select('*')
      .eq('org_id', orgId)
      .order('created_at', { ascending: false })
      .then(({ data }) => setFunders(data ? data.map(dbToFunder) : []));
  }, [profile?.org_id]);

  const addFunder = useCallback(async (funder) => {
    const orgId = profile?.org_id;
    if (!orgId) return null;

    const tempId = `temp-${Date.now()}`;
    const optimistic = {
      id: tempId,
      status: 'Active',
      reportDue: false,
      createdAt: new Date().toISOString(),
      ...funder,
    };
    setFunders((prev) => [optimistic, ...prev]);

    const { data, error } = await supabase.from('funders').insert({
      org_id: orgId,
      name: funder.name,
      type: funder.type || null,
      contact_name: funder.contactName || null,
      contact_email: funder.contactEmail || null,
      status: 'Active',
      report_due: false,
      notes: funder.notes || null,
    }).select().single();

    if (data) {
      setFunders((prev) => prev.map((f) => f.id === tempId ? dbToFunder(data) : f));
      return dbToFunder(data);
    }

    if (error) {
      setFunders((prev) => prev.filter((f) => f.id !== tempId));
      console.error('[FundersContext] addFunder error:', error.message);
    }
    return null;
  }, [profile?.org_id]);

  const value = useMemo(() => ({ funders, addFunder }), [funders, addFunder]);
  return <FundersContext.Provider value={value}>{children}</FundersContext.Provider>;
}

export function useFunders() {
  return useContext(FundersContext);
}
