import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OnboardingShell from '../components/OnboardingShell.jsx';
import WizardFooter from '../components/WizardFooter.jsx';
import PersonRow from '../components/PersonRow.jsx';
import TextField from '../../../components/ui/TextField/index.js';
import { Upload, ChevronDown } from '../../../components/icons.jsx';
import { useOnboarding } from '../OnboardingContext.jsx';
import { ROUTES } from '../../../constants/routes.js';
import styles from './Step4Beneficiaries.module.css';

const EMPTY = { firstName: '', lastName: '', dob: '' };

function initials(first, last) {
  return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
}

// Auto-inserts slashes: 4 digits → yyyy, 6 digits → yyyy/mm, 8 digits → yyyy/mm/dd
function formatDob(raw) {
  const digits = raw.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 4) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 4)}/${digits.slice(4)}`;
  return `${digits.slice(0, 4)}/${digits.slice(4, 6)}/${digits.slice(6)}`;
}

export default function Step4Beneficiaries() {
  const navigate = useNavigate();
  const { data, addBeneficiary, removeBeneficiary } = useOnboarding();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  function handleDobChange(e) {
    setForm((f) => ({ ...f, dob: formatDob(e.target.value) }));
  }

  function handleAdd() {
    const next = {};
    if (!form.firstName.trim()) next.firstName = 'Please enter a first name';
    if (!form.lastName.trim()) next.lastName = 'Please enter a last name';
    setErrors(next);
    if (Object.keys(next).length) return;

    addBeneficiary({
      id: crypto.randomUUID(),
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      dob: form.dob.trim(),
    });
    setForm(EMPTY);
  }

  const list = data.beneficiaries;

  return (
    <OnboardingShell
      step={4}
      label="Add beneficiaries"
      title="Add beneficiaries"
      subtitle="Import from a spreadsheet or add a few now. You can add more anytime."
      footer={
        <WizardFooter
          onBack={() => navigate(ROUTES.onboardingTemplate)}
          onContinue={() => navigate(ROUTES.onboardingTeam)}
        />
      }
      afterFooter={
        list.length > 0 ? (
          <div className={styles.afterList}>
            <div className={styles.nudge} aria-hidden="true">
              <ChevronDown />
            </div>
            <section>
              <h2 className={styles.listHeading}>Added beneficiaries</h2>
              {list.map((b) => (
                <PersonRow
                  key={b.id}
                  initials={initials(b.firstName, b.lastName)}
                  title={`${b.firstName} ${b.lastName}`}
                  subtitle={b.dob || undefined}
                  onRemove={() => removeBeneficiary(b.id)}
                />
              ))}
            </section>
          </div>
        ) : null
      }
    >
      {/* CSV import (parsing wired in the beneficiaries section) */}
      <div className={styles.import}>
        <span className={styles.uploadIcon}>
          <Upload />
        </span>
        <p className={styles.importTitle}>Import from spreadsheet</p>
        <p className={styles.importHint}>Upload CSV - We map the columns</p>
        <label className={styles.uploadBtn}>
          <Upload size={18} /> Upload file
          <input type="file" accept=".csv" hidden />
        </label>
      </div>

      <p className={styles.divider}>or add manually</p>

      <TextField
        label="First name"
        value={form.firstName}
        onChange={update('firstName')}
        error={errors.firstName}
      />
      <TextField
        label="Last name"
        value={form.lastName}
        onChange={update('lastName')}
        error={errors.lastName}
      />
      <TextField
        label="Date of birth"
        placeholder="yyyy/mm/dd"
        value={form.dob}
        onChange={handleDobChange}
        inputMode="numeric"
      />

      <button type="button" className={styles.addBtn} onClick={handleAdd}>
        + Add
      </button>
    </OnboardingShell>
  );
}
