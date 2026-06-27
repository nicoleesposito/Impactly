import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase.js';
import { useAuth } from './AuthContext.jsx';

const BeneficiariesContext = createContext(null);

function dbToBeneficiary(row) {
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name ?? '',
    dob: row.date_of_birth ?? '',
    gender: row.gender ?? '',
    programmeId: row.programme_id ?? null,
    status: row.status ?? 'Active',
    createdAt: row.created_at,
  };
}

export function BeneficiariesProvider({ children }) {
  const { profile } = useAuth();
  const [beneficiaries, setBeneficiaries] = useState([]);

  useEffect(() => {
    const orgId = profile?.org_id;
    if (!orgId) { setBeneficiaries([]); return; }

    supabase
      .from('beneficiaries')
      .select('*')
      .eq('org_id', orgId)
      .order('first_name')
      .then(({ data }) => setBeneficiaries(data ? data.map(dbToBeneficiary) : []));
  }, [profile?.org_id]);

  const addBeneficiary = useCallback(async (beneficiary) => {
    const orgId = profile?.org_id;
    if (!orgId) return null;

    const tempId = `temp-${Date.now()}`;
    const optimistic = { id: tempId, status: 'Active', ...beneficiary };
    setBeneficiaries((prev) => [...prev, optimistic]);

    const { data, error } = await supabase.from('beneficiaries').insert({
      org_id: orgId,
      first_name: beneficiary.firstName,
      last_name: beneficiary.lastName || null,
      date_of_birth: beneficiary.dob || null,
      gender: beneficiary.gender || null,
      programme_id: beneficiary.programmeId || null,
      status: 'Active',
    }).select().single();

    if (data) {
      setBeneficiaries((prev) => prev.map((b) => b.id === tempId ? dbToBeneficiary(data) : b));
      return dbToBeneficiary(data);
    }

    if (error) {
      setBeneficiaries((prev) => prev.filter((b) => b.id !== tempId));
      console.error('[BeneficiariesContext] addBeneficiary error:', error.message);
    }
    return null;
  }, [profile?.org_id]);

  const value = useMemo(() => ({ beneficiaries, addBeneficiary }), [beneficiaries, addBeneficiary]);
  return <BeneficiariesContext.Provider value={value}>{children}</BeneficiariesContext.Provider>;
}

export function useBeneficiaries() {
  const ctx = useContext(BeneficiariesContext);
  if (!ctx) throw new Error('useBeneficiaries must be used inside BeneficiariesProvider');
  return ctx;
}
