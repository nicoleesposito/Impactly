import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes.js';
import { ChevronRight } from '../../../components/icons.jsx';
import { CAPABILITIES } from '../data/capabilities.js';
import MarketingNav from '../components/MarketingNav.jsx';
import MarketingFooter from '../components/MarketingFooter.jsx';
import styles from './ProductOverview.module.css';

export default function ProductOverview() {
  const { hash } = useLocation();

  useEffect(() => {
    document.title = 'Impactly | Platform Capabilities for NGOs';
  }, []);

  // Scroll to the matching section whenever the hash changes — both on
  // first load (e.g. a fresh visit to "/product-overview#pricing") and on
  // in-app navigation, since the nav's Product Overview dropdown links
  // between anchors on this same route without remounting the page.
  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) requestAnimationFrame(() => el.scrollIntoView({ behavior: 'smooth' }));
    }
  }, [hash]);

  return (
    <div className={styles.page}>
      <MarketingNav />

      <section className={styles.header}>
        <div className={styles.headerInner}>
          <h1 className={styles.h1}>Impactly platform capabilities for NGOs</h1>
          <p className={styles.intro}>
            From attendance tracking to funder reporting, Impactly brings every part of
            running an NGO programme into one platform. Here is everything included.
          </p>
        </div>
      </section>

      <section id="features" className={styles.gridSection}>
        <div className={styles.grid}>
          {CAPABILITIES.map(({ Icon, title, body }) => (
            <div key={title} className={styles.card}>
              <span className={styles.cardIcon} aria-hidden="true"><Icon size={26} /></span>
              <h2 className={styles.cardTitle}>{title}</h2>
              <p className={styles.cardBody}>{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="popia" className={styles.popia}>
        <div className={styles.popiaInner}>
          <h2 className={styles.h2}>Built with POPIA compliance in mind</h2>
          <p className={styles.popiaBody}>
            Your organisation’s data, including beneficiaries, funders, grants and staff,
            is scoped to your organisation only. We’re documenting exactly how data is
            handled as we go. POPIA compliance is ultimately an operational responsibility
            shared between Impactly and your organisation.
          </p>
        </div>
      </section>

      <section id="pricing" className={styles.pricing}>
        <div className={styles.pricingInner}>
          <h2 className={styles.h2}>Transparent pricing for NGO software</h2>
          <p className={styles.pricingBody}>
            We’re finalising transparent, published pricing. Create an account to get
            started, and we’ll let you know as soon as plans go live.
          </p>
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
