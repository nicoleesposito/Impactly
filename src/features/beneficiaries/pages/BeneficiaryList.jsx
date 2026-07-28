import { useState } from 'react';
import { Link } from 'react-router-dom';
import EmptyState from '../../dashboard/components/EmptyState.jsx';
import { useOrg } from '../../../context/OrgContext.jsx';
import { useBeneficiaries } from '../../../context/BeneficiariesContext.jsx';
import { useProgrammeFilter } from '../../../context/ProgrammeFilterContext.jsx';
import { ROUTES } from '../../../constants/routes.js';
import { Users, Search, Plus, ChevronRight } from '../../../components/icons.jsx';
import styles from './BeneficiaryList.module.css';

function fullName(b) {
  return `${b.firstName} ${b.lastName}`.trim();
}

function initials(b) {
  return `${b.firstName?.[0] ?? ''}${b.lastName?.[0] ?? ''}`.toUpperCase();
}

export default function BeneficiaryList() {
  const { beneficiaryLabel, org } = useOrg();
  const { beneficiaries } = useBeneficiaries();
  const { activeProgramme } = useProgrammeFilter();
  const [query, setQuery] = useState('');

  const label = beneficiaryLabel || 'Beneficiaries';
  const programmes = org?.programmes ?? [];

  // Filter by active programme pill
  const programmeFiltered = activeProgramme !== 'all'
    ? beneficiaries.filter((b) => b.programmeId === activeProgramme)
    : beneficiaries;

  const term = query.trim().toLowerCase();
  const visible = term
    ? programmeFiltered.filter((b) => fullName(b).toLowerCase().includes(term))
    : programmeFiltered;

  function getProgramme(id) {
    return programmes.find((p) => p.id === id) ?? null;
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.heading}>
          <h1 className={styles.title}>All Beneficiaries</h1>
          <p className={styles.meta}>Beneficiaries set to &gt; {label}</p>
        </div>
        <Link to={ROUTES.studentAdd} className={styles.add}>
          <Plus size={16} /> Add
        </Link>
      </header>

      <label className={styles.searchField}>
        <span className={styles.searchIcon} aria-hidden="true">
          <Search />
        </span>
        <input
          type="search"
          className={styles.searchInput}
          placeholder={`Search ${label.toLowerCase()}`}
          aria-label={`Search ${label.toLowerCase()}`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </label>

      {programmeFiltered.length === 0 ? (
        <EmptyState
          icon={<Users />}
          title={`No ${label.toLowerCase()} yet`}
          hint={`Add your first ${label.toLowerCase().replace(/s$/, '')} to start tracking attendance and impact.`}
        />
      ) : visible.length === 0 ? (
        <EmptyState
          icon={<Search />}
          title="No matches"
          hint={`No ${label.toLowerCase()} match "${query}".`}
        />
      ) : (
        <div className={styles.card}>
          <ul className={styles.list}>
            {visible.map((b, idx) => {
              const prog = getProgramme(b.programmeId);
              return (
                <li key={b.id} className={idx < visible.length - 1 ? styles.rowBorder : ''}>
                  <Link
                    to={ROUTES.studentProfile.replace(':id', b.id)}
                    className={styles.row}
                  >
                    {b.photoUrl ? (
                      <img src={b.photoUrl} alt="" className={styles.avatarImg} />
                    ) : (
                      <span className={styles.avatar} aria-hidden="true">
                        {initials(b)}
                      </span>
                    )}
                    <span className={styles.rowBody}>
                      <span className={styles.rowName}>{fullName(b)}</span>
                      {prog && (
                        <span className={styles.pills}>
                          <span
                            className={styles.pill}
                            style={{ background: prog.color ? `${prog.color}22` : undefined, color: prog.color ?? undefined }}
                          >
                            {prog.name}
                          </span>
                        </span>
                      )}
                    </span>
                    <span className={styles.arrow} aria-hidden="true">
                      <ChevronRight size={20} />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
