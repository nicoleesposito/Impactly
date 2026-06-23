import styles from './StatTile.module.css';

// Summary stat tile used across dashboards and list headers (small label + value).
export default function StatTile({ label, value }) {
  return (
    <div className={styles.tile}>
      <p className={styles.label}>{label}</p>
      <p className={styles.value}>{value}</p>
    </div>
  );
}
