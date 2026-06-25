import styles from './EmptyState.module.css';

// Friendly placeholder shown inside dashboard cards before any data exists.
// Replaced by real rows as the user builds out their organisation.
export default function EmptyState({ icon, title, hint }) {
  return (
    <div className={styles.empty}>
      <span className={styles.icon} aria-hidden="true">
        {icon}
      </span>
      <p className={styles.title}>{title}</p>
      {hint && <p className={styles.hint}>{hint}</p>}
    </div>
  );
}
