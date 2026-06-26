import { createContext, useContext, useMemo, useState } from 'react';

const ScheduledReportsContext = createContext(null);

// A scheduled report is "recurring" when its frequency is anything other than
// a one-time send. Recurring reports show under "Recurring schedules" with a
// toggle; one-time sends show under "Sending this week".
export const ONE_TIME = 'One-time';

export function ScheduledReportsProvider({ children }) {
  const [scheduledReports, setScheduledReports] = useState([]);

  function addScheduledReport(report) {
    const record = {
      id: crypto.randomUUID(),
      enabled: true,
      channels: [],
      content: {},
      createdAt: new Date().toISOString(),
      ...report,
    };
    setScheduledReports((prev) => [record, ...prev]);
    // TODO(reports): persist to Supabase
    return record;
  }

  function toggleScheduledReport(id) {
    setScheduledReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)),
    );
  }

  const value = useMemo(
    () => ({ scheduledReports, addScheduledReport, toggleScheduledReport }),
    [scheduledReports],
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
