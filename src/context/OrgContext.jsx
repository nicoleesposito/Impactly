import { createContext, useContext, useCallback, useMemo, useState } from 'react';

// Organisation context, incl. the configurable beneficiary label (BR-006)
// that renames "Students" across navigation, headings and reports.
const OrgContext = createContext({
  org: null,
  beneficiaryLabel: 'Students',
  setOrg: () => {},
});

export function OrgProvider({ children }) {
  const [org, setOrg] = useState(null);

  const addProgramme = useCallback((programme) => {
    const record = { id: crypto.randomUUID(), ...programme };
    setOrg((prev) => prev
      ? { ...prev, programmes: [...(prev.programmes ?? []), record] }
      : { programmes: [record] },
    );
    return record;
  }, []);

  const value = useMemo(
    () => ({ org, setOrg, addProgramme, beneficiaryLabel: org?.beneficiaryLabel ?? 'Students' }),
    [org, addProgramme],
  );
  return <OrgContext.Provider value={value}>{children}</OrgContext.Provider>;
}

export function useOrg() {
  return useContext(OrgContext);
}
