import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNotifications } from '../../context/NotificationsContext.jsx';
import { Bell } from '../../components/icons.jsx';
import { ROUTES } from '../../constants/routes.js';
import styles from './TopBar.module.css';

export default function TopBar() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { unreadCount } = useNotifications();

  const displayName =
    user?.user_metadata?.first_name
      ? `${user.user_metadata.first_name} ${user.user_metadata.last_name ?? ''}`.trim()
      : user?.email ?? '';

  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || '?';

  return (
    <header className={styles.bar}>
      <span className={styles.wordmark}>Impactly</span>
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.iconBtn}
          aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
          onClick={() => navigate(ROUTES.notifications)}
        >
          <Bell size={22} />
          {unreadCount > 0 && (
            <span className={styles.badge} aria-hidden="true">{unreadCount}</span>
          )}
        </button>
        <span className={styles.avatar} aria-hidden="true">{initials}</span>
      </div>
    </header>
  );
}
