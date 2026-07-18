import { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext.jsx';
import { ROUTES } from '../../../constants/routes.js';
import { ChevronRight, ChevronDown } from '../../../components/icons.jsx';
import MarketingNav from '../components/MarketingNav.jsx';
import MarketingFooter from '../components/MarketingFooter.jsx';
import { trackEvent } from '../../../lib/ga4.js';
import { setPageMeta } from '../../../lib/seo.js';
import styles from './Landing.module.css';

const CONTACT_IMAGE = "url('/images/contact-us.jpg')";

const BENEFITS = [
  {
    title: 'Attendance tracking',
    text: 'Mark who showed up in one tap. No more paper registers that never make it back to the office.',
  },
  {
    title: 'Beneficiary management',
    text: 'One record per person, not five spreadsheets. Nothing lost when a staff member leaves.',
  },
  {
    title: 'Funder reporting',
    text: 'Reports build themselves from data you’ve already captured. No more reconstructing a term’s worth of work from memory before a deadline.',
  },
];

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
    q: 'Why should I choose Impactly?',
    a: 'Impactly was built in direct partnership with a real South African NGO, not designed in a vacuum and hoped it would fit. Every screen has been tested with the field staff, programme managers and administrators who actually use it day to day, so the workflows match how NGOs really operate, not how software vendors assume they do. Instead of stitching together paper registers, a spreadsheet and a WhatsApp group, you get one connected system for attendance tracking, beneficiary management and funder reporting — built specifically as an impact measuring and management tool for non-profits, not a generic business app repurposed for the sector. You can start on the free plan today, export your data at any time with no lock-in, and scale up only once you actually need to.',
  },
  {
    q: 'Does Impactly work on a phone?',
    a: 'Yes. Impactly is built mobile-first, for field staff capturing attendance from a phone in the field, not sitting at a desk. Every core workflow, including marking attendance, adding a beneficiary, or checking today’s numbers, works cleanly on a small screen with one-tap actions, so your team isn’t fighting a desktop layout squeezed onto a phone.',
  },
  {
    q: 'Do I need IT support to set it up?',
    a: 'No. Setup takes around 30 minutes and walks you through creating your organisation, adding your first programmes, and inviting your team. No technical background is needed, and there’s no server to configure or software to install. If you get stuck, our onboarding flow explains each step in plain language, and you can always reach out through the contact form below.',
  },
  {
    q: 'What happens to our data?',
    a: 'Your data is stored per organisation and only accessible to your team, with every organisation’s beneficiaries, funders, grants and staff records fully scoped and separated from every other organisation on the platform. Impactly is being built with South African NGOs and POPIA in mind, and we’re documenting exactly how data is handled as the platform matures. POPIA compliance is ultimately a shared operational responsibility between Impactly and your organisation, not something either party owns alone.',
  },
  {
    q: 'Can we import our existing spreadsheet?',
    a: 'Yes. You can import beneficiaries, funders and grants from a CSV file during setup or at any time from Organisation settings, so switching from spreadsheets doesn’t mean starting from zero. Map your existing columns to Impactly’s fields, review the import before it’s saved, and your historical records carry over instead of being re-typed by hand.',
  },
  {
    q: 'What does it cost?',
    a: 'Impactly has a Free plan covering up to 300 beneficiaries with core programme management, attendance tracking and basic reporting, and a Pro plan at R499/month with unlimited programmes, up to 500 beneficiaries, unlimited reports and exports, and priority support. Every organisation also gets a free 1-month Pro trial with unlimited beneficiaries when they sign up, so you can try the full toolkit before deciding what you need long term.',
  },
  {
    q: 'Can we export our data if we leave?',
    a: 'Yes. Every organisation can export all of its data, including beneficiaries, funders, grants and staff, to CSV at any time, no questions asked. There’s no lock-in and no waiting period — if Impactly stops being the right tool for your organisation, your records leave with you, fully intact.',
  },
];

