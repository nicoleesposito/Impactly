import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFunders } from '../../../context/FundersContext.jsx';
import { useOrg } from '../../../context/OrgContext.jsx';
import { COUNTRIES } from '../../../constants/onboarding.js';
import { ChevronLeft } from '../../../components/icons.jsx';
import styles from './AddFunder.module.css';

const FUNDER_TYPES = [
  'Government',
  'Corporate / Foundation',
  'Trust',
  'Individual donor',
  'International donor',
  'Other',
];

export default function AddFunder() {
  const navigate = useNavigate();
  const { addFunder } = useFunders();
  const { org } = useOrg();

  const programmes = org?.programmes ?? [];

  const [form, setForm] = useState({
    orgName: '',
    funderType: '',
    country: '',
    address: '',
    registrationId: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    roleTitle: '',
  });
  const [linked, setLinked] = useState([]);
  const [requireReports, setRequireReports] = useState(false);
  const [sendCopies, setSendCopies] = useState(true);
  const [error, setError] = useState('');

  const update = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  function toggleProgramme(id) {
    setLinked((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.orgName.trim()) {
      setError('Please enter an organisation name.');
      return;
    }
    setError('');

    const fullName = [form.firstName.trim(), form.lastName.trim()].filter(Boolean).join(' ');

    addFunder({
      name: form.orgName.trim(),
      type: form.funderType,
      address: form.address.trim(),
      registrationId: form.registrationId.trim(),
      contactName: fullName,
      contactEmail: form.email.trim(),
      contactRole: form.roleTitle.trim(),
      phone: form.phone.trim(),
      linkedProgrammes: linked,
      notes: '',
    });

    navigate(-1);
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button type="button" className={styles.back} onClick={() => navigate(-1)} aria-label="Back">
          <ChevronLeft size={24} />
        </button>
        <h1 className={styles.title}>Add Funder / Donor</h1>
      </header>

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        {/* Organisation details */}
        <fieldset className={styles.card}>
          <legend className={styles.cardTitle}>Organisation details</legend>
          <input
            className={styles.input}
            placeholder="Organisation name"
            value={form.orgName}
            onChange={update('orgName')}
            aria-label="Organisation name"
          />
          <div className={styles.selectWrap}>
            <select
              className={`${styles.select} ${!form.funderType ? styles.placeholder : ''}`}
              value={form.funderType}
              onChange={update('funderType')}
              aria-label="Funder type"
            >
              <option value="" disabled>Funder type</option>
              {FUNDER_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className={styles.selectWrap}>
            <select
              className={`${styles.select} ${!form.country ? styles.placeholder : ''}`}
              value={form.country}
              onChange={update('country')}
              aria-label="Country"
            >
              <option value="" disabled>Country</option>
              {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <input
            className={styles.input}
            placeholder="Physical address"
            value={form.address}
            onChange={update('address')}
            aria-label="Address"
          />
          <input
            className={styles.input}
            placeholder="Registration / NPO number"
            value={form.registrationId}
            onChange={update('registrationId')}
            aria-label="Registration number"
          />
        </fieldset>

        {/* Primary contact */}
        <fieldset className={styles.card}>
          <legend className={styles.cardTitle}>Primary contact</legend>
          <div className={styles.row}>
            <input
              className={styles.input}
              placeholder="First name"
              value={form.firstName}
              onChange={update('firstName')}
              aria-label="First name"
            />
            <input
              className={styles.input}
              placeholder="Last name"
              value={form.lastName}
              onChange={update('lastName')}
              aria-label="Last name"
            />
          </div>
          <input
            type="email"
            className={styles.input}
            placeholder="Email"
            value={form.email}
            onChange={update('email')}
            aria-label="Email"
            inputMode="email"
          />
          <input
            type="tel"
            className={styles.input}
            placeholder="Phone"
            value={form.phone}
            onChange={update('phone')}
            aria-label="Phone"
            inputMode="tel"
          />
          <input
            className={styles.input}
            placeholder="Role / title"
            value={form.roleTitle}
            onChange={update('roleTitle')}
            aria-label="Role or title"
          />
        </fieldset>

        {/* Linked programmes */}
        <fieldset className={styles.card}>
          <legend className={styles.cardTitle}>Linked Programmes</legend>
          {programmes.length === 0 ? (
            <p className={styles.muted}>
              No programmes yet. Add programmes to link this funder to specific work.
            </p>
          ) : (
            <div className={styles.checks}>
              {programmes.map((p) => (
                <label key={p.id} className={styles.check}>
                  <input
                    type="checkbox"
                    className={styles.checkbox}
                    checked={linked.includes(p.id)}
                    onChange={() => toggleProgramme(p.id)}
                  />
                  <span>{p.name}</span>
                </label>
              ))}
            </div>
          )}
        </fieldset>

        {/* Reporting preferences */}
        <fieldset className={styles.card}>
          <legend className={styles.cardTitle}>Reporting preferences</legend>
          <ToggleRow
            label="Require funder reports"
            hint="Notify when a report is due"
            checked={requireReports}
            onChange={() => setRequireReports((v) => !v)}
          />
          <span className={styles.divider} aria-hidden="true" />
          <ToggleRow
            label="Send report copies automatically"
            hint="Email report on submission"
            checked={sendCopies}
            onChange={() => setSendCopies((v) => !v)}
          />
        </fieldset>

        {error && <p className={styles.error} role="alert">{error}</p>}

        <button type="submit" className={styles.submit}>Add</button>
      </form>
    </div>
  );
}

function ToggleRow({ label, hint, checked, onChange }) {
  return (
    <div className={styles.toggleRow}>
      <span className={styles.toggleText}>
        <span className={styles.toggleLabel}>{label}</span>
        <span className={styles.toggleHint}>{hint}</span>
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        className={`${styles.toggle} ${checked ? styles.toggleOn : ''}`}
        onClick={onChange}
      >
        <span className={styles.knob} />
      </button>
    </div>
  );
}
