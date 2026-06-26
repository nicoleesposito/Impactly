import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EmptyState from '../../dashboard/components/EmptyState.jsx';
import { useStaff } from '../../../context/StaffContext.jsx';
import { ChevronLeft, Pencil, Users } from '../../../components/icons.jsx';
import styles from './Permissions.module.css';

// User accounts & Permissions (PDF p.43).
// Reached from the Permissions button on the Staff page. Lists every user
// account (active staff + pending invites) with their access level, filterable
// by role. Empty for a new organisation; fills in as people are invited/accept.

const ACCESS_LABEL = {
  admin: 'Admin',
  manager: 'Manager',
  staff: 'Staff',
};

const FILTERS = [
  { value: 'all',     label: 'All users' },
  { value: 'manager', label: 'Manager - programmes & reports' },
  { value: 'staff',   label: 'Staff - attendance only' },
  { value: 'admin',   label: 'Admin - Full access' },
];

function initials(text = '') {
  const parts = text.split(/[\s@]/).filter(Boolean);
  return (parts[0]?.[0] ?? '?').toUpperCase();
}

export default function Permissions() {
  const navigate = useNavigate();
  const { activeStaff, pendingInvites } = useStaff();
  const [filter, setFilter] = useState('all');

  // Combine active staff and pending invites into one account list.
  const accounts = useMemo(() => {
    const fromStaff = activeStaff.map((s) => ({
      id: s.id,
      name: s.name,
      accessLevel: s.accessLevel || 'staff',
      pending: false,
    }));
    const fromInvites = pendingInvites.map((i) => ({
      id: i.id,
      name: i.email,
      accessLevel: i.accessLevel || 'staff',
      pending: true,
    }));
    return [...fromStaff, ...fromInvites];
  }, [activeStaff, pendingInvites]);

  const visible =
    filter === 'all' ? accounts : accounts.filter((a) => a.accessLevel === filter);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button type="button" className={styles.back} onClick={() => navigate(-1)} aria-label="Back">
          <ChevronLeft size={24} />
        </button>
        <div>
          <h1 className={styles.title}>User accounts &amp; Permissions</h1>
          <p className={styles.subtitle}>Review users and control their access level.</p>
        </div>
      </header>

      <div className={styles.filters} role="tablist" aria-label="Access level filter">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            role="tab"
            aria-selected={filter === f.value}
            className={`${styles.filter} ${filter === f.value ? styles.filterActive : ''}`}
            onClick={() => setFilter(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {accounts.length === 0 ? (
        <EmptyState
          icon={<Users />}
          title="No user accounts yet"
          hint="Invite staff from the Staff page. Accounts appear here once invites are sent."
        />
      ) : (
        <>
          <h2 className={styles.groupLabel}>
            {FILTERS.find((f) => f.value === filter)?.label ?? 'All users'}
          </h2>
          <ul className={styles.list}>
            {visible.map((a) => (
              <li key={a.id} className={styles.row}>
                <span className={styles.avatar} aria-hidden="true">{initials(a.name)}</span>
                <span className={styles.rowText}>
                  <span className={styles.rowName}>{a.name}</span>
                  <span className={styles.rowSub}>
                    {ACCESS_LABEL[a.accessLevel] || 'Staff'}
                    {a.pending && <span className={styles.pending}> · Pending</span>}
                  </span>
                </span>
                <button type="button" className={styles.edit}>
                  <Pencil size={16} />
                  Edit
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
