import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase.js';
import { useAuth } from './AuthContext.jsx';

const ScheduledReportsContext = createContext(null);

export const ONE_TIME = 'One-time';

function dbToReport(row) {
  return {
    id: row.id,
    name: row.name,
    programme: row.programme ?? '',
    reportType: row.report_type ?? '',
    frequency: row.frequency,
    sendDate: row.send_date ?? '',
    sendTime: row.send_time ?? '',
    timezone: row.timezone ?? '',
    recipients: row.recipients ?? '',
    channels: row.channels ?? [],
    content: row.content ?? {},
    scheduleSummary: row.schedule_summary ?? '',
    enabled: row.enabled,
    createdAt: row.created_at,
  };
}

export function ScheduledReportsProvider({ children }) {
  const { profile } = useAuth();
  const [scheduledReports, setScheduledReports] = useState([]);

  useEffect(() => {
    const orgId = profile?.org_id;
    if (!orgId) { setScheduledReports([]); return; }

    supabase
      .from('scheduled_reports')
      .select('*')
      .eq('org_id', orgId)
      .order('created_at', { ascending: false })
      .then(({ data }) => setScheduledReports(data ? data.map(dbToReport) : []));
  }, [profile?.org_id]);

  const addScheduledReport = useCallback(async (report) => {
    const orgId = profile?.org_id;
    if (!orgId) return null;

    const tempId = `temp-${Date.now()}`;
    const optimistic = {
      id: tempId,
      enabled: true,
      channels: [],
      content: {},
      createdAt: new Date().toISOString(),
      ...report,
    };
    setScheduledReports((prev) => [optimistic, ...prev]);

    const { data, error } = await supabase.from('scheduled_reports').insert({
      org_id: orgId,
      name: report.name,
      programme: report.programme || null,
      report_type: report.reportType || null,
      frequency: report.frequency || ONE_TIME,
      send_date: report.sendDate || null,
      send_time: report.sendTime || null,
      timezone: report.timezone || null,
      recipients: report.recipients || null,
      channels: report.channels ?? [],
      content: report.content ?? {},
      schedule_summary: report.scheduleSummary || null,
      enabled: true,
    }).select().single();

    if (data) {
      setScheduledReports((prev) => prev.map((r) => r.id === tempId ? dbToReport(data) : r));
      return dbToReport(data);
    }

    if (error) {
      setScheduledReports((prev) => prev.filter((r) => r.id !== tempId));
      console.error('[ScheduledReportsContext] addScheduledReport error:', error.message);
    }
    return null;
  }, [profile?.org_id]);

  const toggleScheduledReport = useCallback(async (id) => {
    // Optimistic toggle
    setScheduledReports((prev) =>
      prev.map((r) => r.id === id ? { ...r, enabled: !r.enabled } : r),
    );

    const report = scheduledReports.find((r) => r.id === id);
    if (!report) return;

    const { error } = await supabase
      .from('scheduled_reports')
      .update({ enabled: !report.enabled })
      .eq('id', id);

    if (error) {
      // Rollback
      setScheduledReports((prev) =>
        prev.map((r) => r.id === id ? { ...r, enabled: report.enabled } : r),
      );
      console.error('[ScheduledReportsContext] toggleScheduledReport error:', error.message);
    }
  }, [scheduledReports]);

  const value = useMemo(
    () => ({ scheduledReports, addScheduledReport, toggleScheduledReport }),
    [scheduledReports, addScheduledReport, toggleScheduledReport],
  );

  return (
    <ScheduledReportsContext.Provider value={value}>
      {children}
    </ScheduledReportsContext.Provider>
  );
}

export function useScheduledReports() {
  const ctx = useContext(ScheduledReportsContext);
  if (!ctx) throw new Error('useScheduledReports must be used inside ScheduledReportsProvider');
  return ctx;
}
