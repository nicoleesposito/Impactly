import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase.js';
import { useAuth } from './AuthContext.jsx';

const ReportsContext = createContext(null);

function dbToReport(row) {
  return {
    id: row.id,
    title: row.title,
    programmeId: row.programme_id ?? null,
    funder: row.funder ?? '',
    dueDate: row.due_date ?? '',
    status: row.status ?? 'in-progress',
    template: row.template ?? null,
    sections: row.sections ?? {},
    createdAt: row.created_at,
  };
}

export function ReportsProvider({ children }) {
  const { profile } = useAuth();
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const orgId = profile?.org_id;
    if (!orgId) { setReports([]); return; }

    supabase
      .from('reports')
      .select('*')
      .eq('org_id', orgId)
      .order('created_at', { ascending: false })
      .then(({ data }) => setReports(data ? data.map(dbToReport) : []));
  }, [profile?.org_id]);

  const addReport = useCallback(async (draft) => {
    const orgId = profile?.org_id;
    if (!orgId) return null;

    const tempId = `temp-${Date.now()}`;
    const sections = {
      ...draft.sections,
      objectivesText: draft.objectives ?? '',
      challengesText: draft.challengesText ?? '',
    };

    const optimistic = {
      id: tempId,
      title: draft.title,
      programmeId: draft.programmeId || null,
      funder: draft.funder || '',
      dueDate: draft.dueDate || '',
      status: 'in-progress',
      template: draft.template ?? null,
      sections,
      createdAt: new Date().toISOString(),
    };
    setReports((prev) => [optimistic, ...prev]);

    const { data, error } = await supabase.from('reports').insert({
      org_id: orgId,
      title: draft.title,
      programme_id: draft.programmeId || null,
      funder: draft.funder || null,
      due_date: draft.dueDate || null,
      status: 'in-progress',
      template: draft.template || null,
      sections,
    }).select().single();

    if (data) {
      setReports((prev) => prev.map((r) => r.id === tempId ? dbToReport(data) : r));
      return dbToReport(data);
    }

    if (error) {
      setReports((prev) => prev.filter((r) => r.id !== tempId));
      console.error('[ReportsContext] addReport error:', error.message);
    }
    return null;
  }, [profile?.org_id]);

  const value = useMemo(() => ({ reports, addReport }), [reports, addReport]);

  return (
    <ReportsContext.Provider value={value}>
      {children}
    </ReportsContext.Provider>
  );
}

export function useReports() {
  const ctx = useContext(ReportsContext);
  if (!ctx) throw new Error('useReports must be used inside ReportsProvider');
  return ctx;
}
