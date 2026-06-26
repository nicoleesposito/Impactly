import { useNavigate } from 'react-router-dom';
import { useProgrammeFilter } from '../../context/ProgrammeFilterContext.jsx';
import { useOrg } from '../../context/OrgContext.jsx';
import { ROUTES } from '../../constants/routes.js';
import styles from './ProgrammePills.module.css';

// Persistent programme context strip (FR-014). Starts with just "All" for a new
// organisation; real programmes are added by the user and read from the org.
// Colour is always paired with a text label (§17.3).
export default function ProgrammePills() {
  const navigate = useNavigate();
  const { activeProgramme, setActiveProgramme } = useProgrammeFilter();
  const { org } = useOrg();

  const programmes = [
    { id: 'all', label: 'All', color: null },
    ...(org?.programmes ?? []).map((p) => ({
      id: p.id,
      label: p.name,
      color: p.color ?? null,
    })),
  ];

  return (
    <div className={styles.strip} role="tablist" aria-label="Programme filter">
      {programmes.map((p) => (
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
      <span className={styles.spacer} aria-hidden="true" />
      <button type="button" className={styles.add} onClick={() => navigate(ROUTES.programmeAdd)}>
        + Add Programme
      </button>
    </div>
  );
}
