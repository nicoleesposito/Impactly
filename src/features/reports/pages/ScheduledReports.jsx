import { useNavigate } from 'react-router-dom';
import EmptyState from '../../dashboard/components/EmptyState.jsx';
import { useScheduledReports, ONE_TIME } from '../../../context/ScheduledReportsContext.jsx';
import { ROUTES } from '../../../constants/routes.js';
import { ChevronLeft, ArrowRight, CalendarDays } from '../../../components/icons.jsx';
import styles from './ScheduledReports.module.css';

// Scheduled reports (PDF p.36).
// "Sending this week" = one-time scheduled sends. "Recurring schedules" =
// repeating reports with an on/off toggle. Data comes from
// ScheduledReportsContext and is empty for a new organisation.

const CHANNEL_LABEL = { email: 'Email', whatsapp: 'WhatsApp', download: 'Download' };

// Stable avatar colour from the report name.
const AVATAR_COLORS = ['#9C2B2E', '#4F6D7A', '#7A4F9C', '#2E7D5B', '#B5762B'];
function avatarColor(name = '') {
  let sum = 0;
  for (const ch of name) sum += ch.charCodeAt(0);
  return AVATAR_COLORS[sum % AVATAR_COLORS.length];
}

export default function ScheduledReports() {
  const navigate = useNavigate();
  const { scheduledReports, toggleScheduledReport } = useScheduledReports();

  const sending = scheduledReports.filter((r) => r.frequency === ONE_TIME);
  const recurring = scheduledReports.filter((r) => r.frequency !== ONE_TIME);

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

      {scheduledReports.length === 0 ? (
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
                  <li key={r.id} className={styles.card}>
                    <span className={styles.avatar} style={{ background: avatarColor(r.name) }} aria-hidden="true">
                      {r.name?.[0]?.toUpperCase() ?? '?'}
                    </span>
                    <span className={styles.cardText}>
                      <span className={styles.cardName}>{r.name}</span>
                      {(r.sendDate || r.sendTime) && (
                        <span className={styles.cardSub}>
                          {[formatDate(r.sendDate), r.sendTime].filter(Boolean).join(' - ')}
                        </span>
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
                    <span className={styles.arrow} aria-hidden="true"><ArrowRight size={16} /></span>
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
                    <span className={styles.recurText}>
                      <span className={styles.recurName}>{r.name}</span>
                      {r.scheduleSummary && <span className={styles.recurSub}>{r.scheduleSummary}</span>}
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

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-ZA', { month: 'long', day: 'numeric' });
}
