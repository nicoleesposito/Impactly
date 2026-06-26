import { Link } from 'react-router-dom';
import StatTile from '../../../components/ui/StatTile/index.js';
import SectionCard from '../components/SectionCard.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { useAuth } from '../../../context/AuthContext.jsx';
import { useOrg } from '../../../context/OrgContext.jsx';
import { useProgrammeFilter } from '../../../context/ProgrammeFilterContext.jsx';
import { ROUTES } from '../../../constants/routes.js';
import { ArrowRight, FileText, CalendarDays, BarChart } from '../../../components/icons.jsx';
import styles from './Today.module.css';

// Today dashboard / home (FR-003).
//
// This is the "start from scratch" state: structure in place, no data yet.
// Each section is driven by an array that's empty for a fresh organisation and
// fills in as the user adds programmes, reports, tasks and attendance — at which
// point the rows below replace the empty states automatically. These arrays are
// wired to live Supabase queries in a later section.
const reports = [];
const tasks = [];
const attendance = [];

function todayLabel() {
  return new Date().toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export default function Today() {
  const { user } = useAuth();
  const { org } = useOrg();
  const { activeProgramme } = useProgrammeFilter();

  const firstName =
    user?.user_metadata?.first_name || user?.user_metadata?.full_name?.split(' ')[0] || 'there';
  const programmeCount = org?.programmes?.length ?? 0;

  const activeProgrammeName = activeProgramme !== 'all'
    ? (org?.programmes?.find((p) => p.id === activeProgramme)?.name ?? null)
    : null;

  const metaParts = [
    org?.name,
    activeProgrammeName
      ? activeProgrammeName
      : `${programmeCount} ${programmeCount === 1 ? 'programme' : 'programmes'}`,
    todayLabel(),
  ].filter(Boolean);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.heading}>
          <h1 className={styles.greeting}>Hello, {firstName}</h1>
          <p className={styles.meta}>{metaParts.join(' · ')}</p>
        </div>
        <Link to={ROUTES.attendance} className={styles.capture}>
          Capture attendance <ArrowRight />
        </Link>
      </header>

      <section className={styles.stats} aria-label="Summary">
        <StatTile label="Active programs" value={programmeCount} />
        <StatTile label="Present today" value="0" />
        <StatTile label="Total beneficiaries" value="0" />
        <StatTile label="Reports due" value="0" />
      </section>

      <SectionCard
        title="Recent report activity"
        action={reports.length > 0 && <ViewAll to={ROUTES.reports} />}
      >
        {reports.length === 0 ? (
          <EmptyState
            icon={<FileText />}
            title="No reports yet"
            hint="Reports you create will appear here."
          />
        ) : (
          reports.map((r) => (
            <div key={r.id} className={styles.row}>
              <span className={styles.rowIcon}>
                <FileText />
              </span>
              <span className={styles.rowLabel}>{r.title}</span>
              <span className={styles.rowMeta}>{r.status}</span>
            </div>
          ))
        )}
      </SectionCard>

      <SectionCard
        title="Upcoming tasks & reminders"
        action={tasks.length > 0 && <ViewAll to={ROUTES.home} />}
      >
        {tasks.length === 0 ? (
          <EmptyState
            icon={<CalendarDays />}
            title="No tasks yet"
            hint="Add tasks and reminders to stay on track."
          />
        ) : (
          tasks.map((t) => (
            <div key={t.id} className={styles.row}>
              <span className={styles.rowIcon}>
                <CalendarDays />
              </span>
              <span className={styles.rowLabel}>{t.title}</span>
              <span className={styles.rowMeta}>{t.due}</span>
            </div>
          ))
        )}
      </SectionCard>

      <SectionCard
        title="Daily attendance summary"
        action={attendance.length > 0 && <ViewAll to={ROUTES.attendance} />}
      >
        {attendance.length === 0 ? (
          <EmptyState
            icon={<BarChart />}
            title="No attendance recorded"
            hint="Capture attendance to see today's summary by programme."
          />
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Programme</th>
                <th>Expected</th>
                <th>Present</th>
                <th>Attendance</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((a) => (
                <tr key={a.id}>
                  <td>{a.programme}</td>
                  <td>{a.expected}</td>
                  <td>{a.present}</td>
                  <td>{a.rate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </SectionCard>
    </div>
  );
}

function ViewAll({ to }) {
  return (
    <Link to={to} className={styles.viewAll}>
      View all
    </Link>
  );
}
