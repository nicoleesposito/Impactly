import { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext.jsx';
import { ROUTES } from '../../../constants/routes.js';
import {
  BrandMark,
  ClipboardCheck,
  Users,
  FileText,
  CalendarDays,
  UploadCloud,
  Mail,
  Phone,
  ChevronRight,
  ChevronDown,
  Menu,
  Close,
  Facebook,
  Instagram,
  LinkedIn,
  XLogo,
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

const NAV_LINKS = [
  { href: '#home', label: 'Home' },
  { href: '#about-us', label: 'About us' },
  { href: '#contact-us', label: 'Contact us' },
  { href: '#product-overview', label: 'Product overview', megaMenu: true },
  { href: '#impact', label: 'Impact' },
];

// Shared by the Product overview section cards and the nav hover preview.
const CAPABILITIES = [
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
  {
    Icon: CalendarDays,
    title: 'Scheduled reports',
    body: 'Automate delivery to funders and your team by email or WhatsApp.',
  },
  {
    Icon: UploadCloud,
    title: 'Data import and export',
    body: 'Bring in an existing spreadsheet, or export everything to CSV at any time.',
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

const SOCIALS = [
  { Icon: Facebook, label: 'Facebook' },
  { Icon: Instagram, label: 'Instagram' },
  { Icon: LinkedIn, label: 'LinkedIn' },
  { Icon: XLogo, label: 'X (Twitter)' },
];

export default function Landing() {
  const { session, loading } = useAuth();
  const [activeSlide, setActiveSlide] = useState(0);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
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

  // Render marketing content immediately; only redirect once we positively
  // know the visitor already has a session (avoids blocking on the auth
  // check, which has nothing to do with viewing this page).
  if (!loading && session) return <Navigate to={ROUTES.home} replace />;

  return (
    <div className={styles.page}>
      {/* ── Top bar ─────────────────────────────────────── */}
      <header className={styles.topbar}>
        <a href="#home" className={styles.wordmark}>
          <BrandMark size={28} />
          Impactly
        </a>

        <nav className={styles.navDesktop} aria-label="Primary">
          <ul className={styles.navList}>
            {NAV_LINKS.map((link) => (
              <li
                key={link.href}
                className={link.megaMenu ? styles.navItemMega : styles.navItem}
              >
                <a href={link.href} className={styles.navLink}>{link.label}</a>
                {link.megaMenu && (
                  <div className={styles.megaMenu}>
                    <div className={styles.megaMenuGrid}>
                      {CAPABILITIES.map(({ Icon, title, body }) => (
                        <a key={title} href="#product-overview" className={styles.megaMenuItem}>
                          <span className={styles.megaMenuIcon} aria-hidden="true"><Icon size={20} /></span>
                          <span>
                            <span className={styles.megaMenuTitle}>{title}</span>
                            <span className={styles.megaMenuBody}>{body}</span>
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.topbarActions}>
          <Link to={ROUTES.signIn} className={styles.logIn}>Log in</Link>
          <Link to={ROUTES.onboardingAccount} className={styles.topCta}>Create your account</Link>
          <button
            type="button"
            className={styles.navToggle}
            aria-label={mobileNavOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileNavOpen}
            onClick={() => setMobileNavOpen((o) => !o)}
          >
            {mobileNavOpen ? <Close size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* ── Mobile nav panel ────────────────────────────── */}
      {mobileNavOpen && (
        <nav className={styles.navMobile} aria-label="Primary mobile">
          <ul className={styles.navMobileList}>
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={styles.navMobileLink}
                  onClick={() => setMobileNavOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <Link
                to={ROUTES.signIn}
                className={styles.navMobileLogIn}
                onClick={() => setMobileNavOpen(false)}
              >
                Log in
              </Link>
            </li>
          </ul>
        </nav>
      )}

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

      {/* ── About us ────────────────────────────────────── */}
      <section id="about-us" className={styles.about}>
        <h2 className={styles.h2}>About Impactly</h2>
        <p className={styles.aboutBody}>
          Impactly is software built specifically for non-profit organisations, helping
          teams spend less time on paperwork and more time with the people they serve.
        </p>

        <h3 className={styles.h3}>Built in partnership with South African NGOs</h3>
        <p className={styles.aboutBody}>
          Impactly is being built and tested in partnership with a South African NGO
          through the Tebelo Tech Hub design partnership.
        </p>
        {/* TODO: replace with a real partner quote and logo once Tebelo sign-off is confirmed */}
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

      {/* ── Product overview ────────────────────────────── */}
      <section id="product-overview" className={styles.featuresSection}>
        <h2 className={styles.h2}>Core features for NGO programme management</h2>
        <div className={styles.features}>
          {CAPABILITIES.map(({ Icon, title, body }) => (
            <div key={title} className={styles.featureCard}>
              <span className={styles.featureIcon} aria-hidden="true"><Icon size={26} /></span>
              <h3 className={styles.featureTitle}>{title}</h3>
              <p className={styles.featureBody}>{body}</p>
            </div>
          ))}
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

      {/* ── POPIA ───────────────────────────────────────── */}
      <section id="popia" className={styles.popia}>
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

      {/* ── FAQ (accordion) ─────────────────────────────── */}
      <section className={styles.faq}>
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

      {/* ── Final CTA ───────────────────────────────────── */}
      <section className={styles.finalCta}>
        <h2 className={styles.h2}>Ready to make an impact for your NGO?</h2>
        <Link to={ROUTES.onboardingAccount} className={styles.primaryCta}>
          Create your account <ChevronRight size={16} />
        </Link>
      </section>

      {/* ── Footer ──────────────────────────────────────── */}
      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <span className={styles.footerLogo}>
            <BrandMark size={28} />
            Impactly
          </span>

          <ul className={styles.footerContact}>
            <li>
              <Mail size={16} aria-hidden="true" />
              <a href="mailto:hello@impactly.co.za">hello@impactly.co.za</a>
            </li>
            <li>
              <Phone size={16} aria-hidden="true" />
              <span>+27 21 XXX XXXX</span>
            </li>
          </ul>

          <ul className={styles.footerSocials}>
            {SOCIALS.map(({ Icon, label }) => (
              <li key={label}>
                {/* Placeholder — swap href for the real profile once it exists */}
                <a href="#" className={styles.footerSocialLink} aria-label={label}>
                  <Icon size={18} />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.footerBottom}>
          <span>&copy; {new Date().getFullYear()} Impactly</span>
        </div>
      </footer>
    </div>
  );
}
