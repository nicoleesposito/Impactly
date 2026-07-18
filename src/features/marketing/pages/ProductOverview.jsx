import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes.js';
import { ChevronLeft, ChevronRight, Check } from '../../../components/icons.jsx';
import { CAPABILITIES } from '../data/capabilities.js';
import MarketingNav from '../components/MarketingNav.jsx';
import MarketingFooter from '../components/MarketingFooter.jsx';
import { trackEvent } from '../../../lib/ga4.js';
import { setPageMeta } from '../../../lib/seo.js';
import styles from './ProductOverview.module.css';

const TRUST_SCREENSHOTS = [
  {
    src: '/images/trust/trust-attendance-overview.webp',
    alt: 'Impactly attendance overview screen showing present today, attendance rate and a breakdown by programme',
  },
  {
    src: '/images/trust/trust-attendance-capture.webp',
    alt: 'Impactly attendance capture screen for the after-school literacy programme with present, absent and late buttons per beneficiary',
  },
  {
    src: '/images/trust/trust-reports.webp',
    alt: 'Impactly reports screen showing reports due soon, in progress and completed',
  },
  {
    src: '/images/trust/trust-grants-tracker.webp',
    alt: 'Impactly grants tracker screen showing open applications, pending decisions and amount awarded',
  },
  {
    src: '/images/trust/trust-more-menu.webp',
    alt: 'Impactly more menu showing funding, settings and support options',
  },
  {
    src: '/images/trust/trust-schedule-report.webp',
    alt: 'Impactly schedule a report screen with report details, schedule and delivery channel options',
  },
  {
    src: '/images/trust/trust-student-profile.webp',
    alt: 'Impactly student profile screen showing enrolled programmes, personal details and story content',
  },
];

const PLANS = [
  {
    name: 'Free',
    price: 'R0',
    priceNote: '/month',
    description: 'Get started with the essentials.',
    features: [
      'Up to 300 beneficiaries',
      'Core programme management',
      'Attendance tracking',
      'Basic reporting',
    ],
    cta: 'Get started',
  },
  {
    name: 'Pro',
    price: 'R499',
    priceNote: '/month',
    description: 'For growing organisations.',
    features: [
      'Unlimited programmes',
      'Up to 500 beneficiaries',
      'Unlimited reports & exports',
      'Priority support',
    ],
    cta: 'Get started',
  },
];

