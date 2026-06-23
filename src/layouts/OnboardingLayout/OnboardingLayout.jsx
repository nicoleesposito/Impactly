import { Outlet } from 'react-router-dom';
import styles from './OnboardingLayout.module.css';

// Wraps the 6-step onboarding wizard. The step progress indicator is rendered
// per-step for now; a shared progress bar can hoist here in the onboarding section.
export default function OnboardingLayout() {
  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <Outlet />
      </div>
    </div>
  );
}
