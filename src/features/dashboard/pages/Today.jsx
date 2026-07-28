import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import StatTile from '../../../components/ui/StatTile/index.js';
import SectionCard from '../components/SectionCard.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { useAuth } from '../../../context/AuthContext.jsx';
import { useOrg } from '../../../context/OrgContext.jsx';
import { useBeneficiaries } from '../../../context/BeneficiariesContext.jsx';
import { useReports } from '../../../context/ReportsContext.jsx';
import { useProgrammeFilter } from '../../../context/ProgrammeFilterContext.jsx';
import { supabase } from '../../../lib/supabase.js';
import { ROUTES } from '../../../constants/routes.js';
import { ArrowRight, FileText, CalendarDays, BarChart } from '../../../components/icons.jsx';
import styles from './Today.module.css';

// Today dashboard / home (FR-003).
//
// Stats and sections below read from the same tables their own feature pages
// write to (BeneficiariesContext, ReportsContext, attendance_sessions /
// attendance_records — see AttendanceMulti.jsx), so this page has no local
// copy of that data to fall out of sync. "Upcoming tasks & reminders" is the
// one exception: there's no tasks table or feature anywhere in the schema,
// so it stays a real (not fabricated) empty state until that's built.
const tasks = [];

const REPORT_STATUS_LABEL = {
  'due-soon': 'Due soon',
  'in-progress': 'In progress',
  completed: 'Completed',
};

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

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
  const { beneficiaries } = useBeneficiaries();
  const { reports } = useReports();
  const { activeProgramme } = useProgrammeFilter();
  const [sessions, setSessions] = useState([]);

  const date = todayISO();
  const programmes = org?.programmes ?? [];

  // Today's attendance across all programmes, for the "Present today" stat
  // and the daily summary table below.
  useEffect(() => {
    const orgId = org?.id;
    if (!orgId) { setSessions([]); return; }

    supabase
      .from('attendance_sessions')
      .select('programme_id, attendance_records(present)')
      .eq('org_id', orgId)
      .eq('session_date', date)
      .then(({ data }) => setSessions(data ?? []));
  }, [org?.id, date]);

  const firstName =
    user?.user_metadata?.first_name || user?.user_metadata?.full_name?.split(' ')[0] || 'there';
  const programmeCount = programmes.length;

  const activeProgrammeName = activeProgramme !== 'all'
    ? (programmes.find((p) => p.id === activeProgramme)?.name ?? null)
    : null;

  const metaParts = [
    org?.name,
    activeProgrammeName
      ? activeProgrammeName
      : `${programmeCount} ${programmeCount === 1 ? 'programme' : 'programmes'}`,
    todayLabel(),
  ].filter(Boolean);

  const totalBeneficiaries = beneficiaries.length;

  const presentToday = sessions.reduce(
    (sum, s) => sum + (s.attendance_records ?? []).filter((r) => r.present).length,
    0,
  );

  const reportsDue = reports.filter((r) => r.status !== 'completed').length;
  const recentReports = reports.slice(0, 5);

  const attendanceRows = programmes.map((p) => {
    const session = sessions.find((s) => s.programme_id === p.id);
    const expected = beneficiaries.filter((b) => b.programmeId === p.id && b.status === 'Active').length;
    const present = session ? (session.attendance_records ?? []).filter((r) => r.present).length : 0;
    const rate = expected > 0 ? Math.round((present / expected) * 100) : 0;
    return { id: p.id, programme: p.name, expected, present, rate };
  });

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
        <StatTile label="Present today" value={presentToday} />
        <StatTile label="Total beneficiaries" value={totalBeneficiaries} />
        <StatTile label="Reports due" value={reportsDue} />
      </section>

      <SectionCard
        title="Recent report activity"
        action={recentReports.length > 0 && <ViewAll to={ROUTES.reports} />}
      >
        {recentReports.length === 0 ? (
          <EmptyState
            icon={<FileText />}
            title="No reports yet"
            hint="Reports you create will appear here."
          />
        ) : (
          recentReports.map((r) => (
            <div key={r.id} className={styles.row}>
              <span className={styles.rowIcon}>
                <FileText />
              </span>
              <span className={styles.rowLabel}>{r.title}</span>
              <span className={styles.rowMeta}>{REPORT_STATUS_LABEL[r.status] ?? r.status}</span>
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
        action={attendanceRows.length > 0 && <ViewAll to={ROUTES.attendance} />}
      >
        {attendanceRows.length === 0 ? (
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
              {attendanceRows.map((a) => (
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
