import { Link } from 'react-router-dom';
import Button from '../../../components/ui/Button/index.js';
import GoogleButton from '../components/GoogleButton.jsx';
import { ROUTES } from '../../../constants/routes.js';
import styles from './SignIn.module.css';

// Sign in (FR-001): email/password + Google OAuth. Logic wired in the auth section.
export default function SignIn() {
  return (
    <div className={styles.wrap}>
      <h1 className={styles.title}>Ready to make an impact?</h1>
      <p className={styles.subtitle}>Sign in to continue changing lives!</p>

      <form className={styles.form}>
        <label className={styles.label} htmlFor="email">
          Email or username
        </label>
        <input id="email" type="text" className={styles.input} autoComplete="username" />

        <Button type="submit" fullWidth>
          Continue
        </Button>
      </form>

      <Link to={ROUTES.forgotPassword} className={styles.forgot}>
        Forgot password?
      </Link>

      <div className={styles.divider}>OR</div>

      <GoogleButton />

      <p className={styles.signup}>
        New to Impactly? <Link to={ROUTES.onboardingAccount}>Create an Account!</Link>
      </p>
    </div>
  );
}
