import { useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBeneficiaries } from '../../../context/BeneficiariesContext.jsx';
import { useOrg } from '../../../context/OrgContext.jsx';
import { ChevronLeft, Pencil, FileText, Plus } from '../../../components/icons.jsx';
import styles from './BeneficiaryProfile.module.css';

function initials(b) {
  return `${b.firstName?.[0] ?? ''}${b.lastName?.[0] ?? ''}`.toUpperCase();
}

function fullName(b) {
  return `${b.firstName} ${b.lastName}`.trim();
}

function formatDate(val) {
  if (!val) return '—';
  const d = new Date(val);
  if (isNaN(d.getTime())) return val;
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function BeneficiaryProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { beneficiaries } = useBeneficiaries();
  const { org } = useOrg();

  const [storyImages, setStoryImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const imageInputRef = useRef(null);

  const b = beneficiaries.find((x) => x.id === id);
  const programmes = org?.programmes ?? [];

  if (!b) {
    return (
      <div className={styles.page}>
        <header className={styles.header}>
          <button type="button" className={styles.back} onClick={() => navigate(-1)} aria-label="Back">
            <ChevronLeft size={24} />
          </button>
          <h1 className={styles.title}>Student profile</h1>
        </header>
        <p className={styles.notFound}>Student not found.</p>
      </div>
    );
  }

  const enrolledProgramme = programmes.find((p) => p.id === b.programmeId) ?? null;

  const allImages = [
    ...(b.storyImageUrls ?? []).map((url) => ({ url, local: false })),
    ...imagePreviews.map((url) => ({ url, local: true })),
  ];

  function handleImagesChange(e) {
    const files = Array.from(e.target.files);
    setStoryImages((prev) => [...prev, ...files]);
    setImagePreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
  }

  function removeLocalImage(localIndex) {
    const remoteCount = (b.storyImageUrls ?? []).length;
    const adjustedIndex = localIndex - remoteCount;
    setStoryImages((prev) => prev.filter((_, i) => i !== adjustedIndex));
    setImagePreviews((prev) => {
      URL.revokeObjectURL(prev[adjustedIndex]);
      return prev.filter((_, i) => i !== adjustedIndex);
    });
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button type="button" className={styles.back} onClick={() => navigate(-1)} aria-label="Back">
          <ChevronLeft size={24} />
        </button>
        <h1 className={styles.title}>Student profile</h1>
      </header>

      {/* Identity card */}
      <div className={styles.card}>
        <span className={styles.avatar} aria-hidden="true">{initials(b)}</span>
        <div className={styles.identityBody}>
          <p className={styles.name}>{fullName(b)}</p>
          {b.status && <p className={styles.status}>{b.status}</p>}
        </div>
        <button type="button" className={styles.editBtn} aria-label="Edit profile">
          <Pencil size={16} /> Edit
        </button>
      </div>

      {/* Enrolled programs */}
      {enrolledProgramme && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Enrolled programs</h2>
          <div className={styles.pillRow}>
            <span
              className={styles.programmePill}
              style={{
                background: enrolledProgramme.color ? `${enrolledProgramme.color}22` : undefined,
                color: enrolledProgramme.color ?? undefined,
              }}
            >
              {enrolledProgramme.name}
            </span>
          </div>
          <div className={styles.programmeCard}>
            <div className={styles.programmeCardHeader}>
              <span
                className={styles.programmeAvatar}
                style={{ background: enrolledProgramme.color ?? 'var(--color-primary)' }}
              >
                {enrolledProgramme.shortLabel || enrolledProgramme.name.slice(0, 3).toUpperCase()}
              </span>
              <div>
                <p className={styles.programmeName}>{enrolledProgramme.name}</p>
                {enrolledProgramme.description && (
                  <p className={styles.programmeDesc}>{enrolledProgramme.description}</p>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Personal details */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Personal details</h2>
        <div className={styles.detailCard}>
          <DetailRow label="Date of birth" value={formatDate(b.dob)} />
          <DetailRow label="Gender" value={b.gender || '—'} />
          <DetailRow label="Address" value={b.address || '—'} />
          <DetailRow label="ID number" value={b.idNumber || '—'} last />
        </div>
      </section>

      {/* Emergency contact */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Emergency contact</h2>
        <div className={styles.detailCard}>
          <DetailRow label="Name" value={b.emergencyContactName || '—'} />
          <DetailRow label="Date of birth" value={formatDate(b.emergencyContactDob)} />
          <DetailRow label="Relation" value={b.emergencyContactRelation || '—'} last />
        </div>
      </section>

      {/* Forms & consent documents */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Forms &amp; consent documents</h2>
        <div className={styles.detailCard}>
          {(b.documentUrls ?? []).length === 0 ? (
            <p className={styles.emptyHint}>No documents uploaded.</p>
          ) : (
            (b.documentUrls ?? []).map((url, i) => (
              <div key={url} className={`${styles.docRow} ${i < (b.documentUrls.length - 1) ? styles.docBorder : ''}`}>
                <span className={styles.docLabel}>
                  <FileText size={16} /> Document {i + 1}
                </span>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.viewLink}
                >
                  View PDF
                </a>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Story content */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Story content</h2>
        <div className={styles.detailCard}>
          <p className={styles.subLabel}>IMAGES</p>
          <div className={styles.imageGrid}>
            {allImages.map((img, i) => (
              <div key={img.url} className={styles.imageThumb}>
                <img src={img.url} alt={`Story image ${i + 1}`} className={styles.thumbImg} />
                {img.local && (
                  <button
                    type="button"
                    className={styles.removeImg}
                    onClick={() => removeLocalImage(i)}
                    aria-label="Remove image"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className={styles.addImageBtn}
              onClick={() => imageInputRef.current?.click()}
              aria-label="Add image"
            >
              <Plus size={20} />
            </button>
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              multiple
              className={styles.fileInputHidden}
              onChange={handleImagesChange}
              aria-label="Story images"
            />
          </div>

          <p className={styles.subLabel}>QUOTES</p>
          {b.storyQuotes ? (
            <p className={styles.quoteText}>"{b.storyQuotes}"</p>
          ) : (
            <p className={styles.emptyHint}>No quotes yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}

function DetailRow({ label, value, last }) {
  return (
    <div className={`${styles.detailRow} ${last ? '' : styles.detailBorder}`}>
      <span className={styles.detailLabel}>{label}</span>
      <span className={styles.detailValue}>{value}</span>
    </div>
  );
}
