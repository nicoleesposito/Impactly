import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGrants } from '../../../context/GrantsContext.jsx';
import { useOrg } from '../../../context/OrgContext.jsx';
import { ChevronLeft, Pencil } from '../../../components/icons.jsx';
import styles from './GrantProfile.module.css';

const STATUSES = ['Draft', 'In progress', 'Submitted', 'Awarded', 'Pending', 'Unsuccessful', 'Urgent'];
const FILTERS  = ['Open', 'Submitted', 'Awarded', 'Pending', 'Unsuccessful'];
const GROUPS   = ['draft', 'action-needed', 'pending-decision'];

function DetailRow({ label, value }) {
  return (
    <div className={styles.detailRow}>
      <span className={styles.detailLabel}>{label}</span>
      <span className={styles.detailValue}>{value || '—'}</span>
    </div>
  );
}

function EditField({ label, children }) {
  return (
    <div className={styles.editField}>
      <span className={styles.editLabel}>{label}</span>
      {children}
    </div>
  );
}

const STATUS_CLASS = {
  Urgent: 'urgent',
  'In progress': 'inProgress',
  Draft: 'draft',
  Pending: 'pending',
  Awarded: 'awarded',
  Submitted: 'submitted',
  Unsuccessful: 'unsuccessful',
};

export default function GrantProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { grants, updateGrant } = useGrants();
  const { org } = useOrg();

  const grant = grants.find((g) => g.id === id);

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(null);
  const [saving, setSaving] = useState(false);

  if (!grant) {
    return (
      <div className={styles.page}>
        <header className={styles.header}>
          <button type="button" className={styles.back} onClick={() => navigate(-1)} aria-label="Back">
            <ChevronLeft size={24} />
          </button>
        </header>
        <p className={styles.notFound}>Grant not found.</p>
      </div>
    );
  }

  const programmes = org?.programmes ?? [];

  function startEdit() {
    setDraft({
      title: grant.title || '',
      funder: grant.funder || '',
      programme: grant.programme || '',
      amount: grant.amount || '',
      period: grant.period || '',
      dueDate: grant.dueDate || '',
      reminder: grant.reminder || '',
      subtitle: grant.subtitle || '',
      status: grant.status || 'Draft',
      filter: grant.filter || 'Open',
      group: grant.group || 'draft',
      progress: grant.progress ?? 0,
    });
    setEditing(true);
  }

  function cancelEdit() {
    setEditing(false);
    setDraft(null);
  }

  async function saveEdit() {
    setSaving(true);
    await updateGrant(grant.id, { ...draft, progress: Number(draft.progress) || 0 });
    setSaving(false);
    setEditing(false);
    setDraft(null);
  }

  const set = (key) => (e) => setDraft((d) => ({ ...d, [key]: e.target.value }));

  const statusClass = STATUS_CLASS[grant.status] || '';

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button type="button" className={styles.back} onClick={() => navigate(-1)} aria-label="Back">
          <ChevronLeft size={24} />
        </button>
        <h1 className={styles.title}>Grant details</h1>
        {!editing && (
          <button type="button" className={styles.editBtn} onClick={startEdit} aria-label="Edit grant">
            <Pencil size={16} />
            <span>Edit</span>
          </button>
        )}
        {editing && (
          <div className={styles.headerActions}>
            <button type="button" className={styles.cancelBtn} onClick={cancelEdit}>Cancel</button>
            <button type="button" className={styles.saveBtn} onClick={saveEdit} disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        )}
      </header>

      <div className={styles.card}>
        {/* Title + status */}
        <div className={styles.topRow}>
          {editing ? (
            <input
              className={styles.titleInput}
              value={draft.title}
              onChange={set('title')}
              placeholder="Grant title"
            />
          ) : (
            <h2 className={styles.grantTitle}>{grant.title}</h2>
          )}
          {!editing && grant.status && (
            <span className={`${styles.badge} ${styles[statusClass]}`}>{grant.status}</span>
          )}
        </div>

        <hr className={styles.divider} />

        {/* Grant details */}
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Grant details</h3>
          {editing ? (
            <>
              <EditField label="Funder">
                <input className={styles.editInput} value={draft.funder} onChange={set('funder')} placeholder="Funder name" />
              </EditField>
              <EditField label="Programme">
                <select className={styles.editSelect} value={draft.programme} onChange={set('programme')}>
                  <option value="">— Select programme —</option>
                  {programmes.map((p) => <option key={p.id} value={p.name}>{p.name}</option>)}
                </select>
              </EditField>
              <EditField label="Amount">
                <input className={styles.editInput} value={draft.amount} onChange={set('amount')} placeholder="e.g. R50,000" />
              </EditField>
              <EditField label="Period">
                <input className={styles.editInput} value={draft.period} onChange={set('period')} placeholder="e.g. Jan – Dec 2025" />
              </EditField>
              <EditField label="Due date">
                <input className={styles.editInput} type="date" value={draft.dueDate} onChange={set('dueDate')} />
              </EditField>
              <EditField label="Reminder">
                <input className={styles.editInput} value={draft.reminder} onChange={set('reminder')} placeholder="e.g. 30 days before" />
              </EditField>
              <EditField label="Description">
                <input className={styles.editInput} value={draft.subtitle} onChange={set('subtitle')} placeholder="Brief description" />
              </EditField>
            </>
          ) : (
            <>
              <DetailRow label="Funder" value={grant.funder} />
              <DetailRow label="Programme" value={grant.programme} />
              <DetailRow label="Amount" value={grant.amount} />
              <DetailRow label="Period" value={grant.period} />
              <DetailRow label="Due date" value={grant.dueDate} />
              <DetailRow label="Reminder" value={grant.reminder} />
              <DetailRow label="Description" value={grant.subtitle} />
            </>
          )}
        </section>

        <hr className={styles.divider} />

        {/* Status & tracking */}
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Status &amp; tracking</h3>
          {editing ? (
            <>
              <EditField label="Status">
                <select className={styles.editSelect} value={draft.status} onChange={set('status')}>
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </EditField>
              <EditField label="Filter">
                <select className={styles.editSelect} value={draft.filter} onChange={set('filter')}>
                  {FILTERS.map((f) => <option key={f} value={f}>{f}</option>)}
                </select>
              </EditField>
              <EditField label="Stage">
                <select className={styles.editSelect} value={draft.group} onChange={set('group')}>
                  {GROUPS.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </EditField>
              <EditField label="Progress (%)">
                <input
                  className={styles.editInput}
                  type="number"
                  min={0}
                  max={100}
                  value={draft.progress}
                  onChange={set('progress')}
                  placeholder="0–100"
                />
              </EditField>
            </>
          ) : (
            <>
              <DetailRow label="Status" value={grant.status} />
              <DetailRow label="Filter" value={grant.filter} />
              <DetailRow label="Stage" value={grant.group} />
              {typeof grant.progress === 'number' && (
                <div className={styles.progressSection}>
                  <div className={styles.bar} aria-hidden="true">
                    <span className={styles.barFill} style={{ width: `${grant.progress}%` }} />
                  </div>
                  <span className={styles.progressLabel}>{grant.progress}% complete</span>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}
