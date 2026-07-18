import { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext.jsx';
import { ROUTES } from '../../../constants/routes.js';
import { ChevronRight, ChevronDown } from '../../../components/icons.jsx';
import MarketingNav from '../components/MarketingNav.jsx';
import MarketingFooter from '../components/MarketingFooter.jsx';
import styles from './Landing.module.css';

const CONTACT_IMAGE = "url('/images/contact-us.jpg')";

const CHALLENGES = [
  {
    text: 'Paper registers that never make it back to the office.',
    icon: '/images/icons/paper-registers.png',
  },
  {
    text: 'Spreadsheets that lock up the moment one person leaves.',
    icon: '/images/icons/spreadsheets-locked.png',
  },
  {
    text: 'Programme updates scattered across WhatsApp threads.',
    icon: '/images/icons/whatsapp-threads.png',
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
  const [openFaq, setOpenFaq] = useState(null);
  const [contactSent, setContactSent] = useState(false);

  useEffect(() => {
    document.title = 'Impactly | NGO Attendance & Funder Reporting Application (SA)';
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

  // No backend wired up yet — this just gives the visitor feedback that
  // their message was captured.
  function handleContactSubmit(e) {
    e.preventDefault();
    setContactSent(true);
  }

  // Render marketing content immediately; only redirect once we positively
  // know the visitor already has a session (avoids blocking on the auth
  // check, which has nothing to do with viewing this page).
  if (!loading && session) return <Navigate to={ROUTES.home} replace />;

  return (
    <div className={styles.page}>
      <MarketingNav />

      {/* ── Hero ────────────────────────────────────────── */}
      <section id="home" className={styles.hero}>
        <video
          className={styles.heroVideo}
          src="/videos/hero-banner.mp4"
          autoPlay
          loop
          muted
          playsInline
          aria-hidden="true"
        />
        <div className={styles.heroOverlay} aria-hidden="true" />

        <div className={styles.heroContent}>
          <h3 className={styles.h1}>Your daily NGO impact measuring tool, all in one place</h3>
          <div className={styles.heroDivider} aria-hidden="true" />
          <h2 className={styles.subhead}>
            South Africa&rsquo;s NGO impact management application for attendance, beneficiary
            management and funder reporting.
          </h2>
          <div className={styles.heroCtas}>
            <Link to={ROUTES.onboardingAccount} className={styles.primaryCta}>
              Get Started <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── About us (two-column, image overlap) ────────── */}
      <section id="about-us" className={styles.split}>
        <div className={styles.splitInner}>
          <div className={`${styles.splitImage} ${styles.aboutImageWrap}`}>
            <img
              className={styles.aboutImage}
              src="/images/about-us.jpg"
              alt="Two students at a school desk exploring photos together on a laptop"
            />
          </div>
          <div className={styles.splitCard}>
            <h3 className={styles.h2}>Application that puts your beneficiaries first</h3>
            <p className={styles.splitBody}>
              Impactly exists to help NGOs spend less time on admin and more time on the
              people they serve. From classrooms to community centres, our all-in-one
              platform replaces scattered spreadsheets and paperwork with one connected
              system built around your mission.
            </p>
            <h4 className={styles.h3}>Built in partnership with South African NGOs</h4>
            <p className={styles.splitBody}>
              Impactly is being built and tested in partnership with a South African NGO
              through the Tebelo Tech Hub design partnership.
            </p>
            {/* TODO: replace with a real partner quote and logo once Tebelo sign-off is confirmed */}
            <div className={styles.splitCtas}>
              <Link to={ROUTES.onboardingAccount} className={styles.splitCta}>
                Get started today <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Product overview (two-column, links to subpage) */}
      <section id="product-overview" className={`${styles.split} ${styles.splitReverse}`}>
        <div className={styles.splitInner}>
          <div className={`${styles.splitImage} ${styles.productImageWrap}`}>
            <img
              className={styles.productImage}
              src="/images/product-overview.webp"
              alt="Impactly dashboard on a phone, annotated with callouts explaining programmes at a glance, key metrics, upcoming tasks, notifications, one-tap attendance capture, smarter reporting and attendance analysis"
            />
          </div>
          <div className={styles.splitCard}>
            <h3 className={styles.h2}>The complete toolkit for NGO programme management</h3>
            <p className={styles.splitBody}>
              From attendance tracking to funder reporting, Impactly brings every part of
              running your programme into one seamless platform. Spend less time switching
              between tools, and more time creating impact.
            </p>
            <div className={styles.splitCtas}>
              <Link to={ROUTES.productOverview} className={styles.splitCta}>
                View all capabilities <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Impact ──────────────────────────────────────── */}
      <section id="impact" className={styles.impact}>
        <div className={styles.impactInner}>
          <h3 className={styles.h2}>Making a measurable impact for NGOs</h3>

          <p className={styles.impactIntro}>
            Most non-profits still rely on paper registers, spreadsheets, and scattered
            WhatsApp messages to keep their programmes running. These outdated tools make
            it difficult to report accurately to funders, and they put years of beneficiary
            records at risk every time a staff member leaves. These are the challenges we
            hear about most from non-government-organisations across South Africa.
          </p>
          <div className={styles.challengeGrid}>
            {CHALLENGES.map(({ text, icon }) => (
              <div key={text} className={styles.challengeBox}>
                <p className={styles.challengeText}>{text}</p>
                <div className={styles.challengeImage} aria-hidden="true">
                  <img className={styles.challengeIcon} src={icon} alt="" />
                </div>
              </div>
            ))}
          </div>

          <div className={styles.impactCtas}>
            <a href="#contact-us" className={styles.splitCta}>
              Get In Touch <ChevronRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* ── Contact us (full-bleed image, two-column) ───── */}
      <section id="contact-us" className={styles.contactSection}>
        <div className={styles.contactBg} aria-hidden="true" style={{ backgroundImage: CONTACT_IMAGE }} />
        <div className={styles.contactGrid}>
          <div className={styles.contactCard}>
            <h3 className={styles.h2}>Get in touch about our NGO application</h3>
            <p className={styles.contactBody}>
              Have a question about Impactly? Reach out and our team will get back to you.
            </p>

            {contactSent ? (
              <p className={styles.contactThanks}>Thanks — we’ll be in touch soon.</p>
            ) : (
              <form className={styles.contactForm} onSubmit={handleContactSubmit}>
                <label className={styles.contactLabel} htmlFor="contact-name">Name</label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  className={styles.contactInput}
                  placeholder="Your name"
                />
                <label className={styles.contactLabel} htmlFor="contact-email">Email</label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  className={styles.contactInput}
                  placeholder="you@example.org"
                />
                <label className={styles.contactLabel} htmlFor="contact-message">Message</label>
                <textarea
                  id="contact-message"
                  required
                  rows={4}
                  className={styles.contactTextarea}
                  placeholder="How can we help?"
                />
                <button type="submit" className={styles.contactSubmit}>Send message</button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ── FAQ (accordion) ─────────────────────────────── */}
      <section id="faq" className={styles.faq}>
        <div className={styles.faqInner}>
          <h3 className={styles.h2}>Frequently Asked Questions</h3>
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
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