// Auto-advances through the app screenshots, pausing on hover so a visitor
// who stops to look at a slide isn't fighting the timer.
function TrustCarousel({ slides }) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return undefined;
    const id = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length);
    }, 3500);
    return () => clearInterval(id);
  }, [paused, slides.length]);

  return (
    <div
      className={styles.carousel}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className={styles.carouselViewport}>
        <div
          className={styles.carouselTrack}
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {slides.map(({ src, alt }) => (
            <div key={src} className={styles.carouselSlide}>
              <img className={styles.carouselImage} src={src} alt={alt} />
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        className={`${styles.carouselArrow} ${styles.carouselArrowPrev}`}
        aria-label="Previous screenshot"
        onClick={() => setCurrent((c) => (c - 1 + slides.length) % slides.length)}
      >
        <ChevronLeft size={20} />
      </button>
      <button
        type="button"
        className={`${styles.carouselArrow} ${styles.carouselArrowNext}`}
        aria-label="Next screenshot"
        onClick={() => setCurrent((c) => (c + 1) % slides.length)}
      >
        <ChevronRight size={20} />
      </button>

      <div className={styles.carouselDots}>
        {slides.map((slide, i) => (
          <button
            key={slide.src}
            type="button"
            className={`${styles.carouselDot} ${i === current ? styles.carouselDotActive : ''}`}
            aria-label={`Go to screenshot ${i + 1}`}
            aria-current={i === current}
            onClick={() => setCurrent(i)}
          />
        ))}
      </div>
    </div>
  );
}

export default function ProductOverview() {
  const { hash } = useLocation();

  useEffect(() => {
    setPageMeta({
      title: 'Impactly | Platform Capabilities for NGOs',
      description: 'Explore every Impactly capability: attendance tracking, beneficiary management, funder reporting, scheduled reports, data import/export and role-based access.',
      path: ROUTES.productOverview,
    });
  }, []);

  // Scroll to the matching section whenever the hash changes — both on
  // first load (e.g. a fresh visit to "/product-overview#pricing") and on
  // in-app navigation, since the nav's Product Overview dropdown links
  // between anchors on this same route without remounting the page. With no
  // hash (e.g. clicking the plain "Product Overview" nav link), jump to the
  // top instead — React Router doesn't reset scroll position on its own,
  // so without this the page would open wherever the previous page had
  // scrolled to.
  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) requestAnimationFrame(() => el.scrollIntoView({ behavior: 'smooth' }));
    } else {
      window.scrollTo(0, 0);
    }
  }, [hash]);

  return (
    <div className={styles.page}>
      <MarketingNav />

      <section data-nav-hero className={styles.hero}>
        <div className={styles.heroBg} aria-hidden="true" />
        <div className={styles.heroOverlay} aria-hidden="true" />
        <div className={styles.headerInner}>
          <h1 className={styles.h1}>The complete NGO impact management software</h1>
          <p className={styles.intro}>
            From attendance tracking to funder reporting software, every capability your
            programme needs lives in one place.
          </p>
        </div>
      </section>

      <section id="features" className={styles.gridSection}>
        <div className={styles.gridInner}>
          <h2 className={styles.h2}>Everything included in your NGO reporting application</h2>
          <p className={styles.gridIntro}>
            Explore every tool built into Impactly, from day-to-day attendance capture to
            year-end funder reporting.
          </p>
          <div className={styles.grid}>
            {CAPABILITIES.map(({ Icon, title, body }) => (
              <div key={title} className={styles.card}>
                <span className={styles.cardIcon} aria-hidden="true"><Icon size={26} /></span>
                <h3 className={styles.cardTitle}>{title}</h3>
                <p className={styles.cardBody}>{body}</p>
              </div>
            ))}
          </div>
          <div className={styles.gridCtas}>
            <Link
              to={ROUTES.onboardingAccount}
              className={styles.primaryCta}
              onClick={() => trackEvent('cta_click', { cta_id: 'features' })}
            >
              Get started <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section id="trust" className={styles.trust}>
        <div className={styles.trustInner}>
          <h2 className={styles.h2}>Built and tested with a real NGO</h2>
          <p className={styles.trustBody}>
            Impactly is being built in direct partnership with Tebelo Tech Hub, a South
            African community development NGO running literacy, digital skills and youth
            development programmes. Every screen has been tested with the people who’ll
            actually use it: field staff, programme managers and administrators.
          </p>
        </div>

        <div className={styles.trustShowcase}>
          <img
            className={styles.trustShowcaseMain}
            src="/images/trust/trust-annotated.webp"
            alt="Impactly home screen annotated with callouts explaining programmes at a glance, key metrics, upcoming tasks, notifications and one-tap attendance capture"
          />
          <TrustCarousel slides={TRUST_SCREENSHOTS} />
        </div>
      </section>

      <section id="pricing" className={styles.pricing}>
        <div className={styles.pricingInner}>
          <h2 className={styles.h2}>Transparent pricing for NGO software</h2>
          <p className={styles.pricingBody}>
            All organisations get a free 1-month Pro trial with unlimited beneficiaries.
            After the trial, plans supporting more than 300 beneficiaries require a paid
            subscription.
          </p>
          <div className={styles.pricingGrid}>
            {PLANS.map(({ name, price, priceNote, description, features, cta }) => (
              <div key={name} className={styles.planCard}>
                <h3 className={styles.planName}>{name}</h3>
                <p className={styles.planPrice}>
                  {price}
                  <span className={styles.planPriceNote}>{priceNote}</span>
                </p>
                <p className={styles.planDescription}>{description}</p>
                <ul className={styles.planFeatures}>
                  {features.map((feature) => (
                    <li key={feature}>
                      <Check size={16} /> {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  to={ROUTES.onboardingAccount}
                  className={styles.planCta}
                  onClick={() => trackEvent('cta_click', { cta_id: `plan_${name.toLowerCase()}` })}
                >
                  {cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="popia" className={styles.popia}>
        <div className={styles.popiaInner}>
          <img className={styles.popiaImage} src="/images/popia-flag.jpg" alt="South African flag" />
          <div className={styles.popiaCard}>
            <h2 className={styles.h2}>Built with POPIA compliance in mind</h2>
            <p className={styles.popiaBody}>
              Your organisation’s data, including beneficiaries, funders, grants and staff,
              is scoped to your organisation only. We’re documenting exactly how data is
              handled as we go. POPIA compliance is ultimately an operational responsibility
              shared between Impactly and your organisation.
            </p>
            <div className={styles.popiaCtas}>
              <Link
                to={ROUTES.onboardingAccount}
                className={styles.primaryCta}
                onClick={() => trackEvent('cta_click', { cta_id: 'popia' })}
              >
                Get started <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.cta}>
        <div className={styles.ctaInner}>
          <h2 className={styles.h2}>Ready to bring this to your NGO?</h2>
          <Link
            to={ROUTES.onboardingAccount}
            className={styles.primaryCta}
            onClick={() => trackEvent('cta_click', { cta_id: 'closing' })}
          >
            Create your account <ChevronRight size={16} />
          </Link>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
