import StatTile from '../../../components/ui/StatTile/index.js';
import styles from './Today.module.css';

// Today dashboard (FR-003). Static placeholders here; wired to live data in a
// later section (StatGrid, RecentActivity, UpcomingTasks, AttendanceSummary).
export default function Today() {
  return (
    <div className={styles.page}>
      <header>
        <h1 className={styles.greeting}>Hello, Sandy</h1>
        <p className={styles.meta}>Tebelo · 5 programmes · Today</p>
      </header>

      <section className={styles.stats} aria-label="Summary">
        <StatTile label="Active programs" value="5" />
        <StatTile label="Present today" value="298" />
        <StatTile label="Total beneficiaries" value="341" />
        <StatTile label="Reports due" value="3" />
      </section>
    </div>
  );
}
