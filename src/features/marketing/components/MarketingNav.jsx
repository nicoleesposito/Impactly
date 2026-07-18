import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes.js';
import { Menu, Close, ChevronDown } from '../../../components/icons.jsx';
import styles from './MarketingNav.module.css';

// True while the current page has a hero section (marked with
// data-nav-hero) and it's still in view — the nav renders as a large,
// transparent overlay on top of it. Any page without that marker (or once
// the hero has scrolled past) stays in the normal compact/solid form.
function heroInView() {
  const hero = document.querySelector('[data-nav-hero]');
  if (!hero) return false;
  return hero.getBoundingClientRect().bottom > 80;
}

// Anchor links target sections on the Landing page ("/"). Prefixing with "/"
// means they still resolve correctly when clicked from a different page
// (e.g. the Product overview subpage): the browser navigates to "/" first,
// then Landing's mount-time effect scrolls to the matching section id.
const NAV_LINKS = [
  { href: '/#home', label: 'Home' },
  { href: '/#about-us', label: 'About us' },
  {
    to: ROUTES.productOverview,
    label: 'Product Overview',
    dropdown: [
      { to: `${ROUTES.productOverview}#features`, label: 'Features' },
      { to: `${ROUTES.productOverview}#pricing`, label: 'Pricing' },
      { to: `${ROUTES.productOverview}#popia`, label: 'POPIA Compliance' },
    ],
  },
  { href: '/#impact', label: 'Impact' },
  { href: '/#contact-us', label: 'Contact us' },
  { href: '/#faq', label: 'FAQs' },
];

// Maps each in-page section id (present on the Landing page) to the nav
// link key that should be highlighted as active while it's in view.
const SECTION_TO_KEY = {
  home: '/#home',
  'about-us': '/#about-us',
  'product-overview': ROUTES.productOverview,
  impact: '/#impact',
  'contact-us': '/#contact-us',
  faq: '/#faq',
};

export default function MarketingNav() {
  const location = useLocation();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [overlay, setOverlay] = useState(heroInView);
  const [activeKey, setActiveKey] = useState(null);
  const isProductOverviewPage = location.pathname === ROUTES.productOverview;

  useEffect(() => {
    // The lazy useState initializer above runs before this component's own
    // markup (rendered by the page as a sibling, e.g. Landing's hero
    // section) has committed to the real DOM, so the [data-nav-hero] query
    // can't see it yet on that very first call — re-check now that it has.
    function update() {
      setOverlay(heroInView());
    }
    update();
    if (!document.querySelector('[data-nav-hero]')) return undefined;
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [location.pathname]);

  // Highlight whichever nav link matches the section currently in view. The
  // Product overview page has no such sections, so it's just statically
  // active whenever we're on that route.
  useEffect(() => {
    if (isProductOverviewPage) {
      setActiveKey(ROUTES.productOverview);
      return undefined;
    }
    const els = Object.keys(SECTION_TO_KEY)
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    if (els.length === 0) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length === 0) return;
        const topMost = visible.reduce((a, b) => (
          a.boundingClientRect.top < b.boundingClientRect.top ? a : b
        ));
        setActiveKey(SECTION_TO_KEY[topMost.target.id]);
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [isProductOverviewPage]);

  function linkClassName(link) {
    const isActive = activeKey != null && (link.href === activeKey || link.to === activeKey);
    return `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`;
  }

  return (
    <>
      <header className={`${styles.topbar} ${overlay ? styles.topbarOverlay : ''}`}>
        <div className={styles.topbarInner}>
          <a href="/#home" className={styles.wordmark}>
            <img
              className={styles.wordmarkLogo}
              src={overlay ? '/images/logo-white.png' : '/images/logo.png'}
              alt=""
            />
            Impactly
          </a>

          <nav className={styles.navDesktop} aria-label="Primary">
            <ul className={styles.navList}>
              {NAV_LINKS.map((link) => (
                <li key={link.label} className={styles.navItem}>
                  {link.to ? (
                    <Link to={link.to} className={linkClassName(link)}>
                      {link.label}
                      {link.dropdown && (
                        <span className={styles.navChevron} aria-hidden="true">
                          <ChevronDown size={14} />
                        </span>
                      )}
                    </Link>
                  ) : (
                    <a href={link.href} className={linkClassName(link)}>{link.label}</a>
                  )}
                  {link.dropdown && (
                    <ul className={styles.dropdownPanel}>
                      {link.dropdown.map((item) => (
                        <li key={item.label}>
                          <Link to={item.to} className={styles.dropdownLink}>{item.label}</Link>
                        </li>
                      ))}
                    </ul>
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
        </div>
      </header>

      {mobileNavOpen && (
        <nav className={styles.navMobile} aria-label="Primary mobile">
          <ul className={styles.navMobileList}>
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                {link.to ? (
                  <Link
                    to={link.to}
                    className={styles.navMobileLink}
                    onClick={() => setMobileNavOpen(false)}
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    href={link.href}
                    className={styles.navMobileLink}
                    onClick={() => setMobileNavOpen(false)}
                  >
                    {link.label}
                  </a>
                )}
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
    </>
  );
}
