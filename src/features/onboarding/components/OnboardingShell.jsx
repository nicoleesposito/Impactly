import StepProgress from './StepProgress.jsx';
import styles from './OnboardingShell.module.css';

// Per-step frame: progress bar, eyebrow + title + subtitle, scrollable body,
// and a footer pinned to the bottom of the viewport.
export default function OnboardingShell({
  step,
  label,
  title,
  subtitle,
  children,
  footer,
  below,
  afterFooter,
}) {
  return (
    <div className={styles.shell}>
      <StepProgress step={step} />

      <header className={styles.head}>
        <p className={styles.eyebrow}>
          Step {step} of 6 · {label}
        </p>
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </header>

      <div className={styles.body}>{children}</div>

      <footer className={styles.footer}>
        {footer}
        {below && <div className={styles.below}>{below}</div>}
      </footer>

      {afterFooter && <div className={styles.afterFooter}>{afterFooter}</div>}
    </div>
  );
}
