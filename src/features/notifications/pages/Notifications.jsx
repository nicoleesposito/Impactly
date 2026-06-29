import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../../context/NotificationsContext.jsx';
import { ChevronLeft } from '../../../components/icons.jsx';
import styles from './Notifications.module.css';

const AVATAR_COLORS = ['#9C2B2E', '#4F6D7A', '#7A4F9C', '#2E7D5B', '#B5762B'];

function avatarColor(name = '') {
  let sum = 0;
  for (const ch of name) sum += ch.charCodeAt(0);
  return AVATAR_COLORS[sum % AVATAR_COLORS.length];
}

function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || '?';
}

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function Notifications() {
  const navigate = useNavigate();
  const { notifications, clearAll, markAllRead } = useNotifications();

  function handleClearAll() {
    clearAll();
  }

  // Mark all read when page is opened
  markAllRead();

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button type="button" className={styles.back} onClick={() => navigate(-1)} aria-label="Back">
          <ChevronLeft size={24} />
        </button>
        <h1 className={styles.title}>Notifications</h1>
        {notifications.length > 0 && (
          <button type="button" className={styles.clearAll} onClick={handleClearAll}>
            Clear all
          </button>
        )}
      </header>

      {notifications.length === 0 ? (
        <p className={styles.empty}>No notifications</p>
      ) : (
        <ul className={styles.list}>
          {notifications.map((n) => (
            <li key={n.id} className={`${styles.item} ${!n.read ? styles.unread : ''}`}>
              <span
                className={styles.avatar}
                style={{ background: avatarColor(n.actorName) }}
                aria-hidden="true"
              >
                {initials(n.actorName)}
              </span>
              <div className={styles.body}>
                <div className={styles.actor}>
                  <span className={styles.actorName}>{n.actorName}</span>
                  <span className={styles.time}>{timeAgo(n.createdAt)}</span>
                </div>
                <p className={styles.actorSub}>
                  {[n.actorRole, n.actorProgramme].filter(Boolean).join(' · ')}
                </p>
                <p className={styles.action}>{n.action}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
