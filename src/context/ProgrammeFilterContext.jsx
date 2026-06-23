import { createContext, useContext, useMemo, useState } from 'react';

// Persistent programme pill filter (FR-014). 'all' = no filter.
// Shared across every authenticated screen.
const ProgrammeFilterContext = createContext({
  activeProgramme: 'all',
  setActiveProgramme: () => {},
});

export function ProgrammeFilterProvider({ children }) {
  const [activeProgramme, setActiveProgramme] = useState('all');
  const value = useMemo(
    () => ({ activeProgramme, setActiveProgramme }),
    [activeProgramme],
  );
  return (
    <ProgrammeFilterContext.Provider value={value}>
      {children}
    </ProgrammeFilterContext.Provider>
  );
}

export function useProgrammeFilter() {
  return useContext(ProgrammeFilterContext);
}
