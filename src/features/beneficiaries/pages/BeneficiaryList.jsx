import { useState } from 'react';
import { Link } from 'react-router-dom';
import StatTile from '../../../components/ui/StatTile/index.js';
import EmptyState from '../../dashboard/components/EmptyState.jsx';
import { useOrg } from '../../../context/OrgContext.jsx';
import { ROUTES } from '../../../constants/routes.js';
import { Users, Search, Plus } from '../../../components/icons.jsx';
import styles from './BeneficiaryList.module.css';

// Beneficiaries (students) list (FR-005).
//
// Mirrors the Today dashboard's data-driven approach: this array is empty for a
// new organisation, so the page renders its empty state. As the user adds people
// — here, via onboarding import or the Add button — the rows replace the empty
// state automatically. Wired to live Supabase queries in a later section.
const beneficiaries = [];

function fullName(b) {
  return `${b.firstName} ${b.lastName}`.trim();
}

function initials(b) {
  return `${b.firstName?.[0] ?? ''}${b.lastName?.[0] ?? ''}`.toUpperCase();
}

export default function BeneficiaryList() {
  const { beneficiaryLabel } = useOrg();
  const [query, setQuery] = useState('');

  const label = beneficiaryLabel || 'Beneficiaries';
  const term = query.trim().toLowerCase();
  const visible = term
    ? beneficiaries.filter((b) => fullName(b).toLowerCase().includes(term))
    : beneficiaries;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.heading}>
          <h1 className={styles.title}>{label}</h1>
          <p className={styles.meta}>
            {beneficiaries.length} {beneficiaries.length === 1 ? 'person' : 'people'}
          </p>
        </div>
        <Link to={ROUTES.studentAdd} className={styles.add}>
          <Plus /> Add
        </Link>
      </header>

      <section className={styles.stats} aria-label="Summary">
        <StatTile label={`Total ${label.toLowerCase()}`} value={beneficiaries.length} />
        <StatTile label="Active" value={beneficiaries.length} />
      </section>

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

      {beneficiaries.length === 0 ? (
        <EmptyState
          icon={<Users />}
          title={`No ${label.toLowerCase()} yet`}
          hint={`Add your first ${label.toLowerCase().replace(/s$/, '')} to start tracking attendance and impact.`}
        />
      ) : visible.length === 0 ? (
        <EmptyState
          icon={<Search />}
          title="No matches"
          hint={`No ${label.toLowerCase()} match “${query}”.`}
        />
      ) : (
        <ul className={styles.list}>
          {visible.map((b) => (
            <li key={b.id}>
              <Link
                to={ROUTES.studentProfile.replace(':id', b.id)}
                className={styles.row}
              >
                <span className={styles.avatar} aria-hidden="true">
                  {initials(b)}
                </span>
                <span className={styles.rowText}>
                  <span className={styles.rowName}>{fullName(b)}</span>
                  {b.dob && <span className={styles.rowSub}>{b.dob}</span>}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
