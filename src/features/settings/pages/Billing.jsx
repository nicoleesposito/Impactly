import { useNavigate } from 'react-router-dom';
import { useOrg } from '../../../context/OrgContext.jsx';
import { ChevronLeft, Check } from '../../../components/icons.jsx';
import styles from './Billing.module.css';

// Billing (PDF p.5).
// New organisations default to the Free plan. The PDF shows a Pro plan example;
// here the plan, usage, and invoices are data-driven and start on Free.

// Free plan is the default for a new organisation.
const PLAN = {
  name: 'Free Plan',
  price: 'R0 / month',
  beneficiaryLimit: 50,
  includes: [
    'Up to 1 programme',
    'Up to 50 beneficiaries',
    'Basic reports',
    'Community support',
  ],
};

export default function Billing() {
  const navigate = useNavigate();
  const { org } = useOrg();

  const beneficiariesUsed = 0; // wired to live counts later
  const usagePct = Math.min(100, Math.round((beneficiariesUsed / PLAN.beneficiaryLimit) * 100));

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button type="button" className={styles.back} onClick={() => navigate(-1)} aria-label="Back">
          <ChevronLeft size={24} />
        </button>
        <h1 className={styles.title}>Billing</h1>
      </header>

      {/* Plan card */}
      <section className={styles.planCard}>
        <div className={styles.planHead}>
          <p className={styles.planName}>{PLAN.name}</p>
          <p className={styles.planPrice}>{PLAN.price}</p>
        </div>
        <div className={styles.planBody}>
          <p className={styles.planIncludesLabel}>Plan includes:</p>
          <ul className={styles.includesList}>
            {PLAN.includes.map((item) => (
              <li key={item} className={styles.includeItem}>
                <span className={styles.checkIcon} aria-hidden="true"><Check size={16} /></span>
                {item}
              </li>
            ))}
          </ul>
          <button type="button" className={styles.upgrade}>Upgrade to Pro</button>
        </div>
      </section>

      {/* Usage this month */}
      <section className={styles.card}>
        <h2 className={styles.cardTitle}>Usage this month</h2>
        <div className={styles.usageRow}>
          <span>Beneficiaries</span>
          <span className={styles.usageValue}>{beneficiariesUsed}/{PLAN.beneficiaryLimit}</span>
        </div>
        <div className={styles.bar} aria-hidden="true">
          <span className={styles.barFill} style={{ width: `${usagePct}%` }} />
        </div>
      </section>

      {/* Payment method */}
      <section className={styles.card}>
        <h2 className={styles.cardTitle}>Payment method</h2>
        <p className={styles.muted}>No payment method on file</p>
        <button type="button" className={styles.outlineBtn}>+ Add payment method</button>
      </section>

      {/* Billing details */}
      <section className={styles.card}>
        <h2 className={styles.cardTitle}>Billing details</h2>
        <dl className={styles.detailList}>
          <div className={styles.detailRow}>
            <dt>Organisation</dt>
            <dd>{org?.name || '—'}</dd>
          </div>
          <div className={styles.detailRow}>
            <dt>VAT Number</dt>
            <dd>{org?.vatNumber || '—'}</dd>
          </div>
          <div className={styles.detailRow}>
            <dt>Country</dt>
            <dd>{org?.country || '—'}</dd>
          </div>
        </dl>
      </section>

      {/* Invoice history */}
      <section className={styles.card}>
        <h2 className={styles.cardTitle}>Invoice history</h2>
        <p className={styles.muted}>No invoices yet. Invoices appear here once you upgrade to a paid plan.</p>
      </section>
    </div>
  );
}
