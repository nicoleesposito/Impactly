import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BrandMark, ChevronRight } from '../../../components/icons.jsx';
import { supabase } from '../../../lib/supabase.js';
import { ROUTES } from '../../../constants/routes.js';
import styles from './SignIn.module.css';

export default function SignIn() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || ROUTES.home;

  const [step, setStep] = useState('email'); // 'email' | 'password'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleContinue(e) {
    e.preventDefault();
    if (!email.trim()) return;
    setError('');
    setStep('password');
  }

  async function handleLogin(e) {
    e.preventDefault();
    if (!password) return;
    setError('');
    setLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setLoading(false);

    if (signInError) {
      setError(signInError.message);
    } else {
      navigate(from, { replace: true });
    }
  }

  return (
    <div className={styles.wrap}>
      <span className={styles.logo}>
        <BrandMark />
      </span>

      <h1 className={styles.title}>Ready to make an impact?</h1>
      <p className={styles.subtitle}>Sign in to continue changing lives!</p>

      {step === 'email' ? (
        <>
          <form className={styles.form} onSubmit={handleContinue}>
            <input
              type="email"
              className={styles.input}
              placeholder="Email"
              aria-label="Email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
            />
            <button
              type="submit"
              className={`${styles.continue} ${email.trim() ? styles.continueActive : ''}`}
              disabled={!email.trim()}
            >
              Continue
            </button>
          </form>

          <Link to={ROUTES.forgotPassword} className={styles.forgot}>
            Forgot password?
          </Link>

          <div className={styles.divider}>
            <span className={styles.line} />
            <span className={styles.or}>OR</span>
            <span className={styles.line} />
          </div>

          <button type="button" className={styles.google}>
            Sign in with Google <ChevronRight />
          </button>

          <Link to={ROUTES.onboardingAccount} className={styles.create}>
            New to Impactly? <strong>Create an Account!</strong>
          </Link>
        </>
      ) : (
        <>
          <form className={styles.form} onSubmit={handleLogin}>
            <button
              type="button"
              className={styles.emailLocked}
              onClick={() => { setStep('email'); setError(''); setPassword(''); }}
              aria-label="Change email address"
            >
              <span className={styles.emailLockedText}>{email}</span>
              <span className={styles.emailChange}>Change</span>
            </button>

            <input
              type="password"
              className={styles.input}
              placeholder="Password"
              aria-label="Password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />

            {error && <p className={styles.error} role="alert">{error}</p>}

            <button
              type="submit"
              className={`${styles.continue} ${password ? styles.continueActive : ''}`}
              disabled={!password || loading}
            >
              {loading ? 'Signing in…' : 'Log in'}
            </button>
          </form>

          <Link to={ROUTES.forgotPassword} className={styles.forgot}>
            Forgot password?
          </Link>
        </>
      )}

      <p className={styles.terms}>
        By signing in you agree to the <a href="#terms">Terms And Conditions</a> and{' '}
        <a href="#privacy">Privacy Policy</a>
      </p>
    </div>
  );
}
