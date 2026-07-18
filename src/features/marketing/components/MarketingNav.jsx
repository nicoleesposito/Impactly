import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes.js';
import { Menu, Close, ChevronDown } from '../../../components/icons.jsx';
import styles from './MarketingNav.module.css';

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

export default function MarketingNav() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <>
      <header className={styles.topbar}>
        <div className={styles.topbarInner}>
          <a href="/#home" className={styles.wordmark}>
            <img className={styles.wordmarkLogo} src="/images/logo.png" alt="" />
            Impactly
          </a>

          <nav className={styles.navDesktop} aria-label="Primary">
            <ul className={styles.navList}>
              {NAV_LINKS.map((link) => (
                <li key={link.label} className={styles.navItem}>
                  {link.to ? (
                    <Link to={link.to} className={styles.navLink}>
                      {link.label}
                      {link.dropdown && (
                        <span className={styles.navChevron} aria-hidden="true">
                          <ChevronDown size={14} />
                        </span>
                      )}
                    </Link>
                  ) : (
                    <a href={link.href} className={styles.navLink}>{link.label}</a>
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
