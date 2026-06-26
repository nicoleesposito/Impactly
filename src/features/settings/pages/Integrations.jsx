import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes.js';
import { ChevronLeft, ArrowRight, Phone, Mail, Grid, CreditCard } from '../../../components/icons.jsx';
import styles from './Integrations.module.css';

// Integrations & App (PDF p.13).
// WhatsApp connection, notification preferences, and links out to Email (SMTP),
// Templates, and Billing. New organisations default to the Free plan.

const NOTIFICATIONS = [
  { key: 'lowAttendance', label: 'Low attendance alerts',   default: false },
  { key: 'reportDue',     label: 'Report due reminders',    default: true  },
  { key: 'staffInvite',   label: 'New staff invite accepted', default: false },
  { key: 'grantDeadline', label: 'Grant deadline warnings', default: true  },
  { key: 'whatsappDelivery', label: 'WhatsApp message delivery', default: true },
];

export default function Integrations() {
  const navigate = useNavigate();
  const [prefs, setPrefs] = useState(
    () => Object.fromEntries(NOTIFICATIONS.map((n) => [n.key, n.default])),
  );

  const toggle = (key) => () =>
    setPrefs((p) => ({ ...p, [key]: !p[key] }));

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button type="button" className={styles.back} onClick={() => navigate(-1)} aria-label="Back">
          <ChevronLeft size={24} />
        </button>
        <h1 className={styles.title}>Integrations &amp; App</h1>
      </header>

      {/* WhatsApp connected */}
      <div className={styles.whatsapp}>
        <span className={styles.whatsappIcon} aria-hidden="true"><Phone /></span>
        <span className={styles.whatsappText}>
          <span className={styles.whatsappTitle}>WhatsApp connected</span>
          <span className={styles.whatsappSub}>Attendance alerts &amp; parent communications active</span>
        </span>
        <button type="button" className={styles.configure}>Configure</button>
      </div>

      {/* Notification preferences */}
      <section className={styles.card}>
        <h2 className={styles.cardTitle}>Notification preferences</h2>
        {NOTIFICATIONS.map((n, i) => (
          <div
            key={n.key}
            className={`${styles.toggleRow} ${i < NOTIFICATIONS.length - 1 ? styles.divided : ''}`}
          >
            <span className={styles.toggleLabel}>{n.label}</span>
            <button
              type="button"
              role="switch"
              aria-checked={prefs[n.key]}
              aria-label={n.label}
              className={`${styles.toggle} ${prefs[n.key] ? styles.toggleOn : ''}`}
              onClick={toggle(n.key)}
            >
              <span className={styles.knob} />
            </button>
          </div>
        ))}
      </section>

      {/* App links */}
      <section className={styles.card}>
        <div className={styles.linkRow}>
          <span className={styles.linkIcon} aria-hidden="true"><Mail /></span>
          <span className={styles.linkText}>
            <span className={styles.linkLabel}>Email (SMTP)</span>
            <span className={styles.linkSub}>Not connected</span>
          </span>
          <button type="button" className={styles.connect}>Connect</button>
        </div>

        <div className={styles.divider} aria-hidden="true" />

        <Link to={ROUTES.templates} className={styles.linkRow}>
          <span className={styles.linkIcon} aria-hidden="true"><Grid /></span>
          <span className={styles.linkText}>
            <span className={styles.linkLabel}>Templates</span>
            <span className={styles.linkSub}>Report &amp; message templates</span>
          </span>
          <span className={styles.arrow} aria-hidden="true"><ArrowRight size={16} /></span>
        </Link>

        <div className={styles.divider} aria-hidden="true" />

        <Link to={ROUTES.settingsBilling} className={styles.linkRow}>
          <span className={styles.linkIcon} aria-hidden="true"><CreditCard /></span>
          <span className={styles.linkText}>
            <span className={styles.linkLabel}>Billing</span>
            <span className={styles.linkSub}>Free plan</span>
          </span>
          <span className={styles.arrow} aria-hidden="true"><ArrowRight size={16} /></span>
        </Link>
      </section>
    </div>
  );
}
