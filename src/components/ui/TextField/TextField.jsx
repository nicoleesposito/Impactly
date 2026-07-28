import { useId } from 'react';
import styles from './TextField.module.css';

// Bordered field with the label stacked inside the box (Figma onboarding style).
// Focus shows a red border; an `error` renders a red border + message below.
export default function TextField({
  label,
  error,
  hint,
  id,
  type = 'text',
  className = '',
  ...props
}) {
  const autoId = useId();
  const inputId = id || autoId;
  const errorId = error ? `${inputId}-error` : undefined;
  const hintId = hint && !error ? `${inputId}-hint` : undefined;

  return (
    <div className={`${styles.wrap} ${className}`}>
      <label
        className={`${styles.field} ${error ? styles.fieldError : ''}`}
        htmlFor={inputId}
      >
        <span className={styles.label}>{label}</span>
        <input
          id={inputId}
          type={type}
          className={styles.input}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={errorId || hintId}
          {...props}
        />
      </label>
      {error && (
        <span id={errorId} className={styles.message} role="alert">
          {error}
        </span>
      )}
      {!error && hint && (
        <span id={hintId} className={styles.hint}>
          {hint}
        </span>
      )}
    </div>
  );
}
