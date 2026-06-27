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
    address: row.address ?? '',
    idNumber: row.id_number ?? '',
    emergencyContactName: row.emergency_contact_name ?? '',
    emergencyContactDob: row.emergency_contact_dob ?? '',
    emergencyContactRelation: row.emergency_contact_relation ?? '',
    documentUrls: row.document_urls ?? [],
    storyImageUrls: row.story_image_urls ?? [],
    storyQuotes: row.story_quotes ?? '',
    programmeId: row.programme_id ?? null,
    status: row.status ?? 'Active',
    createdAt: row.created_at,
  };
}

// Upload a single file to a Supabase Storage bucket.
// Returns the public URL, or null on failure.
async function uploadFile(bucket, file) {
  const ext = file.name.split('.').pop();
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file);
  if (error) {
    console.error(`[BeneficiariesContext] upload to ${bucket} failed:`, error.message);
    return null;
  }
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
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

    // Upload files before inserting the record
    const docUrls = await Promise.all(
      (beneficiary.documentFiles ?? []).map((f) => uploadFile('beneficiary-docs', f)),
    ).then((urls) => urls.filter(Boolean));

    const imageUrls = await Promise.all(
      (beneficiary.storyImageFiles ?? []).map((f) => uploadFile('beneficiary-images', f)),
    ).then((urls) => urls.filter(Boolean));

    const tempId = `temp-${Date.now()}`;
    const optimistic = {
      id: tempId,
      status: 'Active',
      documentUrls: docUrls,
      storyImageUrls: imageUrls,
      ...beneficiary,
    };
    setBeneficiaries((prev) => [...prev, optimistic]);

    const { data, error } = await supabase.from('beneficiaries').insert({
      org_id: orgId,
      first_name: beneficiary.firstName,
      last_name: beneficiary.lastName || null,
      date_of_birth: beneficiary.dob || null,
      gender: beneficiary.gender || null,
      address: beneficiary.address || null,
      id_number: beneficiary.idNumber || null,
      emergency_contact_name: beneficiary.emergencyContactName || null,
      emergency_contact_dob: beneficiary.emergencyContactDob || null,
      emergency_contact_relation: beneficiary.emergencyContactRelation || null,
      document_urls: docUrls,
      story_image_urls: imageUrls,
      story_quotes: beneficiary.storyQuotes || null,
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

  // Upload new images, merge with existing URLs, and persist to Supabase.
  const addStoryImages = useCallback(async (beneficiaryId, newFiles) => {
    if (!newFiles?.length) return;

    const uploaded = await Promise.all(
      newFiles.map((f) => uploadFile('beneficiary-images', f)),
    ).then((urls) => urls.filter(Boolean));

    if (!uploaded.length) return;

    // Merge with the beneficiary's current URLs
    const current = beneficiaries.find((b) => b.id === beneficiaryId);
    const merged = [...(current?.storyImageUrls ?? []), ...uploaded];

    // Optimistic update
    setBeneficiaries((prev) =>
      prev.map((b) => b.id === beneficiaryId ? { ...b, storyImageUrls: merged } : b),
    );

    const { data, error } = await supabase
      .from('beneficiaries')
      .update({ story_image_urls: merged })
      .eq('id', beneficiaryId)
      .select()
      .single();

    if (data) {
      setBeneficiaries((prev) =>
        prev.map((b) => b.id === beneficiaryId ? dbToBeneficiary(data) : b),
      );
    }
    if (error) {
      console.error('[BeneficiariesContext] addStoryImages error:', error.message);
    }
  }, [beneficiaries]);

  const value = useMemo(
    () => ({ beneficiaries, addBeneficiary, addStoryImages }),
    [beneficiaries, addBeneficiary, addStoryImages],
  );
  return <BeneficiariesContext.Provider value={value}>{children}</BeneficiariesContext.Provider>;
}

export function useBeneficiaries() {
  const ctx = useContext(BeneficiariesContext);
  if (!ctx) throw new Error('useBeneficiaries must be used inside BeneficiariesProvider');
  return ctx;
}
