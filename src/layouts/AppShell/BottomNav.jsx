import { NavLink } from 'react-router-dom';
import { ROUTES } from '../../constants/routes.js';
import styles from './BottomNav.module.css';

// Mobile bottom navigation (MVP-019). Attendance is a centered, elevated FAB.
const ITEMS = [
  { to: ROUTES.home, label: 'Home', icon: '\u{1F3E0}' },
  { to: ROUTES.students, label: 'Students', icon: '\u{1F465}' },
  { to: ROUTES.attendance, label: 'Attendance', icon: '✅', fab: true },
  { to: ROUTES.reports, label: 'Reports', icon: '\u{1F4C4}' },
  { to: ROUTES.more, label: 'More', icon: '…' },
];

export default function BottomNav() {
  return (
    <nav className={styles.nav} aria-label="Primary">
      {ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            [styles.item, item.fab ? styles.fab : '', isActive ? styles.active : '']
              .filter(Boolean)
              .join(' ')
          }
        >
          <span className={styles.icon} aria-hidden="true">
            {item.icon}
          </span>
          <span className={styles.label}>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
