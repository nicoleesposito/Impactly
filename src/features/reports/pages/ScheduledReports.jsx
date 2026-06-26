import { useNavigate } from 'react-router-dom';
import EmptyState from '../../dashboard/components/EmptyState.jsx';
import { ChevronLeft, CalendarDays } from '../../../components/icons.jsx';
import styles from './ScheduledReports.module.css';

// Scheduled reports (PDF p.22 reference).
// Lists reports that have been scheduled to run automatically.
// Empty for a new organisation; wired to Supabase in a later section.
const scheduled = [];

export default function ScheduledReports() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button type="button" className={styles.back} onClick={() => navigate(-1)} aria-label="Back">
          <ChevronLeft size={24} />
        </button>
        <h1 className={styles.title}>Scheduled reports</h1>
        <button type="button" className={styles.add}>+ Schedule</button>
      </header>

      {scheduled.length === 0 ? (
        <EmptyState
          icon={<CalendarDays />}
          title="No scheduled reports"
          hint="Schedule reports to run automatically and be delivered to funders or your team."
        />
      ) : (
        <ul className={styles.list}>
          {scheduled.map((r) => (
            <li key={r.id} className={styles.card}>
              <div className={styles.cardTop}>
                <span className={styles.cardTitle}>{r.title}</span>
                <span className={styles.frequency}>{r.frequency}</span>
              </div>
              {r.nextRun && <p className={styles.cardSub}>Next: {r.nextRun}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
