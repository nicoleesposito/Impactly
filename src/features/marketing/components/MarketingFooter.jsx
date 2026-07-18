import { BrandMark, Facebook, Instagram, LinkedIn, XLogo } from '../../../components/icons.jsx';
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
