import styles from './MarketingFooter.module.css';

export default function MarketingFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerTop}>
        <span className={styles.footerLogo}>
          <img className={styles.footerLogoImg} src="/images/logo.png" alt="" />
          Impactly
        </span>

        <span className={styles.footerCredit}>Created for Sand Dollar Design</span>
      </div>

      <div className={styles.footerBottom}>
        <span>&copy; {new Date().getFullYear()} Impactly</span>
      </div>
    </footer>
  );
}
