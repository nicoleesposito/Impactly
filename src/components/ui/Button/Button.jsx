import styles from './Button.module.css';

// Primary/secondary button. Extend variants as the design system grows.
export default function Button({
  variant = 'primary',
  type = 'button',
  fullWidth = false,
  className = '',
  children,
  ...props
}) {
  const classes = [styles.btn, styles[variant], fullWidth ? styles.fullWidth : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  );
}
