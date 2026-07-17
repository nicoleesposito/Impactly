import { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext.jsx';
import { ROUTES } from '../../../constants/routes.js';
import {
  BrandMark,
  ClipboardCheck,
  Users,
  FileText,
  ChevronRight,
} from '../../../components/icons.jsx';
import styles from './Landing.module.css';

// Placeholder banner slides: brand-colour gradients standing in for real
// photography until we have actual images to drop in.
const HERO_SLIDES = [
  'linear-gradient(135deg, #a02b3f, #d94e6b)',
  'linear-gradient(135deg, #6366f1, #8b5cf6)',
  'linear-gradient(135deg, #3ba55d, #6366f1)',
  'linear-gradient(135deg, #d94e6b, #b5762b)',
];
const HERO_SLIDE_DURATION = 5000;

const FEATURES = [
  {
    Icon: ClipboardCheck,
    title: 'Attendance tracking',
    body: 'Mark present, absent or late in one tap. See your rate for the day at a glance, across every programme you run.',
  },
  {
    Icon: Users,
    title: 'Beneficiary management',
    body: 'Keep every beneficiary’s profile, programme history and status in one place. No more spreadsheets that lock when one person leaves.',
  },
  {
    Icon: FileText,
    title: 'Funder reporting',
    body: 'Build reports for any programme and funder, fill them in as you go, and pick up exactly where you left off.',
  },
];

const FAQ = [
  {
    q: 'Does Impactly work on a phone?',
    a: 'Yes. Impactly is built mobile-first, for field staff capturing attendance from a phone, not a desk.',
  },
  {
    q: 'Do I need IT support to set it up?',
    a: 'No. Setup takes around 30 minutes and walks you through creating your organisation, adding your first programmes, and inviting your team. No technical background is needed.',
  },
  {
    q: 'What happens to our data?',
    a: 'Your data is stored per organisation and only accessible to your team. We’re building Impactly with South African NGOs and POPIA in mind. Read more on our data handling page (coming soon).',
  },
  {
    q: 'Can we import our existing spreadsheet?',
    a: 'Yes. You can import beneficiaries, funders and grants from a CSV file during setup or at any time from Organisation settings.',
  },
  {
    q: 'What does it cost?',
    a: 'Pricing is being finalised, with details coming soon. Create an account to be notified.',
  },
  {
    q: 'Can we export our data if we leave?',
    a: 'Yes. Every organisation can export all of its data, including beneficiaries, funders, grants and staff, to CSV at any time, no questions asked.',
  },
];

export default function Landing() {
  const { session, loading } = useAuth();
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    document.title = 'Impactly | NGO Attendance & Funder Reporting Software (SA)';
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setActiveSlide((i) => (i + 1) % HERO_SLIDES.length);
    }, HERO_SLIDE_DURATION);
    return () => clearInterval(id);
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
        <div className={styles.heroBg} aria-hidden="true">
          {HERO_SLIDES.map((slide, i) => (
            <div
              key={i}
              className={`${styles.heroSlide} ${i === activeSlide ? styles.heroSlideActive : ''}`}
              style={{ backgroundImage: slide }}
            />
          ))}
        </div>

        <div className={styles.heroContent}>
          <h1 className={styles.h1}>Attendance, beneficiary management and funder reporting in one place</h1>
          <p className={styles.subhead}>
            Up and running in under 30 minutes, no IT support needed.
          </p>
          <div className={styles.heroCtas}>
            <Link to={ROUTES.onboardingAccount} className={styles.primaryCta}>
              Create your account <ChevronRight size={16} />
            </Link>
            <Link to={ROUTES.signIn} className={styles.secondaryCta}>Log in</Link>
          </div>
        </div>
      </section>

      {/* ── Problem ─────────────────────────────────────── */}
      <section className={styles.problem}>
        <h2 className={styles.h2}>Common challenges in NGO record keeping</h2>
        <ul className={styles.problemList}>
          <li>Paper registers that never make it back to the office.</li>
          <li>Spreadsheets that lock up the moment one person leaves.</li>
          <li>Programme updates scattered across WhatsApp threads.</li>
        </ul>
      </section>

      {/* ── Features ────────────────────────────────────── */}
      <section className={styles.featuresSection}>
        <h2 className={styles.h2}>Core features for NGO programme management</h2>
        <div className={styles.features}>
          {FEATURES.map(({ Icon, title, body }) => (
            <div key={title} className={styles.featureCard}>
              <span className={styles.featureIcon} aria-hidden="true"><Icon size={26} /></span>
              <h3 className={styles.featureTitle}>{title}</h3>
              <p className={styles.featureBody}>{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Mobile-first proof ──────────────────────────── */}
      <section className={styles.mobileProof}>
        <h2 className={styles.h2}>Attendance software built for the field, not just the office</h2>
        <p className={styles.mobileProofBody}>
          Impactly is designed mobile-first for staff capturing attendance and updating
          beneficiary profiles from a phone, often on a slow connection. The same data
          syncs back to the office in real time.
        </p>
      </section>

      {/* ── Trust ───────────────────────────────────────── */}
      <section className={styles.trust}>
        <h2 className={styles.h2}>Built in partnership with South African NGOs</h2>
        <p className={styles.trustBody}>
          Impactly is being built and tested in partnership with a South African NGO
          through the Tebelo Tech Hub design partnership.
        </p>
        {/* TODO: replace with a real quote + logo once Tebelo sign-off is confirmed */}
      </section>

      {/* ── POPIA ───────────────────────────────────────── */}
      <section className={styles.popia}>
        <h2 className={styles.h2}>Built with POPIA compliance in mind</h2>
        <p className={styles.popiaBody}>
          Your organisation’s data, including beneficiaries, funders, grants and staff,
          is scoped to your organisation only. We’re documenting exactly how data is
          handled as we go. POPIA compliance is ultimately an operational responsibility
          shared between Impactly and your organisation.
        </p>
        <a href="#popia" className={styles.popiaLink}>Read more about data handling &rarr;</a>
      </section>

      {/* ── Pricing teaser ──────────────────────────────── */}
      <section className={styles.pricing}>
        <h2 className={styles.h2}>Transparent pricing for NGO software</h2>
        <p className={styles.pricingBody}>
          We’re finalising transparent, published pricing. Create an account to get
          started, and we’ll let you know as soon as plans go live.
        </p>
      </section>

      {/* ── FAQ ─────────────────────────────────────────── */}
      <section className={styles.faq}>
        <h2 className={styles.h2}>Frequently asked questions about Impactly</h2>
        <dl className={styles.faqList}>
          {FAQ.map(({ q, a }) => (
            <div key={q} className={styles.faqItem}>
              <dt><h3 className={styles.faqQ}>{q}</h3></dt>
              <dd className={styles.faqA}>{a}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ── Final CTA ───────────────────────────────────── */}
      <section className={styles.finalCta}>
        <h2 className={styles.h2}>Ready to make an impact for your NGO?</h2>
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
