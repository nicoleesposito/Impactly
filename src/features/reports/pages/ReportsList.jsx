import { Link } from 'react-router-dom';
import StatTile from '../../../components/ui/StatTile/index.js';
import EmptyState from '../../dashboard/components/EmptyState.jsx';
import SectionCard from '../../dashboard/components/SectionCard.jsx';
import { ROUTES } from '../../../constants/routes.js';
import { FileText, CalendarDays, Plus } from '../../../components/icons.jsx';
import styles from './ReportsList.module.css';

// Reports hub (FR-010).
// Empty-state-first: arrays are empty for a new organisation and fill in as the
// user creates and schedules reports. Wired to live Supabase queries later.
const reports = [];
const scheduled = [];

export default function ReportsList() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.heading}>
          <h1 className={styles.title}>Reports</h1>
          <p className={styles.meta}>{reports.length} total</p>
        </div>
        <Link to={ROUTES.reportBuilder.replace(':id', 'new')} className={styles.create}>
          <Plus /> New report
        </Link>
      </header>

      <section className={styles.stats} aria-label="Summary">
        <StatTile label="Total reports" value={reports.length} />
        <StatTile label="Drafts" value={reports.filter((r) => r.status === 'draft').length} />
        <StatTile label="Submitted" value={reports.filter((r) => r.status === 'submitted').length} />
        <StatTile label="Scheduled" value={scheduled.length} />
      </section>

      <SectionCard
        title="All reports"
        action={
          reports.length > 0 && (
            <Link to={ROUTES.reportsScheduled} className={styles.viewAll}>
              View scheduled
            </Link>
          )
        }
      >
        {reports.length === 0 ? (
          <EmptyState
            icon={<FileText />}
            title="No reports yet"
            hint="Create your first report to start tracking and sharing your organisation's impact."
          />
        ) : (
          reports.map((r) => (
            <Link key={r.id} to={ROUTES.reportBuilder.replace(':id', r.id)} className={styles.row}>
              <span className={styles.rowIcon}>
                <FileText />
              </span>
              <span className={styles.rowText}>
                <span className={styles.rowName}>{r.title}</span>
                <span className={styles.rowSub}>{r.programme}</span>
              </span>
              <span className={`${styles.status} ${styles[r.status]}`}>{r.status}</span>
            </Link>
          ))
        )}
      </SectionCard>

      <SectionCard title="Scheduled reports">
        {scheduled.length === 0 ? (
          <EmptyState
            icon={<CalendarDays />}
            title="No scheduled reports"
            hint="Set up automated reports to be generated and sent on a recurring basis."
          />
        ) : (
          scheduled.map((s) => (
            <div key={s.id} className={styles.row}>
              <span className={styles.rowIcon}>
                <CalendarDays />
              </span>
              <span className={styles.rowText}>
                <span className={styles.rowName}>{s.title}</span>
                <span className={styles.rowSub}>Next: {s.nextRun}</span>
              </span>
              <span className={styles.rowMeta}>{s.frequency}</span>
            </div>
          ))
        )}
      </SectionCard>
    </div>
  );
}
