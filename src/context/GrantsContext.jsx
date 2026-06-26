import { createContext, useContext, useMemo, useState } from 'react';

const GrantsContext = createContext(null);

export function GrantsProvider({ children }) {
  const [grants, setGrants] = useState([]);

  function addGrant(grant) {
    const record = {
      id: crypto.randomUUID(),
      status: 'Draft',
      group: 'draft',
      filter: 'Open',
      progress: 0,
      createdAt: new Date().toISOString(),
      ...grant,
    };
    setGrants((prev) => [record, ...prev]);
    // TODO(grants): persist to Supabase
    return record;
  }

  const value = useMemo(() => ({ grants, addGrant }), [grants]);
  return <GrantsContext.Provider value={value}>{children}</GrantsContext.Provider>;
}

export function useGrants() {
  const ctx = useContext(GrantsContext);
  if (!ctx) throw new Error('useGrants must be used inside GrantsProvider');
  return ctx;
}
