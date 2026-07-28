import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StepProgress from '../components/StepProgress.jsx';
import { Check } from '../../../components/icons.jsx';
import { useOnboarding } from '../OnboardingContext.jsx';
import { useAuth } from '../../../context/AuthContext.jsx';
import { supabase } from '../../../lib/supabase.js';
import { ROUTES } from '../../../constants/routes.js';
import styles from './Step6Confirmation.module.css';

// Same bucket BeneficiariesContext uploads story/profile photos to.
async function uploadPhoto(file) {
  const ext = file.name.split('.').pop();
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from('beneficiary-images').upload(path, file);
  if (error) {
    console.error('[Step6Confirmation] photo upload failed:', error.message);
    return null;
  }
  const { data: pub } = supabase.storage.from('beneficiary-images').getPublicUrl(path);
  return pub.publicUrl;
}

export default function Step6Confirmation() {
  const navigate = useNavigate();
  const { data, reset } = useOnboarding();
  const { session, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailPending, setEmailPending] = useState(false);
  const [readyToEnter, setReadyToEnter] = useState(false);

  // ProtectedRoute gates /home on AuthContext's own session state, which
  // updates asynchronously via its own onAuthStateChange subscription —
  // separate from the local session signUp() just returned below. Navigating
  // immediately after signUp() resolves races that update: if AuthContext
  // hasn't caught up yet, ProtectedRoute sees session === null and bounces
  // to sign-in even though the account was created successfully. Waiting
  // here for AuthContext's session to actually be populated closes that gap.
  useEffect(() => {
    if (readyToEnter && session) {
      navigate(ROUTES.home, { replace: true });
    }
  }, [readyToEnter, session, navigate]);

  const checklist = [
    'Organisation profile created',
    data.template ? 'Template applied' : null,
    data.beneficiaries.length > 0
      ? `${data.beneficiaries.length} ${data.beneficiaries.length === 1 ? 'beneficiary' : 'beneficiaries'} added`
      : null,
    data.team.length > 0
      ? `${data.team.length} team ${data.team.length === 1 ? 'member' : 'members'} invited`
      : null,
  ].filter(Boolean);

  async function createOrgAndSeed(orgId) {
    if (data.beneficiaries.length > 0) {
      const { data: inserted, error } = await supabase.from('beneficiaries').insert(
        data.beneficiaries.map((b) => ({
          org_id: orgId,
          first_name: b.firstName || b.name || 'Unknown',
          last_name: b.lastName || null,
          // date_of_birth is optional here — an empty string (the field's
          // default when left blank) is not valid input for a Postgres
          // date column and would fail this whole multi-row insert.
          date_of_birth: b.dob || null,
          gender: b.gender || null,
        })),
      ).select('id');

      if (error) {
        console.error('[Step6Confirmation] seeding beneficiaries failed:', error.message);
      } else {
        // Photo files only survive in memory for this tab (OnboardingContext
        // persists everything else to sessionStorage as JSON, which drops
        // File objects) — upload them now that rows actually exist. A plain
        // multi-row INSERT ... RETURNING with no upsert/trigger involved
        // preserves VALUES-list order, so matching rows back to the original
        // entries positionally is safe.
        await Promise.all(
          data.beneficiaries.map(async (b, i) => {
            if (!(b.photoFile instanceof File)) return;
            const row = inserted?.[i];
            if (!row) return;
            const photoUrl = await uploadPhoto(b.photoFile);
            if (!photoUrl) return;
            const { error: photoErr } = await supabase
              .from('beneficiaries')
              .update({ photo_url: photoUrl })
              .eq('id', row.id);
            if (photoErr) console.error('[Step6Confirmation] photo attach failed:', photoErr.message);
          }),
        );
      }
    }

    if (data.team.length > 0) {
      // Step5Team.jsx only collects an access level (admin/manager/staff),
      // stored on each entry as `role` — it's the same 'admin'/'manager'/
      // 'staff' key InviteStaff.jsx's standalone flow stores directly into
      // access_level. There's no separate free-text job-title role from
      // onboarding, so that column is left null here.
      const { error } = await supabase.from('staff_invites').insert(
        data.team.map((m) => ({
          org_id: orgId,
          email: m.email,
          access_level: m.role || 'staff',
          role: null,
        })),
      );
      if (error) console.error('[Step6Confirmation] seeding team invites failed:', error.message);
    }
  }

  async function handleGoToToday() {
    setError('');
    setLoading(true);

    // 1. Create auth user
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: data.account.email,
      password: data.account.password,
      options: {
        data: {
          first_name: data.account.firstName,
          last_name: data.account.lastName,
        },
      },
    });

    if (signUpError) {
      setLoading(false);
      setError(signUpError.message);
      return;
    }

    if (authData.session) {
      // Email confirmation disabled — session is live; create org now.
      const { data: orgId, error: orgError } = await supabase.rpc('create_organisation', {
        p_name: data.organisation.name,
        p_type: data.organisation.type || null,
        p_country: data.organisation.country || null,
        p_size: data.organisation.size || null,
        p_beneficiary_label: data.organisation.beneficiaryLabel || 'Students',
      });

      if (orgError) {
        setLoading(false);
        setError(orgError.message);
        return;
      }

      await createOrgAndSeed(orgId);
      // Reload profile so OrgContext picks up the new org_id
      await refreshProfile();

      reset();
      setLoading(false);
      setReadyToEnter(true);
    } else {
      // Email confirmation enabled — save org details for post-confirmation setup.
      sessionStorage.setItem('impactly-pending-org', JSON.stringify({
        name: data.organisation.name,
        type: data.organisation.type,
        country: data.organisation.country,
        size: data.organisation.size,
        beneficiaryLabel: data.organisation.beneficiaryLabel || 'Students',
        beneficiaries: data.beneficiaries,
        team: data.team,
      }));
      reset();
      setLoading(false);
      setEmailPending(true);
    }
  }

  if (emailPending) {
    return (
      <div className={styles.shell}>
        <StepProgress step={6} />
        <div className={styles.body}>
          <span className={styles.badge} aria-hidden="true">
            <Check size={36} />
          </span>
          <h1 className={styles.title}>Check your email</h1>
          <p className={styles.subtitle}>
            We&rsquo;ve sent a confirmation link to{' '}
            <strong>{data.account.email}</strong>. Click it to activate your
            account and sign in.
          </p>
          <button
            type="button"
            className={styles.cta}
            onClick={() => navigate(ROUTES.signIn)}
          >
            Go to sign in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.shell}>
      <StepProgress step={6} />

      <div className={styles.body}>
        <span className={styles.badge} aria-hidden="true">
          <Check size={36} />
        </span>
        <h1 className={styles.title}>Your organisation is ready</h1>
        <p className={styles.subtitle}>Here&rsquo;s what we&rsquo;ve set up</p>

        <ul className={styles.checklist}>
          {checklist.map((item) => (
            <li key={item} className={styles.item}>
              <span className={styles.check} aria-hidden="true">
                <Check />
              </span>
              {item}
            </li>
          ))}
        </ul>

        <div className={styles.taskCard}>
          <p className={styles.taskTitle}>Your first task is waiting</p>
          <p className={styles.taskHint}>Capture today&rsquo;s attendance</p>
          {error && <p className={styles.ctaError}>{error}</p>}
          <button
            type="button"
            className={styles.cta}
            onClick={handleGoToToday}
            disabled={loading}
          >
            {loading ? 'Setting up…' : 'Go to today'}
          </button>
        </div>
      </div>
    </div>
  );
}
