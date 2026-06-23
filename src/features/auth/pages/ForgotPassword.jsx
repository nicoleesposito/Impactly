import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from '../../../components/icons.jsx';
import { ROUTES } from '../../../constants/routes.js';
import styles from './ForgotPassword.module.css';

// Password recovery (FR-001). Sends a reset email — wired in the auth section
// via supabase.auth.resetPasswordForEmail.
export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (email.trim()) setSent(true); // TODO(auth): trigger reset email
  }

  return (
    <div className={styles.wrap}>
      <Link to={ROUTES.signIn} className={styles.back}>
        <ChevronLeft /> Back to sign in
      </Link>

      <h1 className={styles.title}>Reset your password</h1>
      <p className={styles.subtitle}>
        Enter your email and we&rsquo;ll send you a link to reset your password.
      </p>

      {sent ? (
        <p className={styles.sent} role="status">
          If an account exists for <strong>{email}</strong>, a reset link is on its way.
        </p>
      ) : (
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            type="email"
            className={styles.input}
            placeholder="Email"
            aria-label="Email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit" className={styles.submit} disabled={!email.trim()}>
            Send reset link
          </button>
        </form>
      )}
    </div>
  );
}
