import { Link } from 'react-router-dom';
import StatTile from '../../../components/ui/StatTile/index.js';
import EmptyState from '../../dashboard/components/EmptyState.jsx';
import SectionCard from '../../dashboard/components/SectionCard.jsx';
import { useOrg } from '../../../context/OrgContext.jsx';
import { ROUTES } from '../../../constants/routes.js';
import { CalendarDays, Plus, BarChart } from '../../../components/icons.jsx';
import styles from './AttendanceMulti.module.css';

function todayLabel() {
  return new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

// Attendance hub (FR-008).
// Empty-state-first: arrays are empty for a new organisation and fill in as the
// user captures sessions. Wired to live Supabase queries in a later section.
const sessions = [];
const recentDays = [];

export default function AttendanceMulti() {
  const { org, beneficiaryLabel } = useOrg();
  const programmeCount = org?.programmes?.length ?? 0;
  const label = beneficiaryLabel || 'Beneficiaries';

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.heading}>
          <h1 className={styles.title}>Attendance</h1>
          <p className={styles.meta}>{todayLabel()}</p>
        </div>
        <Link to={ROUTES.attendance} className={styles.capture}>
          <Plus /> Capture
        </Link>
      </header>

      <section className={styles.stats} aria-label="Summary">
        <StatTile label="Sessions today" value={sessions.length} />
        <StatTile label="Present today" value="0" />
        <StatTile label={`${label} registered`} value="0" />
        <StatTile label="Avg attendance" value="—" />
      </section>

      <SectionCard title="Today's sessions">
        {sessions.length === 0 ? (
          <EmptyState
            icon={<CalendarDays />}
            title="No sessions captured yet"
            hint={`Tap Capture to record today's attendance across your ${programmeCount === 1 ? 'programme' : 'programmes'}.`}
          />
        ) : (
          sessions.map((s) => (
            <div key={s.id} className={styles.row}>
              <span className={styles.rowDot} style={{ background: s.color }} aria-hidden="true" />
              <span className={styles.rowLabel}>{s.programme}</span>
              <span className={styles.rowMeta}>{s.present}/{s.total}</span>
              <span
                className={`${styles.badge} ${s.rate >= 80 ? styles.good : s.rate >= 60 ? styles.warn : styles.low}`}
              >
                {s.rate}%
              </span>
            </div>
          ))
        )}
      </SectionCard>

      <SectionCard title="Recent history">
        {recentDays.length === 0 ? (
          <EmptyState
            icon={<BarChart />}
            title="No history yet"
            hint="Past sessions will appear here once you start capturing attendance."
          />
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Programme</th>
                <th>Present</th>
                <th>Rate</th>
              </tr>
            </thead>
            <tbody>
              {recentDays.map((d) => (
                <tr key={d.id}>
                  <td>{d.date}</td>
                  <td>{d.programme}</td>
                  <td>{d.present}</td>
                  <td>{d.rate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </SectionCard>
    </div>
  );
}
