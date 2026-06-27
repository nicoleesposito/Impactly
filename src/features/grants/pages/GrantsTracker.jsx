import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import StatTile from '../../../components/ui/StatTile/index.js';
import EmptyState from '../../dashboard/components/EmptyState.jsx';
import { useGrants } from '../../../context/GrantsContext.jsx';
import { useOrg } from '../../../context/OrgContext.jsx';
import { useProgrammeFilter } from '../../../context/ProgrammeFilterContext.jsx';
import { ROUTES } from '../../../constants/routes.js';
import { ChevronLeft, ArrowRight, FileText } from '../../../components/icons.jsx';
import styles from './GrantsTracker.module.css';

const FILTERS = ['All', 'Open', 'Submitted', 'Awarded', 'Pending'];

// Grouped sections, in display order, each matched to grant stage values.
const GROUPS = [
  { key: 'action-needed',    label: 'Action needed'    },
  { key: 'draft',            label: 'Draft'            },
  { key: 'pending-decision', label: 'Pending decision' },
];

// Status badge → style class
const STATUS_CLASS = {
  Urgent: 'urgent',
  'In progress': 'inProgress',
  Draft: 'draft',
  Pending: 'pending',
};

export default function GrantsTracker() {
  const navigate = useNavigate();
  const { grants } = useGrants();
  const { org } = useOrg();
  const { activeProgramme } = useProgrammeFilter();
  const [filter, setFilter] = useState('All');

  const activeProgrammeName = activeProgramme !== 'all'
    ? (org?.programmes?.find((p) => p.id === activeProgramme)?.name ?? null)
    : null;

  const programmeFiltered = activeProgrammeName
    ? grants.filter((g) => g.programme === activeProgrammeName)
    : grants;

  const visible = filter === 'All'
    ? programmeFiltered
    : programmeFiltered.filter((g) => g.filter === filter);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button type="button" className={styles.back} onClick={() => navigate(-1)} aria-label="Back">
          <ChevronLeft size={24} />
        </button>
        <h1 className={styles.title}>Grants tracker</h1>
        <Link to={ROUTES.grantAdd} className={styles.add}>+ Add</Link>
      </header>

      <section className={styles.stats} aria-label="Summary">
        <StatTile label="Open applications" value={programmeFiltered.filter((g) => g.filter === 'Open').length} />
        <StatTile label="Pending decision" value={programmeFiltered.filter((g) => g.filter === 'Pending').length} />
        <StatTile label="Awarded (YTD)" value={`R${programmeFiltered.filter((g) => g.filter === 'Awarded').length === 0 ? '0' : programmeFiltered.filter((g) => g.filter === 'Awarded').length}`} />
        <StatTile label="Unsuccessful" value={programmeFiltered.filter((g) => g.status === 'Unsuccessful').length} />
      </section>

      <div className={styles.filters} role="tablist" aria-label="Grant filter">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            role="tab"
            aria-selected={filter === f}
            className={`${styles.filter} ${filter === f ? styles.filterActive : ''}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {grants.length === 0 ? (
        <EmptyState
          icon={<FileText />}
          title="No grants yet"
          hint="Track grant applications, deadlines, and decisions in one place."
        />
      ) : (
        GROUPS.map(({ key, label }) => {
          const items = visible.filter((g) => g.group === key);
          if (items.length === 0) return null;
          return (
            <section key={key} className={styles.group}>
              <h2 className={styles.groupLabel}>{label}</h2>
              <ul className={styles.cardList}>
                {items.map((g) => (
                  <GrantCard key={g.id} grant={g} />
                ))}
              </ul>
            </section>
          );
        })
      )}
    </div>
  );
}

function GrantCard({ grant: g }) {
  const showBar = typeof g.progress === 'number';
  return (
    <li className={styles.card}>
      <div className={styles.cardTop}>
        <span className={styles.cardName}>
          <span className={styles.dot} aria-hidden="true" />
          {g.title}
        </span>
        <span className={styles.cardActions}>
          {g.status && (
            <span className={`${styles.badge} ${styles[STATUS_CLASS[g.status]] || ''}`}>
              {g.status}
            </span>
          )}
          <Link
            to={`/grants/${g.id}`}
            className={styles.arrow}
            aria-label={`Open ${g.title}`}
          >
            <ArrowRight size={16} />
          </Link>
        </span>
      </div>
      {g.subtitle && <p className={styles.cardSub}>{g.subtitle}</p>}
      {g.remaining && <p className={styles.remaining}>{g.remaining}</p>}
      {showBar && (
        <>
          <div className={styles.bar} aria-hidden="true">
            <span className={styles.barFill} style={{ width: `${g.progress}%` }} />
          </div>
          <p className={styles.pct}>{g.progress}% complete</p>
        </>
      )}
    </li>
  );
}
