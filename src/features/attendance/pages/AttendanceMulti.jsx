import { useState } from 'react';
import { useProgrammeFilter } from '../../../context/ProgrammeFilterContext.jsx';
import { useOrg } from '../../../context/OrgContext.jsx';
import EmptyState from '../../dashboard/components/EmptyState.jsx';
import { CalendarDays, Users, ArrowRight, Check, Close } from '../../../components/icons.jsx';
import styles from './AttendanceMulti.module.css';

// Attendance hub (FR-008).
//
// Two views driven by the persistent programme pill (FR-014):
//   • "All"            → overview: one progress card per programme (PDF p.3)
//   • a specific prog. → capture: roster with present/absent/late + save (PDF p.2)
// Both are data-driven and empty for a new organisation; rows/cards fill in as
// programmes and beneficiaries are added. Wired to Supabase in a later section.

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function longDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export default function AttendanceMulti() {
  const { activeProgramme, setActiveProgramme } = useProgrammeFilter();
  const { org, beneficiaryLabel } = useOrg();
  const [date, setDate] = useState(todayISO());

  const programmes = org?.programmes ?? [];
  const label = beneficiaryLabel || 'Beneficiaries';
  const selected =
    activeProgramme !== 'all'
      ? programmes.find((p) => p.id === activeProgramme)
      : null;

  // Subtitle: "Org · {scope} · {date}"
  const scope =
    activeProgramme === 'all'
      ? `${programmes.length} ${programmes.length === 1 ? 'programme' : 'programmes'}`
      : selected
        ? `${selected.name} programme`
        : 'programme';
  const subtitle = [org?.name, scope, longDate(date)].filter(Boolean).join(' · ');

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.heading}>
          <h1 className={styles.title}>Attendance</h1>
          <p className={styles.meta}>{subtitle}</p>
        </div>
        <label className={styles.dateField}>
          <input
            type="date"
            className={styles.dateInput}
            value={date}
            onChange={(e) => setDate(e.target.value || todayISO())}
            aria-label="Attendance date"
          />
        </label>
      </header>

      {selected ? (
        <CaptureView programme={selected} label={label} />
      ) : (
        <OverviewView
          programmes={programmes}
          label={label}
          onCapture={setActiveProgramme}
        />
      )}
    </div>
  );
}

/* ── "All" overview (PDF p.3) ──────────────────────────────────────────── */
function OverviewView({ programmes, label, onCapture }) {
  return (
    <>
      <section className={styles.stats} aria-label="Summary">
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Present today</p>
          <p className={styles.statValue}>0</p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Rate</p>
          <p className={styles.statValue}>—</p>
        </div>
      </section>

      {programmes.length === 0 ? (
        <EmptyState
          icon={<CalendarDays />}
          title="No programmes yet"
          hint="Add a programme to start capturing attendance across your organisation."
        />
      ) : (
        <div className={styles.cardList}>
          {programmes.map((p) => (
            <article key={p.id} className={styles.progCard}>
              <header className={styles.progHead}>
                <span className={styles.progName}>
                  <span
                    className={styles.dot}
                    style={{ background: p.color || 'var(--color-neutral)' }}
                    aria-hidden="true"
                  />
                  {p.name}
                </span>
                <span
                  className={styles.progTag}
                  style={{ color: p.color || 'var(--color-neutral)' }}
                >
                  {p.shortLabel || p.name}
                </span>
              </header>

              <div className={styles.progRow}>
                <span className={styles.progDay}>Today</span>
                <span className={styles.progCount}>
                  0/0 <span className={styles.progRate}>—</span>
                </span>
              </div>
              <div className={styles.bar} aria-hidden="true">
                <span
                  className={styles.barFill}
                  style={{ width: '0%', background: p.color || 'var(--color-neutral)' }}
                />
              </div>

              <div className={styles.progFoot}>
                <span className={styles.progMeta}>No sessions yet</span>
                <button
                  type="button"
                  className={styles.captureLink}
                  onClick={() => onCapture(p.id)}
                >
                  Capture <ArrowRight size={16} />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}

/* ── Single-programme capture (PDF p.2) ────────────────────────────────── */
function CaptureView({ programme, label }) {
  // Roster is empty for a new organisation; fills in as beneficiaries enrol.
  const roster = [];
  const [status, setStatus] = useState({}); // id -> 'present' | 'absent' | 'late'
  const hasRoster = roster.length > 0;

  function markAllPresent() {
    setStatus(Object.fromEntries(roster.map((r) => [r.id, 'present'])));
  }

  return (
    <>
      <section className={styles.stats} aria-label="Summary">
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Present today</p>
          <p className={styles.statValue}>0</p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Rate</p>
          <p className={styles.statValue}>—</p>
        </div>
      </section>

      <section className={styles.captureCard}>
        <header className={styles.captureHead}>
          <h2 className={styles.captureTitle}>Capture</h2>
          <button
            type="button"
            className={styles.markAll}
            onClick={markAllPresent}
            disabled={!hasRoster}
          >
            <Check size={15} /> Mark all present
          </button>
        </header>
        <span
          className={styles.captureRule}
          style={{ background: programme.color || 'var(--color-primary)' }}
          aria-hidden="true"
        />

        {hasRoster ? (
          <>
            <div className={styles.captureRow}>
              <span className={styles.progDay}>Today</span>
              <span className={styles.progCount}>0/{roster.length}</span>
            </div>
            <ul className={styles.roster}>
              {roster.map((r) => (
                <li key={r.id} className={styles.learner}>
                  <span className={styles.learnerInfo}>
                    <span className={styles.learnerName}>{r.name}</span>
                    {r.subtitle && (
                      <span className={styles.learnerSub}>{r.subtitle}</span>
                    )}
                  </span>
                  <span className={styles.toggles}>
                    <button
                      type="button"
                      className={`${styles.toggle} ${status[r.id] === 'present' ? styles.tPresent : ''}`}
                      onClick={() => setStatus((s) => ({ ...s, [r.id]: 'present' }))}
                    >
                      <Check size={13} /> Present
                    </button>
                    <button
                      type="button"
                      className={`${styles.toggle} ${status[r.id] === 'absent' ? styles.tAbsent : ''}`}
                      onClick={() => setStatus((s) => ({ ...s, [r.id]: 'absent' }))}
                    >
                      <Close size={13} /> Absent
                    </button>
                    <button
                      type="button"
                      className={`${styles.toggle} ${status[r.id] === 'late' ? styles.tLate : ''}`}
                      onClick={() => setStatus((s) => ({ ...s, [r.id]: 'late' }))}
                    >
                      Late
                    </button>
                  </span>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <EmptyState
            icon={<Users />}
            title={`No ${label.toLowerCase()} enrolled yet`}
            hint={`Enrol ${label.toLowerCase()} in ${programme.name} to capture their attendance.`}
          />
        )}

        <button type="button" className={styles.save} disabled={!hasRoster}>
          Save attendance
        </button>
      </section>

      <section className={styles.moduleCard}>
        <h2 className={styles.moduleTitle}>Module completion · today</h2>
        <ul className={styles.moduleList}>
          {[
            ['Not started', 0],
            ['In progress', 0],
            ['Completed', 0],
          ].map(([name, count]) => (
            <li key={name} className={styles.moduleRow}>
              <span>{name}</span>
              <span className={styles.moduleCount}>{count}</span>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
