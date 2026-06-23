import { createContext, useContext, useMemo, useState } from 'react';

// Organisation context, incl. the configurable beneficiary label (BR-006)
// that renames "Students" across navigation, headings and reports.
const OrgContext = createContext({
  org: null,
  beneficiaryLabel: 'Students',
  setOrg: () => {},
});

export function OrgProvider({ children }) {
  const [org, setOrg] = useState(null);
  const value = useMemo(
    () => ({ org, setOrg, beneficiaryLabel: org?.beneficiaryLabel ?? 'Students' }),
    [org],
  );
  return <OrgContext.Provider value={value}>{children}</OrgContext.Provider>;
}

export function useOrg() {
  return useContext(OrgContext);
}
