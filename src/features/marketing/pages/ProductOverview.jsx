import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes.js';
import { ChevronRight, Check } from '../../../components/icons.jsx';
import { CAPABILITIES } from '../data/capabilities.js';
import MarketingNav from '../components/MarketingNav.jsx';
import MarketingFooter from '../components/MarketingFooter.jsx';
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

export default function ProductOverview() {
  const { hash } = useLocation();

  useEffect(() => {
    document.title = 'Impactly | Platform Capabilities for NGOs';
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
          <h2 className={styles.h1}>The complete NGO impact management software for South African teams</h2>
          <h3 className={styles.intro}>
            From attendance tracking to funder reporting software, every capability your
            programme needs lives in one place.
          </h3>
        </div>
      </section>

      <section id="features" className={styles.gridSection}>
        <div className={styles.gridInner}>
          <h3 className={styles.h2}>Everything included in your NGO reporting application</h3>
          <p className={styles.gridIntro}>
            Explore every tool built into Impactly, from day-to-day attendance capture to
            year-end funder reporting.
          </p>
          <div className={styles.grid}>
            {CAPABILITIES.map(({ Icon, title, body }) => (
              <div key={title} className={styles.card}>
                <span className={styles.cardIcon} aria-hidden="true"><Icon size={26} /></span>
                <h4 className={styles.cardTitle}>{title}</h4>
                <p className={styles.cardBody}>{body}</p>
              </div>
            ))}
          </div>
          <div className={styles.gridCtas}>
            <Link to={ROUTES.onboardingAccount} className={styles.primaryCta}>
              Get started <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section id="trust" className={styles.trust}>
        <div className={styles.trustInner}>
          <h3 className={styles.h2}>Built and tested with a real NGO</h3>
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
          <div className={styles.trustShowcaseGrid}>
            {TRUST_SCREENSHOTS.map(({ src, alt }) => (
              <img key={src} className={styles.trustShowcaseThumb} src={src} alt={alt} />
            ))}
          </div>
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
                <Link to={ROUTES.onboardingAccount} className={styles.planCta}>{cta}</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="popia" className={styles.popia}>
        <div className={styles.popiaInner}>
          {/* TODO: swap for a real image once one is available */}
          <div className={styles.popiaImage} aria-hidden="true" />
          <div className={styles.popiaCard}>
            <h2 className={styles.h2}>Built with POPIA compliance in mind</h2>
            <p className={styles.popiaBody}>
              Your organisation’s data, including beneficiaries, funders, grants and staff,
              is scoped to your organisation only. We’re documenting exactly how data is
              handled as we go. POPIA compliance is ultimately an operational responsibility
              shared between Impactly and your organisation.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.cta}>
        <div className={styles.ctaInner}>
          <h2 className={styles.h2}>Ready to bring this to your NGO?</h2>
          <Link to={ROUTES.onboardingAccount} className={styles.primaryCta}>
            Create your account <ChevronRight size={16} />
          </Link>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
