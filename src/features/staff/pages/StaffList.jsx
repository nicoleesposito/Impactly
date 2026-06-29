import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import StatTile from '../../../components/ui/StatTile/index.js';
import EmptyState from '../../dashboard/components/EmptyState.jsx';
import { useStaff } from '../../../context/StaffContext.jsx';
import { useRole } from '../../../hooks/useRole.js';
import { ROUTES } from '../../../constants/routes.js';
import { ChevronLeft, ArrowRight, Users } from '../../../components/icons.jsx';
import styles from './StaffList.module.css';

// Staff (PDF p.39).
// Filter pills + staff roster. Active staff and pending invites come from
// StaffContext; list fills in as members accept invitations.
// Wired to live Supabase queries in a later section.

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
  const { activeStaff, pendingInvites } = useStaff();
  const { canViewPermissions } = useRole();
  const [filter, setFilter] = useState('All staff');

  const visible =
    filter === 'Volunteers'
      ? activeStaff.filter((s) => s.volunteer)
      : activeStaff;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button type="button" className={styles.back} onClick={() => navigate(-1)} aria-label="Back">
          <ChevronLeft size={24} />
        </button>
        <h1 className={styles.title}>Staff</h1>
        {canViewPermissions && (
          <Link to={ROUTES.staffPermissions} className={styles.secondary}>Permissions</Link>
        )}
        <Link to={ROUTES.staffInvite} className={styles.add}>+ Invite</Link>
      </header>

      <section className={styles.stats} aria-label="Summary">
        <StatTile label="Total staff" value={activeStaff.length} />
        <StatTile label="On leave today" value={activeStaff.filter((s) => s.status === 'On Leave').length} />
        <StatTile label="Volunteers" value={activeStaff.filter((s) => s.volunteer).length} />
        <StatTile label="Pending invites" value={pendingInvites.length} />
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

      {/* Pending invites banner (shown when invites exist and filter is All staff) */}
      {filter === 'All staff' && pendingInvites.length > 0 && (
        <div className={styles.pendingBanner}>
          <span className={styles.pendingText}>
            {pendingInvites.length} pending {pendingInvites.length === 1 ? 'invite' : 'invites'} — waiting for acceptance
          </span>
          <Link to={ROUTES.staffInvite} className={styles.pendingLink}>View</Link>
        </div>
      )}

      {activeStaff.length === 0 ? (
        <EmptyState
          icon={<Users />}
          title="No staff yet"
          hint={
            pendingInvites.length > 0
              ? "Invites have been sent. Staff members will appear here once they accept."
              : "Invite your team and volunteers to manage roles, leave, and assignments."
          }
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
