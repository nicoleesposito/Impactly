import { useState, useEffect } from 'react';
import { useProgrammeFilter } from '../../../context/ProgrammeFilterContext.jsx';
import { useOrg } from '../../../context/OrgContext.jsx';
import { useBeneficiaries } from '../../../context/BeneficiariesContext.jsx';
import { supabase } from '../../../lib/supabase.js';
import EmptyState from '../../dashboard/components/EmptyState.jsx';
import { CalendarDays, Users, ArrowRight, Check, Close } from '../../../components/icons.jsx';
import styles from './AttendanceMulti.module.css';

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
  const { beneficiaries } = useBeneficiaries();
  const [date, setDate] = useState(todayISO());

  const programmes = org?.programmes ?? [];
  const label = beneficiaryLabel || 'Beneficiaries';
  const selected =
    activeProgramme !== 'all'
      ? programmes.find((p) => p.id === activeProgramme)
      : null;

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
        <CaptureView
          programme={selected}
          label={label}
          date={date}
          orgId={org?.id}
          beneficiaries={beneficiaries}
        />
      ) : (
        <OverviewView
          programmes={programmes}
          label={label}
          beneficiaries={beneficiaries}
          onCapture={setActiveProgramme}
        />
      )}
    </div>
  );
}

/* ── "All" overview ─────────────────────────────────────────────────── */
function OverviewView({ programmes, label, beneficiaries, onCapture }) {
  const totalEnrolled = beneficiaries.filter((b) => b.status === 'Active').length;

  return (
    <>
      <section className={styles.stats} aria-label="Summary">
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Total enrolled</p>
          <p className={styles.statValue}>{totalEnrolled}</p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Programmes</p>
          <p className={styles.statValue}>{programmes.length}</p>
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
          {programmes.map((p) => {
            const enrolled = beneficiaries.filter(
              (b) => b.programmeId === p.id && b.status === 'Active',
            ).length;

            return (
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
                  <span className={styles.progDay}>
                    {enrolled} {label.toLowerCase()} enrolled
                  </span>
                </div>
                <div className={styles.bar} aria-hidden="true">
                  <span
                    className={styles.barFill}
                    style={{ width: '0%', background: p.color || 'var(--color-neutral)' }}
                  />
                </div>

                <div className={styles.progFoot}>
                  <span className={styles.progMeta}>
                    {enrolled === 0 ? `No ${label.toLowerCase()} enrolled` : 'No sessions recorded yet'}
                  </span>
                  <button
                    type="button"
                    className={styles.captureLink}
                    onClick={() => onCapture(p.id)}
                  >
                    Capture <ArrowRight size={16} />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </>
  );
}

/* ── Single-programme capture ───────────────────────────────────────── */
function CaptureView({ programme, label, date, orgId, beneficiaries }) {
  const roster = beneficiaries
    .filter((b) => b.programmeId === programme.id && b.status === 'Active')
    .map((b) => ({
      id: b.id,
      name: `${b.firstName} ${b.lastName ?? ''}`.trim(),
      subtitle: b.dob ? formatDob(b.dob) : null,
    }));

  const [status, setStatus] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Load any previously saved attendance for this programme + date
  useEffect(() => {
    setStatus({});
    if (!programme.id) return;
    supabase
      .from('attendance_sessions')
      .select('id, attendance_records(*)')
      .eq('programme_id', programme.id)
      .eq('session_date', date)
      .maybeSingle()
      .then(({ data: session }) => {
        if (session?.attendance_records?.length) {
          const loaded = {};
          session.attendance_records.forEach((r) => {
            loaded[r.beneficiary_id] = r.status ?? (r.present ? 'present' : 'absent');
          });
          setStatus(loaded);
        }
      });
  }, [programme.id, date]);

  const presentCount = roster.filter((r) => status[r.id] === 'present').length;
  const rate = roster.length > 0
    ? `${Math.round((presentCount / roster.length) * 100)}%`
    : '—';
  const hasRoster = roster.length > 0;
  const anyMarked = roster.some((r) => status[r.id]);

  function markAllPresent() {
    setStatus(Object.fromEntries(roster.map((r) => [r.id, 'present'])));
  }

  async function handleSave() {
    if (!orgId || !hasRoster) return;
    setSaving(true);
    try {
      // Upsert session (unique on programme_id + session_date)
      const { data: session, error: sessErr } = await supabase
        .from('attendance_sessions')
        .upsert(
          { org_id: orgId, programme_id: programme.id, session_date: date },
          { onConflict: 'programme_id,session_date' },
        )
        .select('id')
        .single();

      if (sessErr) throw sessErr;

      // Delete previous records and re-insert so re-saves are idempotent
      await supabase.from('attendance_records').delete().eq('session_id', session.id);

      const records = roster
        .filter((r) => status[r.id])
        .map((r) => ({
          session_id: session.id,
          beneficiary_id: r.id,
          status: status[r.id],
          present: status[r.id] === 'present',
        }));

      if (records.length) {
        await supabase.from('attendance_records').insert(records);
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('[AttendanceMulti] save error:', err.message);
    }
    setSaving(false);
  }

  return (
    <>
      <section className={styles.stats} aria-label="Summary">
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Present today</p>
          <p className={styles.statValue}>{presentCount}</p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Rate</p>
          <p className={styles.statValue}>{rate}</p>
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
              <span className={styles.progDay}>{presentCount}/{roster.length} present</span>
              <span className={styles.progCount}>{rate}</span>
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
            title={`No ${label.toLowerCase()} enrolled`}
            hint={`Add ${label.toLowerCase()} and assign them to the ${programme.name} programme to capture attendance.`}
          />
        )}

        <button
          type="button"
          className={styles.save}
          disabled={!anyMarked || saving}
          onClick={handleSave}
        >
          {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save attendance'}
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

function formatDob(dob) {
  const d = new Date(dob);
  return isNaN(d.getTime()) ? dob : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}
