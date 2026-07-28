import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OnboardingShell from '../components/OnboardingShell.jsx';
import WizardFooter from '../components/WizardFooter.jsx';
import TextField from '../../../components/ui/TextField/index.js';
import { useOnboarding } from '../OnboardingContext.jsx';
import { ROUTES } from '../../../constants/routes.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Step1Account() {
  const navigate = useNavigate();
  const { data, setAccount } = useOnboarding();
  const account = data.account;
  const [errors, setErrors] = useState({});

  const update = (field) => (e) => setAccount({ [field]: e.target.value });

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

  function handleContinue() {
    if (validate()) navigate(ROUTES.onboardingOrganisation);
  }

  return (
    <OnboardingShell
      step={1}
      label="Create account"
      title="Create your account"
      subtitle="Up and running in under 30 minutes - no IT support needed"
      footer={
        <WizardFooter onBack={() => navigate(ROUTES.signIn)} onContinue={handleContinue} />
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
        onChange={update('email')}
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
