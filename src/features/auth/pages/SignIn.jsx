import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BrandMark, ChevronRight } from '../../../components/icons.jsx';
import { ROUTES } from '../../../constants/routes.js';
import styles from './SignIn.module.css';

// Sign in (FR-001): email/username + Google OAuth. Auth wiring lands in the
// auth/backend section; this is the visual + navigation shell.
export default function SignIn() {
  const [identifier, setIdentifier] = useState('');
  const canContinue = identifier.trim().length > 0;

  function handleSubmit(e) {
    e.preventDefault();
    // TODO(auth): supabase.auth.signInWithPassword — wired in the auth section.
  }

  return (
    <div className={styles.wrap}>
      <span className={styles.logo}>
        <BrandMark />
      </span>

      <h1 className={styles.title}>Ready to make an impact?</h1>
      <p className={styles.subtitle}>Sign in to continue changing lives!</p>

      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          className={styles.input}
          placeholder="Email or username"
          aria-label="Email or username"
          autoComplete="username"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
        />
        <button
          type="submit"
          className={`${styles.continue} ${canContinue ? styles.continueActive : ''}`}
          disabled={!canContinue}
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

      <p className={styles.terms}>
        By signing up you agree to the <a href="#terms">Terms And Conditions</a> and{' '}
        <a href="#privacy">Privacy Policy</a>
      </p>
    </div>
  );
}
