import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OnboardingShell from '../components/OnboardingShell.jsx';
import WizardFooter from '../components/WizardFooter.jsx';
import TextField from '../../../components/ui/TextField/index.js';
import { useOnboarding } from '../OnboardingContext.jsx';
import { ROUTES } from '../../../constants/routes.js';
import { supabase } from '../../../lib/supabase.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EMAIL_TAKEN_MESSAGE = 'An account with this email already exists. Sign in instead.';

export default function Step1Account() {
  const navigate = useNavigate();
  const { data, setAccount } = useOnboarding();
  const account = data.account;
  const [errors, setErrors] = useState({});
  const [checkingEmail, setCheckingEmail] = useState(false);

  const update = (field) => (e) => setAccount({ [field]: e.target.value });

  function updateEmail(e) {
    setAccount({ email: e.target.value });
    // A previously-flagged "already registered" error refers to the old
    // value — clear it so it doesn't linger once the user starts editing.
    setErrors((prev) => (prev.email ? { ...prev, email: undefined } : prev));
  }

  function validate() {
    const next = {};
    if (!account.firstName.trim()) next.firstName = 'Please enter your first name';
    if (!account.lastName.trim()) next.lastName = 'Please enter your last name';
    if (!EMAIL_RE.test(account.email)) next.email = 'Please enter a valid email address';
    if (account.password.length < 8)
      next.password = 'Password must be at least 8 characters';
    if (account.confirmPassword !== account.password)
      next.confirmPassword = "Passwords don't match";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  // Read-only check against auth.users via a security-definer RPC (email_available,
  // migration 0016) — lets duplicate emails surface here instead of only at Step 6's
  // signUp() call, after the whole wizard has been filled out. Fails open: if the
  // check itself errors (network, RPC not deployed yet), we don't block onboarding —
  // signUp() at Step 6 remains the final safety net either way.
  async function checkEmailAvailable(email) {
    setCheckingEmail(true);
    const { data: available, error } = await supabase.rpc('email_available', { p_email: email });
    setCheckingEmail(false);
    if (error) {
      console.error('[Step1Account] email availability check failed:', error.message);
      return true;
    }
    return available !== false;
  }

  async function handleEmailBlur() {
    const email = account.email.trim();
    if (!EMAIL_RE.test(email)) return;
    const available = await checkEmailAvailable(email);
    if (!available) {
      setErrors((prev) => ({ ...prev, email: EMAIL_TAKEN_MESSAGE }));
    }
  }

  async function handleContinue() {
    if (!validate()) return;
    const available = await checkEmailAvailable(account.email.trim());
    if (!available) {
      setErrors((prev) => ({ ...prev, email: EMAIL_TAKEN_MESSAGE }));
      return;
    }
    navigate(ROUTES.onboardingOrganisation);
  }

  return (
    <OnboardingShell
      step={1}
      label="Create account"
      title="Create your account"
      subtitle="Up and running in under 30 minutes - no IT support needed"
      footer={
        <WizardFooter
          onBack={() => navigate(ROUTES.signIn)}
          onContinue={handleContinue}
          continueLabel={checkingEmail ? 'Checking…' : 'Continue'}
          continueDisabled={checkingEmail}
        />
      }
      below={
        <>
          Already have an account? <Link to={ROUTES.signIn}>Log in!</Link>
        </>
      }
    >
      <TextField
        label="First name"
        value={account.firstName}
        onChange={update('firstName')}
        error={errors.firstName}
        autoComplete="given-name"
      />
      <TextField
        label="Last name"
        value={account.lastName}
        onChange={update('lastName')}
        error={errors.lastName}
        autoComplete="family-name"
      />
      <TextField
        label="Email"
        type="email"
        value={account.email}
        onChange={updateEmail}
        onBlur={handleEmailBlur}
        error={errors.email}
        autoComplete="email"
      />
      <TextField
        label="Password"
        type="password"
        value={account.password}
        onChange={update('password')}
        error={errors.password}
        hint="Must be at least 8 characters"
        autoComplete="new-password"
      />
      <TextField
        label="Confirm password"
        type="password"
        value={account.confirmPassword}
        onChange={update('confirmPassword')}
        error={errors.confirmPassword}
        autoComplete="new-password"
      />
    </OnboardingShell>
  );
}
