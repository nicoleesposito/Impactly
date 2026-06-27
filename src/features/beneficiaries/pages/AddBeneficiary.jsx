import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBeneficiaries } from '../../../context/BeneficiariesContext.jsx';
import { useOrg } from '../../../context/OrgContext.jsx';
import { useProgrammeFilter } from '../../../context/ProgrammeFilterContext.jsx';
import { ChevronLeft } from '../../../components/icons.jsx';
import styles from './AddBeneficiary.module.css';

const GENDER_OPTIONS = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];
const RELATION_OPTIONS = ['Mother', 'Father', 'Guardian', 'Grandparent', 'Sibling', 'Other'];

function CalendarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

export default function AddBeneficiary() {
  const navigate = useNavigate();
  const { addBeneficiary } = useBeneficiaries();
  const { org, beneficiaryLabel } = useOrg();
  const { activeProgramme } = useProgrammeFilter();

  const programmes = org?.programmes ?? [];
  const label = beneficiaryLabel || 'Beneficiaries';
  const singular = label.replace(/s$/i, '');

  const preselectedProgramme = activeProgramme !== 'all' ? activeProgramme : '';

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    gender: '',
    address: '',
    idNumber: '',
    emergencyContactName: '',
    emergencyContactDob: '',
    emergencyContactRelation: '',
    storyQuotes: '',
    programmeId: preselectedProgramme,
  });

  // Document files (up to 2 PDFs)
  const [docFiles, setDocFiles] = useState([null, null]);
  // Story image files
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const docInputRefs = [useRef(null), useRef(null)];
  const imageInputRef = useRef(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  function handleDocChange(index, e) {
    const file = e.target.files[0] ?? null;
    setDocFiles((prev) => {
      const next = [...prev];
      next[index] = file;
      return next;
    });
  }

  function handleImagesChange(e) {
    const files = Array.from(e.target.files);
    setImageFiles((prev) => [...prev, ...files]);
    const previews = files.map((f) => URL.createObjectURL(f));
    setImagePreviews((prev) => [...prev, ...previews]);
  }

  function removeImage(index) {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.firstName.trim()) {
      setError('Please enter a first name.');
      return;
    }
    setError('');
    setSubmitting(true);

    await addBeneficiary({
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      dob: form.dob || null,
      gender: form.gender || null,
      address: form.address.trim() || null,
      idNumber: form.idNumber.trim() || null,
      emergencyContactName: form.emergencyContactName.trim() || null,
      emergencyContactDob: form.emergencyContactDob || null,
      emergencyContactRelation: form.emergencyContactRelation || null,
      storyQuotes: form.storyQuotes.trim() || null,
      programmeId: form.programmeId || null,
      documentFiles: docFiles.filter(Boolean),
      storyImageFiles: imageFiles,
    });

    setSubmitting(false);
    navigate(-1);
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button type="button" className={styles.back} onClick={() => navigate(-1)} aria-label="Back">
          <ChevronLeft size={24} />
        </button>
        <h1 className={styles.title}>Add {singular.toLowerCase()}</h1>
      </header>

      <form className={styles.form} onSubmit={handleSubmit} noValidate>

        {/* Personal details */}
        <fieldset className={styles.card}>
          <legend className={styles.cardTitle}>Personal details</legend>
          <input
            className={styles.input}
            placeholder="First name"
            value={form.firstName}
            onChange={update('firstName')}
            aria-label="First name"
            autoComplete="given-name"
          />
          <input
            className={styles.input}
            placeholder="Last name"
            value={form.lastName}
            onChange={update('lastName')}
            aria-label="Last name"
            autoComplete="family-name"
          />
          <div className={styles.dateWrap}>
            <input
              type="date"
              className={styles.input}
              value={form.dob}
              onChange={update('dob')}
              aria-label="Date of birth"
            />
            <span className={styles.calIcon} aria-hidden="true"><CalendarIcon /></span>
          </div>
          <div className={styles.selectWrap}>
            <select
              className={`${styles.select} ${!form.gender ? styles.placeholder : ''}`}
              value={form.gender}
              onChange={update('gender')}
              aria-label="Gender"
            >
              <option value="">Gender (optional)</option>
              {GENDER_OPTIONS.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
          <input
            className={styles.input}
            placeholder="Address"
            value={form.address}
            onChange={update('address')}
            aria-label="Address"
            autoComplete="street-address"
          />
          <input
            className={styles.input}
            placeholder="ID number"
            value={form.idNumber}
            onChange={update('idNumber')}
            aria-label="ID number"
            inputMode="numeric"
          />
        </fieldset>

        {/* Emergency contact */}
        <fieldset className={styles.card}>
          <legend className={styles.cardTitle}>Emergency contact</legend>
          <input
            className={styles.input}
            placeholder="Full name"
            value={form.emergencyContactName}
            onChange={update('emergencyContactName')}
            aria-label="Emergency contact name"
            autoComplete="off"
          />
          <div className={styles.dateWrap}>
            <input
              type="date"
              className={styles.input}
              value={form.emergencyContactDob}
              onChange={update('emergencyContactDob')}
              aria-label="Emergency contact date of birth"
            />
            <span className={styles.calIcon} aria-hidden="true"><CalendarIcon /></span>
          </div>
          <div className={styles.selectWrap}>
            <select
              className={`${styles.select} ${!form.emergencyContactRelation ? styles.placeholder : ''}`}
              value={form.emergencyContactRelation}
              onChange={update('emergencyContactRelation')}
              aria-label="Relation"
            >
              <option value="">Relation (optional)</option>
              {RELATION_OPTIONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        </fieldset>

        {/* Forms & consent documents */}
        <fieldset className={styles.card}>
          <legend className={styles.cardTitle}>Forms &amp; consent documents</legend>
          {[0, 1].map((i) => (
            <div key={i} className={styles.fileRow}>
              <span className={styles.fileLabel}>Document {i + 1}</span>
              <span className={styles.fileRight}>
                {docFiles[i] ? (
                  <span className={styles.fileName}>{docFiles[i].name}</span>
                ) : (
                  <span className={styles.filePlaceholder}>No file chosen</span>
                )}
                <button
                  type="button"
                  className={styles.fileBtn}
                  onClick={() => docInputRefs[i].current?.click()}
                  aria-label={`Upload document ${i + 1}`}
                >
                  <UploadIcon /> Upload
                </button>
                <input
                  ref={docInputRefs[i]}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className={styles.fileInputHidden}
                  onChange={(e) => handleDocChange(i, e)}
                  aria-label={`Document ${i + 1}`}
                />
              </span>
            </div>
          ))}
        </fieldset>

        {/* Programme */}
        <fieldset className={styles.card}>
          <legend className={styles.cardTitle}>Programme</legend>
          <div className={styles.selectWrap}>
            <select
              className={`${styles.select} ${!form.programmeId ? styles.placeholder : ''}`}
              value={form.programmeId}
              onChange={update('programmeId')}
              aria-label="Linked programme"
            >
              <option value="">No programme</option>
              {programmes.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        </fieldset>

        {/* Story content */}
        <fieldset className={styles.card}>
          <legend className={styles.cardTitle}>Story content</legend>

          <p className={styles.subLabel}>IMAGES</p>
          <div className={styles.imageGrid}>
            {imagePreviews.map((src, i) => (
              <div key={src} className={styles.imageThumb}>
                <img src={src} alt={`Story image ${i + 1}`} className={styles.thumbImg} />
                <button
                  type="button"
                  className={styles.removeImg}
                  onClick={() => removeImage(i)}
                  aria-label="Remove image"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              type="button"
              className={styles.addImageBtn}
              onClick={() => imageInputRef.current?.click()}
              aria-label="Add image"
            >
              <PlusIcon />
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
          <textarea
            className={styles.textarea}
            placeholder='e.g. "This programme changed my life."'
            value={form.storyQuotes}
            onChange={update('storyQuotes')}
            aria-label="Story quotes"
            rows={3}
          />
        </fieldset>

        {error && <p className={styles.error} role="alert">{error}</p>}

        <button type="submit" className={styles.submit} disabled={submitting}>
          {submitting ? 'Saving…' : `Add ${singular.toLowerCase()}`}
        </button>
      </form>
    </div>
  );
}