export default function Landing() {
  const { session, loading } = useAuth();
  const [openFaq, setOpenFaq] = useState(null);
  const [contactSent, setContactSent] = useState(false);

  useEffect(() => {
    setPageMeta({
      title: 'Impactly | NGO Attendance & Funder Reporting Application (SA)',
      description: 'Track attendance, manage beneficiaries and report to funders in one place. NGO impact management software built with a South African NGO.',
      path: '/',
    });
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
    trackEvent('contact_form_submit');
  }

  // Render marketing content immediately; only redirect once we positively
  // know the visitor already has a session (avoids blocking on the auth
  // check, which has nothing to do with viewing this page).
  if (!loading && session) return <Navigate to={ROUTES.home} replace />;

  return (
    <div className={styles.page}>
      <MarketingNav />

      {/* ── Hero ────────────────────────────────────────── */}
      <section id="home" data-nav-hero className={styles.hero}>
        <video
          className={styles.heroVideo}
          src="/videos/hero-banner.mp4"
          poster="/images/hero-poster.jpg"
          preload="metadata"
          autoPlay
          loop
          muted
          playsInline
          aria-hidden="true"
        />
        <div className={styles.heroOverlay} aria-hidden="true" />

        <div className={styles.heroContent}>
          <h1 className={styles.h1}>Your daily NGO impact measuring tool, all in one place</h1>
          <div className={styles.heroDivider} aria-hidden="true" />
          <p className={styles.subhead}>
            Track attendance, manage beneficiaries and report to funders, all in one place.
            Built with a South African NGO, for NGOs who don’t have time to fight their
            tools.
          </p>
          <div className={styles.heroCtas}>
            <Link
              to={ROUTES.onboardingAccount}
              className={styles.primaryCta}
              onClick={() => trackEvent('cta_click', { cta_id: 'hero' })}
            >
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
            <h2 className={styles.h2}>Application that puts your beneficiaries first</h2>
            <p className={styles.splitBody}>
              Impactly exists to help NGOs spend less time on admin and more time on the
              people they serve. From classrooms to community centres, our all-in-one
              platform replaces scattered spreadsheets and paperwork with one connected
              system built around your mission.
            </p>
            <h3 className={styles.h3}>Built for people who run programmes, not systems</h3>
            <p className={styles.splitBody}>
              Impactly is for NGO field staff, programme managers and administrators at
              small to mid-sized organisations. No dedicated IT team. No time for a steep
              learning curve. If you’re currently running your programme out of a notebook,
              a shared spreadsheet and a WhatsApp group, this is for you.
            </p>
            <div className={styles.splitCtas}>
              <Link
                to={ROUTES.onboardingAccount}
                className={styles.splitCta}
                onClick={() => trackEvent('cta_click', { cta_id: 'about_us' })}
              >
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
            <h2 className={styles.h2}>The complete toolkit for NGO programme management</h2>
            <p className={styles.splitBody}>
              From attendance tracking to funder reporting, Impactly brings every part of
              running your programme into one seamless platform. Spend less time switching
              between tools, and more time creating impact.
            </p>
            <ul className={styles.benefitList}>
              {BENEFITS.map(({ title, text }) => (
                <li key={title}>
                  <h3 className={styles.benefitTitle}>{title}</h3>
                  <p className={styles.benefitText}>{text}</p>
                </li>
              ))}
            </ul>
            <div className={styles.splitCtas}>
              <Link
                to={ROUTES.productOverview}
                className={styles.splitCta}
                onClick={() => trackEvent('cta_click', { cta_id: 'product_overview_view_all' })}
              >
                View all capabilities <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Impact ──────────────────────────────────────── */}
      <section id="impact" className={styles.impact}>
        <div className={styles.impactInner}>
          <h2 className={styles.h2}>Making a measurable impact for NGOs</h2>

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

          <blockquote className={styles.impactQuote}>
            <p className={styles.impactQuoteText}>
              “One of the children was not feeling well, so we had to notify a parent.
              However, the number I had did not go through. People change their contact
              details from time to time, so we had to go through the file to find
              alternative numbers, but the programme director had taken the file over the
              school holidays and did not bring it back. There was not much we could do.
              We had to drive to the child’s home, not knowing whether the parent would be
              there. But fortunately for us, the parent was at home.”
            </p>
            <cite className={styles.impactQuoteCite}>— Tebelo Tech Hub staff member</cite>
          </blockquote>

          <div className={styles.impactCtas}>
            <a
              href="#contact-us"
              className={styles.splitCta}
              onClick={() => trackEvent('cta_click', { cta_id: 'impact_get_in_touch' })}
            >
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
            <h2 className={styles.h2}>Get in touch about our NGO application</h2>
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
          <h2 className={styles.h2}>Frequently Asked Questions</h2>
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
