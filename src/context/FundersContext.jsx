import { createContext, useContext, useMemo, useState } from 'react';

// Funders & donors context (FR-013).
// Holds the funder list across the Add form (p.8) and the Funders list (p.10).
// addFunder() prepends a new funder so it appears immediately. Wired to the
// Supabase `funders` table in a later section.
const FundersContext = createContext({
  funders: [],
  addFunder: () => {},
});

export function FundersProvider({ children }) {
  const [funders, setFunders] = useState([]);

  function addFunder(funder) {
    const record = {
      id: crypto.randomUUID(),
      status: 'Active',
      reportDue: false,
      createdAt: new Date().toISOString(),
      ...funder,
    };
    setFunders((prev) => [record, ...prev]);
    // TODO(funders): persist to Supabase `funders` table.
    return record;
  }

  const value = useMemo(() => ({ funders, addFunder }), [funders]);

  return <FundersContext.Provider value={value}>{children}</FundersContext.Provider>;
}

export function useFunders() {
  return useContext(FundersContext);
}
