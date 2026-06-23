import styles from './StepProgress.module.css';

// 6-segment progress indicator. Segments 0..step-1 are filled (crimson).
export default function StepProgress({ step, total = 6 }) {
  return (
    <div
      className={styles.bar}
      role="progressbar"
      aria-valuenow={step}
      aria-valuemin={1}
      aria-valuemax={total}
      aria-label={`Step ${step} of ${total}`}
    >
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={i < step ? `${styles.segment} ${styles.done}` : styles.segment}
        />
      ))}
    </div>
  );
}
