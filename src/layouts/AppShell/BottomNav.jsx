import { NavLink } from 'react-router-dom';
import { ROUTES } from '../../constants/routes.js';
import { Home, Users, ClipboardCheck, FileText, MoreHorizontal } from '../../components/icons.jsx';
import styles from './BottomNav.module.css';

const ITEMS = [
  { to: ROUTES.home,       label: 'Home',       Icon: Home },
  { to: ROUTES.students,   label: 'Students',   Icon: Users },
  { to: ROUTES.attendance, label: 'Attendance', Icon: ClipboardCheck, fab: true },
  { to: ROUTES.reports,    label: 'Reports',    Icon: FileText },
  { to: ROUTES.more,       label: 'More',       Icon: MoreHorizontal },
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
            <item.Icon size={item.fab ? 26 : 22} />
          </span>
          <span className={styles.label}>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
