import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGrants } from '../../../context/GrantsContext.jsx';
import { ChevronLeft } from '../../../components/icons.jsx';
import styles from './AddGrant.module.css';

// Add Grant (PDF p.1).
// Grant details + deadline. On submit, the grant is added to GrantsContext
// and appears in the Grants tracker (p.11) under the Draft group.

const REMINDER_OPTIONS = [
  '1 day before',
  '3 days before',
  '7 days before',
  '14 days before',
  '30 days before',
];

function CalendarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  );
}

export default function AddGrant() {
  const navigate = useNavigate();
  const { addGrant } = useGrants();

  const [form, setForm] = useState({
    grantName: '',
    funder: '',
    programme: '',
    amount: '',
    period: '',
    dueDate: '',
    reminder: '7 days before',
  });
  const [error, setError] = useState('');

  const update = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  function formatDueLabel(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr + 'T00:00:00');
    return `Due ${d.toLocaleDateString('en-ZA', { month: 'long', day: 'numeric' })}`;
  }

  function daysLeft(dateStr) {
    if (!dateStr) return null;
    const due = new Date(dateStr + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return Math.ceil((due - today) / 86_400_000);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.grantName.trim()) {
      setError('Please enter a grant name.');
      return;
    }
    setError('');

    const days = daysLeft(form.dueDate);
    const dueLabel = formatDueLabel(form.dueDate);
    const subtitle = [form.funder, dueLabel].filter(Boolean).join(' - ');
    const remaining = days !== null
      ? `${days} day${days === 1 ? '' : 's'} remaining`
      : null;

    addGrant({
      title: form.grantName.trim(),
      funder: form.funder.trim(),
      programme: form.programme.trim(),
      amount: form.amount.trim(),
      period: form.period.trim(),
      dueDate: form.dueDate,
      reminder: form.reminder,
      subtitle,
      remaining,
    });

    navigate(-1);
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button type="button" className={styles.back} onClick={() => navigate(-1)} aria-label="Back">
          <ChevronLeft size={24} />
        </button>
        <h1 className={styles.title}>Add grant</h1>
      </header>

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        {/* Grant details */}
        <fieldset className={styles.card}>
          <legend className={styles.cardTitle}>Grant details</legend>
          <input
            className={styles.input}
            placeholder="Grant name"
            value={form.grantName}
            onChange={update('grantName')}
            aria-label="Grant name"
          />
          <input
            className={styles.input}
            placeholder="Funder"
            value={form.funder}
            onChange={update('funder')}
            aria-label="Funder"
          />
          <input
            className={styles.input}
            placeholder="Linked programme"
            value={form.programme}
            onChange={update('programme')}
            aria-label="Linked programme"
          />
          <input
            className={styles.input}
            placeholder="Amount requested"
            value={form.amount}
            onChange={update('amount')}
            aria-label="Amount requested"
            inputMode="numeric"
          />
          <input
            className={styles.input}
            placeholder="Grant period"
            value={form.period}
            onChange={update('period')}
            aria-label="Grant period"
          />
        </fieldset>

        {/* Deadline */}
        <fieldset className={styles.card}>
          <legend className={styles.cardTitle}>Deadline</legend>
          <div className={styles.dateWrap}>
            <input
              type="date"
              className={styles.input}
              value={form.dueDate}
              onChange={update('dueDate')}
              aria-label="Submission due date"
              placeholder="Submission due date"
            />
            <span className={styles.calIcon} aria-hidden="true">
              <CalendarIcon />
            </span>
          </div>
          <div className={styles.selectWrap}>
            <select
              className={styles.select}
              value={form.reminder}
              onChange={update('reminder')}
              aria-label="Reminder"
            >
              {REMINDER_OPTIONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        </fieldset>

        {error && <p className={styles.error} role="alert">{error}</p>}

        <button type="submit" className={styles.submit}>Add</button>
      </form>
    </div>
  );
}
