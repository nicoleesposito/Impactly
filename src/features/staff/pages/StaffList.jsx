import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import StatTile from '../../../components/ui/StatTile/index.js';
import EmptyState from '../../dashboard/components/EmptyState.jsx';
import { ROUTES } from '../../../constants/routes.js';
import { ChevronLeft, ArrowRight, Users } from '../../../components/icons.jsx';
import styles from './StaffList.module.css';

// Staff (PDF p.39).
// Filter pills + staff roster. Data-driven and empty for a new organisation;
// the roster fills in as team members are invited. Wired to Supabase later.
const staff = [];

const FILTERS = ['All staff', 'Leave tracker', 'Payroll', 'Volunteers'];

function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export default function StaffList() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All staff');

  const visible =
    filter === 'Volunteers' ? staff.filter((s) => s.volunteer) : staff;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button type="button" className={styles.back} onClick={() => navigate(-1)} aria-label="Back">
          <ChevronLeft size={24} />
        </button>
        <h1 className={styles.title}>Staff</h1>
        <Link to={ROUTES.settingsUsers} className={styles.add}>+ Invite</Link>
      </header>

      <section className={styles.stats} aria-label="Summary">
        <StatTile label="Total staff" value="0" />
        <StatTile label="On leave today" value="0" />
        <StatTile label="Volunteers" value="0" />
        <StatTile label="Pending invites" value="0" />
      </section>

      <div className={styles.filters} role="tablist" aria-label="Staff filter">
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

      {staff.length === 0 ? (
        <EmptyState
          icon={<Users />}
          title="No staff yet"
          hint="Invite your team and volunteers to manage roles, leave, and assignments."
        />
      ) : (
        <ul className={styles.list}>
          {visible.map((s) => (
            <li key={s.id}>
              <Link to={ROUTES.staffProfile.replace(':id', s.id)} className={styles.row}>
                <span className={styles.avatar} aria-hidden="true">{initials(s.name)}</span>
                <span className={styles.rowText}>
                  <span className={styles.rowName}>{s.name}</span>
                  <span className={styles.rowSub}>
                    {[s.role, s.programme].filter(Boolean).join(' · ')}
                  </span>
                </span>
                <span
                  className={`${styles.statusBadge} ${s.status === 'On Leave' ? styles.onLeave : styles.active}`}
                >
                  {s.status || 'Active'}
                </span>
                <span className={styles.arrow} aria-hidden="true"><ArrowRight size={16} /></span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
