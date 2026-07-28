import { useRef } from 'react';
import { Pencil, Close } from '../../icons.jsx';
import styles from './PhotoUpload.module.css';

// Circular photo picker used wherever a person's icon can be set —
// beneficiary add/edit forms and the onboarding beneficiary step. Purely
// presentational: the parent owns the File/preview-URL lifecycle (object
// URLs need revoking, and "keep vs. replace vs. remove" logic differs
// slightly per caller) and just hands this a URL to show.
export default function PhotoUpload({
  imageUrl,
  initials = '',
  onFileSelected,
  onRemove,
  size = 72,
  label = 'Photo',
}) {
  const inputRef = useRef(null);

  function handleChange(e) {
    const file = e.target.files?.[0];
    if (file) onFileSelected(file);
    e.target.value = '';
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.circleWrap} style={{ width: size, height: size }}>
        {imageUrl ? (
          <img src={imageUrl} alt="" className={styles.image} />
        ) : (
          <span className={styles.initials} aria-hidden="true">{initials}</span>
        )}
        <button
          type="button"
          className={styles.editBtn}
          onClick={() => inputRef.current?.click()}
          aria-label={imageUrl ? `Change ${label.toLowerCase()}` : `Add ${label.toLowerCase()}`}
        >
          <Pencil size={13} />
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className={styles.hiddenInput}
        onChange={handleChange}
        aria-label={label}
      />
      {imageUrl && onRemove && (
        <button type="button" className={styles.removeBtn} onClick={onRemove}>
          <Close size={13} /> Remove photo
        </button>
      )}
    </div>
  );
}
