import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBeneficiaries } from '../../../context/BeneficiariesContext.jsx';
import { useOrg } from '../../../context/OrgContext.jsx';
import { useProgrammeFilter } from '../../../context/ProgrammeFilterContext.jsx';
import { ChevronLeft } from '../../../components/icons.jsx';
import styles from './AddBeneficiary.module.css';

const GENDER_OPTIONS = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];

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

export default function AddBeneficiary() {
  const navigate = useNavigate();
  const { addBeneficiary } = useBeneficiaries();
  const { org, beneficiaryLabel } = useOrg();
  const { activeProgramme } = useProgrammeFilter();

  const programmes = org?.programmes ?? [];
  const label = beneficiaryLabel || 'Beneficiary';
  const singularLabel = label.replace(/s$/i, '');

  // Pre-select active programme pill
  const preselectedProgramme = activeProgramme !== 'all' ? activeProgramme : '';

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    gender: '',
    programmeId: preselectedProgramme,
  });
  const [error, setError] = useState('');

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.firstName.trim()) {
      setError('Please enter a first name.');
      return;
    }
    setError('');

    addBeneficiary({
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      dob: form.dob || null,
      gender: form.gender || null,
      programmeId: form.programmeId || null,
    });

    navigate(-1);
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button type="button" className={styles.back} onClick={() => navigate(-1)} aria-label="Back">
          <ChevronLeft size={24} />
        </button>
        <h1 className={styles.title}>Add {singularLabel.toLowerCase()}</h1>
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
              placeholder="Date of birth"
            />
            <span className={styles.calIcon} aria-hidden="true">
              <CalendarIcon />
            </span>
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

        {error && <p className={styles.error} role="alert">{error}</p>}

        <button type="submit" className={styles.submit}>Add {singularLabel.toLowerCase()}</button>
      </form>
    </div>
  );
}
