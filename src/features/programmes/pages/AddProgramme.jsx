import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrg } from '../../../context/OrgContext.jsx';
import { ChevronLeft } from '../../../components/icons.jsx';
import { PROGRAMME_SWATCHES } from '../../../constants/programmeSwatches.js';
import styles from './AddProgramme.module.css';

export default function AddProgramme() {
  const navigate = useNavigate();
  const { addProgramme } = useOrg();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState(PROGRAMME_SWATCHES[0]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter a programme name.');
      return;
    }
    setError('');
    setSaving(true);

    const result = await addProgramme({
      name: name.trim(),
      description: description.trim(),
      color,
      shortLabel: name.trim().slice(0, 3).toUpperCase(),
    });

    setSaving(false);

    // If the returned id is still a temp id, Supabase wasn't reached —
    // the programme exists only for this session and will be lost on refresh.
    if (result?.id?.startsWith('temp-')) {
      setError('Programme saved locally only — your account isn\'t fully set up yet, so it won\'t survive a refresh. Complete onboarding to fix this.');
      return;
    }

    navigate(-1);
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button type="button" className={styles.back} onClick={() => navigate(-1)} aria-label="Back">
          <ChevronLeft size={24} />
        </button>
        <h1 className={styles.title}>Add programme</h1>
      </header>

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        {/* Programme details */}
        <fieldset className={styles.card}>
          <legend className={styles.cardTitle}>Programme details</legend>
          <input
            className={styles.input}
            placeholder="Programme name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-label="Programme name"
          />
          <textarea
            className={styles.textarea}
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            aria-label="Description"
          />
        </fieldset>

        {/* Colour */}
        <fieldset className={styles.card}>
          <legend className={styles.cardTitle}>Colour</legend>
          <div className={styles.swatchGrid} role="radiogroup" aria-label="Programme colour">
            {PROGRAMME_SWATCHES.map((c) => (
              <button
                key={c}
                type="button"
                role="radio"
                aria-checked={color === c}
                aria-label={c}
                className={`${styles.swatch} ${color === c ? styles.swatchSelected : ''}`}
                style={{ background: c }}
                onClick={() => setColor(c)}
              />
            ))}
          </div>
        </fieldset>

        {error && <p className={styles.error} role="alert">{error}</p>}

        <button type="submit" className={styles.submit} disabled={saving}>
          {saving ? 'Saving…' : 'Add'}
        </button>
      </form>
    </div>
  );
}
