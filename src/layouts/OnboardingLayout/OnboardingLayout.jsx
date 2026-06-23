import { Outlet } from 'react-router-dom';
import { OnboardingProvider } from '../../features/onboarding/OnboardingContext.jsx';
import styles from './OnboardingLayout.module.css';

// Wraps the 6-step wizard, providing shared state and a full-height single
// column so each step's footer can pin to the bottom of the viewport.
export default function OnboardingLayout() {
  return (
    <OnboardingProvider>
      <div className={styles.wrap}>
        <div className={styles.card}>
          <Outlet />
        </div>
      </div>
    </OnboardingProvider>
  );
}
