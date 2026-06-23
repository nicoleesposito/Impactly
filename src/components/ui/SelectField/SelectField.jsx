import { useId } from 'react';
import { ChevronDown } from '../../icons.jsx';
import styles from './SelectField.module.css';

// Stacked-label select with the chevron in a rounded square (Figma style).
export default function SelectField({
  label,
  error,
  id,
  options = [],
  placeholder = 'Select',
  className = '',
  value,
  ...props
}) {
  const autoId = useId();
  const selectId = id || autoId;
  const errorId = error ? `${selectId}-error` : undefined;

  return (
    <div className={`${styles.wrap} ${className}`}>
      <label
        className={`${styles.field} ${error ? styles.fieldError : ''}`}
        htmlFor={selectId}
      >
        <span className={styles.label}>{label}</span>
        <select
          id={selectId}
          className={styles.select}
          value={value ?? ''}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={errorId}
          {...props}
        >
          <option value="" disabled hidden>
            {placeholder}
          </option>
          {options.map((opt) => {
            const optValue = typeof opt === 'string' ? opt : opt.value;
            const optLabel = typeof opt === 'string' ? opt : opt.label;
            return (
              <option key={optValue} value={optValue}>
                {optLabel}
              </option>
            );
          })}
        </select>
        <span className={styles.chevron} aria-hidden="true">
          <ChevronDown />
        </span>
      </label>
      {error && (
        <span id={errorId} className={styles.message} role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
