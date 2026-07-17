import { BrandMark, Mail, Phone, Facebook, Instagram, LinkedIn, XLogo } from '../../../components/icons.jsx';
import styles from './MarketingFooter.module.css';

const SOCIALS = [
  { Icon: Facebook, label: 'Facebook' },
  { Icon: Instagram, label: 'Instagram' },
  { Icon: LinkedIn, label: 'LinkedIn' },
  { Icon: XLogo, label: 'X (Twitter)' },
];

export default function MarketingFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerTop}>
        <span className={styles.footerLogo}>
          <BrandMark size={28} />
          Impactly
        </span>

        <ul className={styles.footerContact}>
          <li>
            <Mail size={16} aria-hidden="true" />
            {/* TODO: replace with a real support inbox once the domain is live */}
            <a href="mailto:hello@impactly.co.za">hello@impactly.co.za</a>
          </li>
          <li>
            <Phone size={16} aria-hidden="true" />
            {/* TODO: replace with a real contact number */}
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
  );
}
