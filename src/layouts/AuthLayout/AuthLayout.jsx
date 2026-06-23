import { Outlet } from 'react-router-dom';
import styles from './AuthLayout.module.css';

// Centered, single-column layout for sign-in / recovery (PRD: max ~480px).
export default function AuthLayout() {
  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <Outlet />
      </div>
    </div>
  );
}
