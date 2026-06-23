import { useProgrammeFilter } from '../../context/ProgrammeFilterContext.jsx';
import styles from './ProgrammePills.module.css';

// Persistent programme context strip (FR-014). Placeholder programmes until the
// programmes data layer is wired; colour is always paired with a text label (§17.3).
const PROGRAMMES = [
  { id: 'all', label: 'All', color: null },
  { id: 'literacy', label: 'Literacy', color: 'var(--programme-literacy)' },
  { id: 'digital', label: 'Digital skills', color: 'var(--programme-digital)' },
  { id: 'ecd', label: 'ECD', color: 'var(--programme-ecd)' },
];

export default function ProgrammePills() {
  const { activeProgramme, setActiveProgramme } = useProgrammeFilter();

  return (
    <div className={styles.strip} role="tablist" aria-label="Programme filter">
      {PROGRAMMES.map((p) => (
        <button
          key={p.id}
          type="button"
          role="tab"
          aria-selected={activeProgramme === p.id}
          className={
            activeProgramme === p.id ? `${styles.pill} ${styles.active}` : styles.pill
          }
          onClick={() => setActiveProgramme(p.id)}
        >
          {p.color && (
            <span className={styles.dot} style={{ background: p.color }} aria-hidden="true" />
          )}
          {p.label}
        </button>
      ))}
      <button type="button" className={styles.add}>
        + Add Programme
      </button>
    </div>
  );
}
