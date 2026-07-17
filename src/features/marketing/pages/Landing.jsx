import { useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext.jsx';
import { ROUTES } from '../../../constants/routes.js';
import {
  BrandMark,
  Home,
  ClipboardCheck,
  Users,
  FileText,
  ChevronRight,
} from '../../../components/icons.jsx';
import styles from './Landing.module.css';

const FEATURES = [
  {
    Icon: ClipboardCheck,
    title: 'Attendance tracking',
    body: 'Mark present, absent or late in one tap. See your rate for the day at a glance, across every programme you run.',
  },
  {
    Icon: Users,
    title: 'Beneficiary management',
    body: 'Keep every learner’s profile, programme history and status in one place — no more spreadsheets that lock when one person leaves.',
  },
  {
    Icon: FileText,
    title: 'Funder reporting',
    body: 'Build reports against a programme and a funder, fill them in as you go, and find them again exactly where you left off.',
  },
];

const FAQ = [
  {
    q: 'Does Impactly work on a phone?',
    a: 'Yes. Impactly is built mobile-first, for field staff capturing attendance from a phone, not a desk.',
  },
  {
    q: 'Do I need IT support to set it up?',
    a: 'No. Setup takes around 30 minutes and walks you through creating your organisation, adding your first programmes, and inviting your team — no technical background needed.',
  },
  {
    q: 'What happens to our data?',
    a: 'Your data is stored per organisation and only accessible to your team. We’re building Impactly with South African NGOs and POPIA in mind — read more on our data handling page (coming soon).',
  },
  {
    q: 'Can we import our existing spreadsheet?',
    a: 'Yes. You can import beneficiaries, funders and grants from a CSV file during setup or at any time from Organisation settings.',
  },
  {
    q: 'What does it cost?',
    a: 'Pricing is being finalised — details are coming soon. Create an account to be notified.',
  },
  {
    q: 'Can we export our data if we leave?',
    a: 'Yes. Every organisation can export all of its data — beneficiaries, funders, grants and staff — to CSV at any time, no questions asked.',
  },
];

export default function Landing() {
  const { session, loading } = useAuth();

  useEffect(() => {
    document.title = 'Impactly | NGO Attendance & Funder Reporting Software (SA)';
  }, []);

  // Render marketing content immediately; only redirect once we positively
  // know the visitor already has a session (avoids blocking on the auth
  // check, which has nothing to do with viewing this page).
  if (!loading && session) return <Navigate to={ROUTES.home} replace />;

  return (
    <div className={styles.page}>
      {/* ── Top bar ─────────────────────────────────────── */}
      <header className={styles.topbar}>
        <span className={styles.wordmark}>
          <BrandMark size={28} />
          Impactly
        </span>
        <nav className={styles.topbarActions}>
          <Link to={ROUTES.signIn} className={styles.logIn}>Log in</Link>
          <Link to={ROUTES.onboardingAccount} className={styles.topCta}>Create your account</Link>
        </nav>
      </header>

      {/* ── Hero ────────────────────────────────────────── */}
      <section className={styles.hero}>
        <h1 className={styles.h1}>Attendance, beneficiaries and funder reports in one place</h1>
        <p className={styles.subhead}>
          Up and running in under 30 minutes, no IT support needed.
        </p>
        <div className={styles.heroCtas}>
          <Link to={ROUTES.onboardingAccount} className={styles.primaryCta}>
            Create your account <ChevronRight size={16} />
          </Link>
          <Link to={ROUTES.signIn} className={styles.secondaryCta}>Log in</Link>
        </div>

        {/* Lightweight product mock — no fabricated screenshot */}
        <div className={styles.mock} aria-hidden="true">
          <div className={styles.mockPhone}>
            <div className={styles.mockBar}>
              <Home size={14} />
              <span>Today</span>
            </div>
            <div className={styles.mockCard}>
              <span className={styles.mockLabel}>Present today</span>
              <span className={styles.mockValue}>87</span>
            </div>
            <div className={styles.mockCard}>
              <span className={styles.mockLabel}>Rate</span>
              <span className={styles.mockValue}>95%</span>
            </div>
            <div className={styles.mockRow}>
              <span className={styles.mockChip}>present</span>
              <span className={styles.mockChip}>present</span>
              <span className={styles.mockChipMuted}>late</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Problem ─────────────────────────────────────── */}
      <section className={styles.problem}>
        <ul className={styles.problemList}>
          <li>Paper registers that never make it back to the office.</li>
          <li>Spreadsheets that lock up the moment one person leaves.</li>
          <li>Programme updates scattered across WhatsApp threads.</li>
        </ul>
      </section>

      {/* ── Features ────────────────────────────────────── */}
      <section className={styles.features}>
        {FEATURES.map(({ Icon, title, body }) => (
          <div key={title} className={styles.featureCard}>
            <span className={styles.featureIcon} aria-hidden="true"><Icon size={26} /></span>
            <h2 className={styles.featureTitle}>{title}</h2>
            <p className={styles.featureBody}>{body}</p>
          </div>
        ))}
      </section>

      {/* ── Mobile-first proof ──────────────────────────── */}
      <section className={styles.mobileProof}>
        <h2 className={styles.h2}>Built for the field, not just the office</h2>
        <p className={styles.mobileProofBody}>
          Impactly is designed mobile-first for staff capturing attendance and updating
          profiles from a phone, often on a slow connection. The same data syncs back
          to the office in real time.
        </p>
      </section>

      {/* ── Trust ───────────────────────────────────────── */}
      <section className={styles.trust}>
        <p className={styles.trustBody}>
          Impactly is being built and tested in partnership with a South African NGO
          through the Tebelo Tech Hub design partnership.
        </p>
        {/* TODO: replace with a real quote + logo once Tebelo sign-off is confirmed */}
      </section>

      {/* ── POPIA ───────────────────────────────────────── */}
      <section className={styles.popia}>
        <h2 className={styles.h2}>Built with POPIA in mind</h2>
        <p className={styles.popiaBody}>
          Your organisation’s data — beneficiaries, funders, grants and staff — is
          scoped to your organisation only. We’re documenting exactly how data is
          handled as we go; POPIA compliance is ultimately an operational responsibility
          shared between Impactly and your organisation.
        </p>
        <a href="#popia" className={styles.popiaLink}>Read more about data handling &rarr;</a>
      </section>

      {/* ── Pricing teaser ──────────────────────────────── */}
      <section className={styles.pricing}>
        <h2 className={styles.h2}>Pricing</h2>
        <p className={styles.pricingBody}>
          We’re finalising transparent, published pricing. Create an account to get
          started — we’ll let you know as soon as plans go live.
        </p>
      </section>

      {/* ── FAQ ─────────────────────────────────────────── */}
      <section className={styles.faq}>
        <h2 className={styles.h2}>Frequently asked questions</h2>
        <dl className={styles.faqList}>
          {FAQ.map(({ q, a }) => (
            <div key={q} className={styles.faqItem}>
              <dt className={styles.faqQ}>{q}</dt>
              <dd className={styles.faqA}>{a}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ── Final CTA ───────────────────────────────────── */}
      <section className={styles.finalCta}>
        <h2 className={styles.h2}>Ready to make an impact?</h2>
        <Link to={ROUTES.onboardingAccount} className={styles.primaryCta}>
          Create your account <ChevronRight size={16} />
        </Link>
      </section>

      <footer className={styles.footer}>
        <span>&copy; {new Date().getFullYear()} Impactly</span>
      </footer>
    </div>
  );
}
