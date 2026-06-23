import styles from './TopBar.module.css';

// Wordmark · notification bell · user avatar (see Figma header on every screen).
export default function TopBar() {
  return (
    <header className={styles.bar}>
      <span className={styles.wordmark}>Impactly</span>
      <div className={styles.actions}>
        <button type="button" className={styles.iconBtn} aria-label="Notifications">
          {'\u{1F514}'}
        </button>
        <span className={styles.avatar} aria-hidden="true">
          SSD
        </span>
      </div>
    </header>
  );
}
