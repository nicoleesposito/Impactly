import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StepProgress from '../components/StepProgress.jsx';
import { Check } from '../../../components/icons.jsx';
import { useOnboarding } from '../OnboardingContext.jsx';
import { useOrg } from '../../../context/OrgContext.jsx';
import { supabase } from '../../../lib/supabase.js';
import { ROUTES } from '../../../constants/routes.js';
import styles from './Step6Confirmation.module.css';

export default function Step6Confirmation() {
  const navigate = useNavigate();
  const { data, reset } = useOnboarding();
  const { setOrg } = useOrg();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailPending, setEmailPending] = useState(false);

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

  async function handleGoToToday() {
    setError('');
    setLoading(true);

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

    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    // Seed OrgContext with the organisation details from onboarding so
    // settings pages and the More tab are pre-filled immediately.
    setOrg({
      name: data.organisation.name,
      type: data.organisation.type,
      country: data.organisation.country,
      size: data.organisation.size,
      beneficiaryLabel: data.organisation.beneficiaryLabel || 'Students',
      programmes: [],
      // TODO(org): persist to Supabase organisations table and load on next sign-in.
    });

    reset();

    if (authData.session) {
      // Email confirmation disabled — signed in immediately
      navigate(ROUTES.home);
    } else {
      // Email confirmation enabled — ask user to verify before proceeding
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
