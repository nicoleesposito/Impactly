import { createContext, useContext, useEffect, useMemo, useState } from 'react';

// Holds wizard data across the 6 steps so Back/refresh never loses input
// (FR-002, EDGE-004). Persisted to sessionStorage for the duration of setup.
// No backend writes here — submission is wired in the onboarding/auth section.

const STORAGE_KEY = 'impactly-onboarding';

const DEFAULT_DATA = {
  account: { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' },
  organisation: { name: '', type: '', country: '', size: '', beneficiaryLabel: 'Students' },
  template: null,
  beneficiaries: [],
  team: [],
};

const OnboardingContext = createContext(null);

function loadInitial() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_DATA, ...JSON.parse(raw) };
  } catch {
    /* ignore malformed storage */
  }
  return DEFAULT_DATA;
}

export function OnboardingProvider({ children }) {
  const [data, setData] = useState(loadInitial);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      /* storage may be unavailable on shared/locked-down devices */
    }
  }, [data]);

  const value = useMemo(() => {
    const setSection = (section, patch) =>
      setData((d) => ({ ...d, [section]: { ...d[section], ...patch } }));

    return {
      data,
      setAccount: (patch) => setSection('account', patch),
      setOrganisation: (patch) => setSection('organisation', patch),
      setTemplate: (template) => setData((d) => ({ ...d, template })),
      addBeneficiary: (b) =>
        setData((d) => ({ ...d, beneficiaries: [...d.beneficiaries, b] })),
      removeBeneficiary: (id) =>
        setData((d) => ({
          ...d,
          beneficiaries: d.beneficiaries.filter((b) => b.id !== id),
        })),
      addTeamMember: (m) => setData((d) => ({ ...d, team: [...d.team, m] })),
      removeTeamMember: (id) =>
        setData((d) => ({ ...d, team: d.team.filter((m) => m.id !== id) })),
      reset: () => {
        setData(DEFAULT_DATA);
        sessionStorage.removeItem(STORAGE_KEY);
      },
    };
  }, [data]);

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error('useOnboarding must be used within OnboardingProvider');
  return ctx;
}
