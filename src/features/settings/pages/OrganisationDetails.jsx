import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrg } from '../../../context/OrgContext.jsx';
import { ORG_TYPES, COUNTRIES, BENEFICIARY_RANGES } from '../../../constants/onboarding.js';
import { ChevronLeft, ChevronDown } from '../../../components/icons.jsx';
import styles from './OrganisationDetails.module.css';

// Organisation preferences (PDF p.25).
// Reached from the Organisation settings hub (p.24). Reads from OrgContext and
// saves back via setOrg. Pre-filled from onboarding when available.
export default function OrganisationDetails() {
  const navigate = useNavigate();
  const { org, setOrg } = useOrg();

  const [form, setForm] = useState({
    name: org?.name ?? '',
    type: org?.type ?? '',
    country: org?.country ?? '',
    size: org?.size ?? '',
    beneficiaryLabel: org?.beneficiaryLabel ?? 'Students',
  });
  const [saved, setSaved] = useState(false);

  const update = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setSaved(false);
  };

  function handleSubmit(e) {
    e.preventDefault();
    setOrg((prev) => ({ ...(prev ?? {}), ...form }));
    // TODO(org): persist to Supabase
    setSaved(true);
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button type="button" className={styles.back} onClick={() => navigate(-1)} aria-label="Back">
          <ChevronLeft size={24} />
        </button>
        <div>
          <h1 className={styles.title}>Organisation</h1>
          <p className={styles.subtitle}>Preferences for your organisation.</p>
        </div>
      </header>

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <label className={styles.field}>
          <span className={styles.fieldLabel}>Organisation name</span>
          <input
            className={styles.input}
            value={form.name}
            onChange={update('name')}
            placeholder="Organisation name"
          />
        </label>

        <label className={styles.field}>
          <span className={styles.fieldLabel}>Type</span>
          <div className={styles.selectRow}>
            <select className={styles.select} value={form.type} onChange={update('type')}>
              <option value="" disabled>Select type</option>
              {ORG_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <span className={styles.selectChevron} aria-hidden="true"><ChevronDown size={18} /></span>
          </div>
        </label>

        <label className={styles.field}>
          <span className={styles.fieldLabel}>Country</span>
          <div className={styles.selectRow}>
            <select className={styles.select} value={form.country} onChange={update('country')}>
              <option value="" disabled>Select country</option>
              {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <span className={styles.selectChevron} aria-hidden="true"><ChevronDown size={18} /></span>
          </div>
        </label>

        <label className={styles.field}>
          <span className={styles.fieldLabel}>Number of beneficiaries</span>
          <div className={styles.selectRow}>
            <select className={styles.select} value={form.size} onChange={update('size')}>
              <option value="" disabled>Select a range</option>
              {BENEFICIARY_RANGES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
            <span className={styles.selectChevron} aria-hidden="true"><ChevronDown size={18} /></span>
          </div>
        </label>

        <label className={styles.field}>
          <span className={styles.fieldLabel}>Beneficiaries</span>
          <input
            className={styles.input}
            value={form.beneficiaryLabel}
            onChange={update('beneficiaryLabel')}
            placeholder="e.g. Students, Learners, Youth"
          />
        </label>

        {saved && <p className={styles.savedNote} role="status">Changes saved.</p>}

        <button type="submit" className={styles.submit}>Save changes</button>
      </form>
    </div>
  );
}
