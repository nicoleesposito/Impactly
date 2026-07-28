import { Pencil, Close } from '../../../components/icons.jsx';
import styles from './PersonRow.module.css';

// List row used for "Added beneficiaries" and "Invited members".
// Provide either an `onEdit` (pencil) or `onRemove` (×) action.
export default function PersonRow({ photoUrl, initials, title, subtitle, onEdit, onRemove }) {
  return (
    <div className={styles.row}>
      {photoUrl ? (
        <img src={photoUrl} alt="" className={styles.avatarImg} />
      ) : (
        <span className={styles.avatar} aria-hidden="true">
          {initials}
        </span>
      )}
      <div className={styles.text}>
        <p className={styles.title}>{title}</p>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
      {onEdit && (
        <button type="button" className={styles.action} onClick={onEdit}>
          <Pencil />
          Edit
        </button>
      )}
      {onRemove && (
        <button
          type="button"
          className={styles.iconAction}
          onClick={onRemove}
          aria-label={`Remove ${title}`}
        >
          <Close />
        </button>
      )}
    </div>
  );
}
