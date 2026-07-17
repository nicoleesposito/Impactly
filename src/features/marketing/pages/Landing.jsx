import { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext.jsx';
import { ROUTES } from '../../../constants/routes.js';
import { Mail, Phone, ChevronRight, ChevronDown } from '../../../components/icons.jsx';
import MarketingNav from '../components/MarketingNav.jsx';
import MarketingFooter from '../components/MarketingFooter.jsx';
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

// Placeholder split-section images, same treatment as the hero slides.
const ABOUT_IMAGE = 'linear-gradient(135deg, #6366f1, #3ba55d)';
const PRODUCT_IMAGE = 'linear-gradient(135deg, #a02b3f, #b5762b)';

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
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    document.title = 'Impactly | NGO Attendance & Funder Reporting Software (SA)';
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setActiveSlide((i) => (i + 1) % HERO_SLIDES.length);
    }, HERO_SLIDE_DURATION);
    return () => clearInterval(id);
  }, []);

  // If the page loads (or is client-navigated to) with a section hash in the
  // URL — e.g. arriving from the Product overview subpage via "/#about-us" —
  // scroll to that section once content has laid out.
  useEffect(() => {
    if (window.location.hash) {
      const el = document.querySelector(window.location.hash);
      if (el) requestAnimationFrame(() => el.scrollIntoView({ behavior: 'smooth' }));
    }
  }, []);

  // Render marketing content immediately; only redirect once we positively
  // know the visitor already has a session (avoids blocking on the auth
  // check, which has nothing to do with viewing this page).
  if (!loading && session) return <Navigate to={ROUTES.home} replace />;

  return (
    <div className={styles.page}>
      <MarketingNav />

      {/* ── Hero ────────────────────────────────────────── */}
      <section id="home" className={styles.hero}>
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

      {/* ── About us (two-column, image overlap) ────────── */}
      <section id="about-us" className={styles.split}>
        <div className={styles.splitInner}>
          <div className={styles.splitImage} aria-hidden="true" style={{ backgroundImage: ABOUT_IMAGE }} />
          <div className={styles.splitCard}>
            <h2 className={styles.h2}>About Impactly</h2>
            <p className={styles.splitBody}>
              Impactly is software built specifically for non-profit organisations, helping
              teams spend less time on paperwork and more time with the people they serve.
            </p>
            <h3 className={styles.h3}>Built in partnership with South African NGOs</h3>
            <p className={styles.splitBody}>
              Impactly is being built and tested in partnership with a South African NGO
              through the Tebelo Tech Hub design partnership.
            </p>
            {/* TODO: replace with a real partner quote and logo once Tebelo sign-off is confirmed */}
          </div>
        </div>
      </section>

      {/* ── Product overview (two-column, links to subpage) */}
      <section id="product-overview" className={`${styles.split} ${styles.splitReverse}`}>
        <div className={styles.splitInner}>
          <div className={styles.splitImage} aria-hidden="true" style={{ backgroundImage: PRODUCT_IMAGE }} />
          <div className={styles.splitCard}>
            <h2 className={styles.h2}>Core features for NGO programme management</h2>
            <p className={styles.splitBody}>
              From attendance tracking to funder reporting, Impactly brings every part of
              running an NGO programme into one platform.
            </p>
            <Link to={ROUTES.productOverview} className={styles.splitCta}>
              Explore all capabilities <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Impact ──────────────────────────────────────── */}
      <section id="impact" className={styles.impact}>
        <h2 className={styles.h2}>Making a measurable impact for NGOs</h2>

        <h3 className={styles.h3}>Common challenges in NGO record keeping</h3>
        <ul className={styles.problemList}>
          <li>Paper registers that never make it back to the office.</li>
          <li>Spreadsheets that lock up the moment one person leaves.</li>
          <li>Programme updates scattered across WhatsApp threads.</li>
        </ul>

        <h3 className={styles.h3}>Attendance software built for the field, not just the office</h3>
        <p className={styles.impactBody}>
          Impactly is designed mobile-first for staff capturing attendance and updating
          beneficiary profiles from a phone, often on a slow connection. The same data
          syncs back to the office in real time.
        </p>
      </section>

      {/* ── Contact us ──────────────────────────────────── */}
      <section id="contact-us" className={styles.contact}>
        <h2 className={styles.h2}>Get in touch with Impactly</h2>
        <p className={styles.contactBody}>
          Have a question about Impactly, or want a walkthrough for your organisation?
          Reach out and our team will get back to you.
        </p>
        <ul className={styles.contactList}>
          <li className={styles.contactItem}>
            <span className={styles.contactIcon} aria-hidden="true"><Mail size={18} /></span>
            {/* TODO: replace with a real support inbox once the domain is live */}
            <a href="mailto:hello@impactly.co.za">hello@impactly.co.za</a>
          </li>
          <li className={styles.contactItem}>
            <span className={styles.contactIcon} aria-hidden="true"><Phone size={18} /></span>
            {/* TODO: replace with a real contact number */}
            <span>+27 21 XXX XXXX</span>
          </li>
        </ul>
      </section>

      {/* ── FAQ (accordion) ─────────────────────────────── */}
      <section id="faq" className={styles.faq}>
        <h2 className={styles.h2}>Frequently asked questions about Impactly</h2>
        <div className={styles.faqList}>
          {FAQ.map(({ q, a }, i) => {
            const isOpen = openFaq === i;
            const panelId = `faq-panel-${i}`;
            return (
              <div key={q} className={styles.faqItem}>
                <h3 className={styles.faqQ}>
                  <button
                    type="button"
                    className={styles.faqButton}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                  >
                    {q}
                    <span className={`${styles.faqChevron} ${isOpen ? styles.faqChevronOpen : ''}`} aria-hidden="true">
                      <ChevronDown size={18} />
                    </span>
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  className={`${styles.faqPanel} ${isOpen ? styles.faqPanelOpen : ''}`}
                >
                  <div className={styles.faqPanelInner}>
                    <p className={styles.faqA}>{a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
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
      </section>

      {/* ── Pricing teaser ──────────────────────────────── */}
      <section className={styles.pricing}>
        <h2 className={styles.h2}>Transparent pricing for NGO software</h2>
        <p className={styles.pricingBody}>
          We’re finalising transparent, published pricing. Create an account to get
          started, and we’ll let you know as soon as plans go live.
        </p>
      </section>

      {/* ── Final CTA ───────────────────────────────────── */}
      <section className={styles.finalCta}>
        <h2 className={styles.h2}>Ready to make an impact for your NGO?</h2>
        <Link to={ROUTES.onboardingAccount} className={styles.primaryCta}>
          Create your account <ChevronRight size={16} />
        </Link>
      </section>

      <MarketingFooter />
    </div>
  );
}
