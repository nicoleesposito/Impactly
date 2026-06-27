import { useNavigate } from 'react-router-dom';
import EmptyState from '../../dashboard/components/EmptyState.jsx';
import { useScheduledReports, ONE_TIME } from '../../../context/ScheduledReportsContext.jsx';
import { useOrg } from '../../../context/OrgContext.jsx';
import { useProgrammeFilter } from '../../../context/ProgrammeFilterContext.jsx';
import { ROUTES } from '../../../constants/routes.js';
import { ChevronLeft, CalendarDays } from '../../../components/icons.jsx';
import styles from './ScheduledReports.module.css';

// Scheduled reports (PDF p.36).
// "Sending this week" = scheduled sends with a sendDate in the next 7 days.
// "Recurring schedules" = repeating reports with a toggle.

const CHANNEL_LABEL = { email: 'Email', whatsapp: 'WhatsApp', download: 'Download' };

function isThisWeek(dateStr) {
  if (!dateStr) return false;
  const d = new Date(dateStr + 'T00:00:00');
  const now = new Date();
  const weekEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  return d >= now && d <= weekEnd;
}

const AVATAR_COLORS = ['#9C2B2E', '#4F6D7A', '#7A4F9C', '#2E7D5B', '#B5762B'];
function avatarColor(name = '') {
  let sum = 0;
  for (const ch of name) sum += ch.charCodeAt(0);
  return AVATAR_COLORS[sum % AVATAR_COLORS.length];
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-ZA', { weekday: 'short', month: 'long', day: 'numeric' });
}

function formatTime(t) {
  if (!t) return '';
  const [h, m] = t.split(':');
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? 'pm' : 'am';
  return `${hour % 12 || 12}:${m}${ampm}`;
}

export default function ScheduledReports() {
  const navigate = useNavigate();
  const { scheduledReports, toggleScheduledReport } = useScheduledReports();
  const { org } = useOrg();
  const { activeProgramme } = useProgrammeFilter();

  const activeProgrammeName = activeProgramme !== 'all'
    ? (org?.programmes?.find((p) => p.id === activeProgramme)?.name ?? null)
    : null;

  const filtered = activeProgrammeName
    ? scheduledReports.filter((r) => r.programme === activeProgrammeName)
    : scheduledReports;

  // "Sending this week" = one-time sends within next 7 days, or one-time with no date yet
  const sending = filtered.filter(
    (r) => r.frequency === ONE_TIME && (isThisWeek(r.sendDate) || !r.sendDate),
  );
  const recurring = filtered.filter((r) => r.frequency !== ONE_TIME);

  const activeCount = recurring.filter((r) => r.enabled).length;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button type="button" className={styles.back} onClick={() => navigate(-1)} aria-label="Back">
          <ChevronLeft size={24} />
        </button>
        <h1 className={styles.title}>Scheduled reports</h1>
        <button
          type="button"
          className={styles.add}
          onClick={() => navigate(ROUTES.reportsScheduleNew)}
        >
          + Add
        </button>
      </header>

      {/* Summary pills */}
      {filtered.length > 0 && (
        <div className={styles.summaryRow}>
          <span className={styles.summaryPill}>
            <CalendarDays size={14} />
            {sending.length} sending this week
          </span>
          <span className={styles.summaryPill}>
            {activeCount} active schedule{activeCount !== 1 ? 's' : ''}
          </span>
        </div>
      )}

      {filtered.length === 0 ? (
        <EmptyState
          icon={<CalendarDays />}
          title="No scheduled reports"
          hint="Schedule reports to run automatically and be delivered to funders or your team."
        />
      ) : (
        <>
          {sending.length > 0 && (
            <section className={styles.group}>
              <h2 className={styles.groupLabel}>Sending this week</h2>
              <ul className={styles.cardList}>
                {sending.map((r) => (
                  <li key={r.id}>
                    <div className={styles.card}>
                      <span
                        className={styles.avatar}
                        style={{ background: avatarColor(r.name) }}
                        aria-hidden="true"
                      >
                        {r.name?.[0]?.toUpperCase() ?? '?'}
                      </span>
                      <span className={styles.cardText}>
                        <span className={styles.cardName}>{r.name}</span>
                        {(r.sendDate || r.sendTime) && (
                          <span className={styles.cardSub}>
                            {[formatDate(r.sendDate), formatTime(r.sendTime)].filter(Boolean).join(' · ')}
                          </span>
                        )}
                        {r.programme && (
                          <span className={styles.cardProgramme}>{r.programme}</span>
                        )}
                        {r.channels?.length > 0 && (
                          <span className={styles.channels}>
                            {r.channels.map((c) => (
                              <span key={c} className={`${styles.channel} ${styles[c]}`}>
                                {CHANNEL_LABEL[c]}
                              </span>
                            ))}
                          </span>
                        )}
                      </span>
                      <span className={styles.queued}>Queued</span>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {recurring.length > 0 && (
            <section className={styles.group}>
              <h2 className={styles.groupLabel}>Recurring schedules</h2>
              <ul className={styles.list}>
                {recurring.map((r) => (
                  <li key={r.id} className={styles.recurRow}>
                    <span
                      className={styles.recurAvatar}
                      style={{ background: avatarColor(r.name) }}
                      aria-hidden="true"
                    >
                      {r.name?.[0]?.toUpperCase() ?? '?'}
                    </span>
                    <span className={styles.recurText}>
                      <span className={styles.recurName}>{r.name}</span>
                      <span className={styles.recurSub}>
                        {[r.frequency, r.programme, r.scheduleSummary]
                          .filter(Boolean)
                          .join(' · ')}
                      </span>
                    </span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={r.enabled}
                      aria-label={`${r.name} enabled`}
                      className={`${styles.toggle} ${r.enabled ? styles.toggleOn : ''}`}
                      onClick={() => toggleScheduledReport(r.id)}
                    >
                      <span className={styles.knob} />
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </div>
  );
}
