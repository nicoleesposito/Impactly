import styles from './SectionCard.module.css';

// Dashboard section card: title + optional "View all" action + body.
// Used by Recent report activity, Upcoming tasks, and Daily attendance summary.
export default function SectionCard({ title, action, children }) {
  return (
    <section className={styles.card}>
      <header className={styles.head}>
        <h2 className={styles.title}>{title}</h2>
        {action}
      </header>
      <div className={styles.body}>{children}</div>
    </section>
  );
}
