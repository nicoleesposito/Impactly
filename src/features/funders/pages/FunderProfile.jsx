import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useFunders } from '../../../context/FundersContext.jsx';
import { useGrants } from '../../../context/GrantsContext.jsx';
import { useReports } from '../../../context/ReportsContext.jsx';
import { useOrg } from '../../../context/OrgContext.jsx';
import { useRole } from '../../../hooks/useRole.js';
import { ChevronLeft, Pencil } from '../../../components/icons.jsx';
import styles from './FunderProfile.module.css';

const FUNDER_TYPES = [
  'Government',
  'Corporate / Foundation',
  'Trust',
  'Individual donor',
  'International donor',
  'Other',
];

const FUNDER_STATUSES = ['Active', 'Inactive', 'Closed'];

function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function parseAmount(v) {
  if (!v) return 0;
  return Number(String(v).replace(/[^0-9.]/g, '')) || 0;
}

function fmtAmt(n) {
  if (n >= 1_000_000) return `R${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}m`;
  if (n >= 1_000) return `R${Math.round(n / 1_000)}k`;
  return `R${n}`;
}

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

export default function FunderProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { funders, updateFunder } = useFunders();
  const { grants } = useGrants();
  const { reports } = useReports();
  const { org } = useOrg();
  const { canEditFunders } = useRole();

  const funder = funders.find((f) => f.id === id);

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(null);
  const [saving, setSaving] = useState(false);

  if (!funder) {
    return (
      <div className={styles.page}>
        <header className={styles.header}>
          <button type="button" className={styles.back} onClick={() => navigate(-1)} aria-label="Back">
            <ChevronLeft size={24} />
          </button>
        </header>
        <p className={styles.notFound}>Funder not found.</p>
      </div>
    );
  }

  const programmes = org?.programmes ?? [];
  const linkedProgrammeNames = (funder.linkedProgrammes ?? [])
    .map((pid) => programmes.find((p) => p.id === pid))
    .filter(Boolean)
    .map((p) => p.shortLabel || p.name);

  const funderGrants = grants.filter(
    (g) => g.funder && g.funder.toLowerCase() === funder.name.toLowerCase(),
  );
  const funderReports = reports.filter(
    (r) => r.funder && r.funder.toLowerCase() === funder.name.toLowerCase(),
  );

  const totalFunding = funderGrants.reduce((sum, g) => sum + parseAmount(g.amount), 0);
  const activeGrantCount = funderGrants.filter((g) => g.status === 'Active').length;

  function startEdit() {
    setDraft({
      name: funder.name || '',
      type: funder.type || '',
      status: funder.status || 'Active',
      address: funder.address || '',
      phone: funder.phone || '',
      contactEmail: funder.contactEmail || '',
      registrationId: funder.registrationId || '',
      contactName: funder.contactName || '',
      contactRole: funder.contactRole || '',
      notes: funder.notes || '',
    });
    setEditing(true);
  }

  function cancelEdit() {
    setEditing(false);
    setDraft(null);
  }

  async function saveEdit() {
    setSaving(true);
    await updateFunder(funder.id, draft);
    setSaving(false);
    setEditing(false);
    setDraft(null);
  }

  const set = (key) => (e) => setDraft((d) => ({ ...d, [key]: e.target.value }));

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button type="button" className={styles.back} onClick={() => navigate(-1)} aria-label="Back">
          <ChevronLeft size={24} />
        </button>
      </header>

      <div className={styles.card}>
        {/* Top: avatar + name + edit */}
        <div className={styles.profileTop}>
          <div className={styles.avatar} aria-hidden="true">
            {initials(editing ? draft.name : funder.name)}
          </div>
          <div className={styles.nameBlock}>
            {editing ? (
              <input
                className={styles.editNameInput}
                value={draft.name}
                onChange={set('name')}
                placeholder="Organisation name"
              />
            ) : (
              <h1 className={styles.funderName}>{funder.name}</h1>
            )}
            {!editing && funder.type && <span className={styles.funderType}>{funder.type}</span>}
            {!editing && linkedProgrammeNames.length > 0 && (
              <div className={styles.pillRow}>
                {linkedProgrammeNames.map((n) => (
                  <span key={n} className={styles.pill}>{n}</span>
                ))}
              </div>
            )}
          </div>
          {editing ? (
            <div className={styles.editActions}>
              <button type="button" className={styles.cancelBtn} onClick={cancelEdit}>Cancel</button>
              <button type="button" className={styles.saveBtn} onClick={saveEdit} disabled={saving}>
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          ) : canEditFunders ? (
            <button
              type="button"
              className={styles.editTopBtn}
              onClick={startEdit}
              aria-label="Edit funder"
            >
              <Pencil size={16} />
              <span>Edit</span>
            </button>
          ) : null}
        </div>

        <hr className={styles.divider} />

        {/* Contact details */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Contact details</h2>
          {editing ? (
            <>
              <EditField label="Type">
                <select className={styles.editSelect} value={draft.type} onChange={set('type')}>
                  <option value="">— Select type —</option>
                  {FUNDER_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </EditField>
              <EditField label="Address">
                <input className={styles.editInput} value={draft.address} onChange={set('address')} placeholder="Physical address" />
              </EditField>
              <EditField label="Phone">
                <input className={styles.editInput} type="tel" value={draft.phone} onChange={set('phone')} placeholder="Phone number" />
              </EditField>
              <EditField label="Email">
                <input className={styles.editInput} type="email" value={draft.contactEmail} onChange={set('contactEmail')} placeholder="Email address" />
              </EditField>
              <EditField label="ID / Reg.">
                <input className={styles.editInput} value={draft.registrationId} onChange={set('registrationId')} placeholder="Registration / NPO number" />
              </EditField>
              <EditField label="Representative">
                <input className={styles.editInput} value={draft.contactName} onChange={set('contactName')} placeholder="Contact full name" />
              </EditField>
              <EditField label="Role">
                <input className={styles.editInput} value={draft.contactRole} onChange={set('contactRole')} placeholder="e.g. Programme Director" />
              </EditField>
            </>
          ) : (
            <>
              <DetailRow label="Type" value={funder.type} />
              <DetailRow label="Address" value={funder.address} />
              <DetailRow label="Phone" value={funder.phone} />
              <DetailRow label="Email" value={funder.contactEmail} />
              <DetailRow label="ID / Reg." value={funder.registrationId} />
              <DetailRow label="Representative" value={funder.contactName} />
              <DetailRow label="Role" value={funder.contactRole} />
            </>
          )}
        </section>

        <hr className={styles.divider} />

        {/* Funding history */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Funding history</h2>
          <DetailRow
            label="Total donated"
            value={totalFunding > 0 ? fmtAmt(totalFunding) : '—'}
          />
          <DetailRow label="Active grants" value={String(activeGrantCount)} />
          {editing ? (
            <EditField label="Status">
              <select className={styles.editSelect} value={draft.status} onChange={set('status')}>
                {FUNDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </EditField>
          ) : (
            <DetailRow label="Status" value={funder.status} />
          )}
        </section>

        {/* Notes */}
        <hr className={styles.divider} />
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Notes</h2>
          {editing ? (
            <textarea
              className={styles.textarea}
              rows={4}
              value={draft.notes}
              onChange={set('notes')}
              placeholder="Add notes about this funder…"
            />
          ) : (
            <p className={styles.notesText}>{funder.notes || '—'}</p>
          )}
        </section>

        {/* Reports sent */}
        <hr className={styles.divider} />
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Reports sent</h2>
          {funderReports.length > 0 ? (
            <ul className={styles.itemList}>
              {funderReports.map((r) => (
                <li key={r.id} className={styles.itemRow}>
                  <span className={styles.itemName}>{r.title}</span>
                  <Link to={`/reports/${r.id}`} className={styles.viewLink}>View</Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.empty}>No reports sent to this funder yet.</p>
          )}
        </section>

        {/* Linked grants */}
        <hr className={styles.divider} />
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Linked grants &amp; projects</h2>
          {funderGrants.length > 0 ? (
            <ul className={styles.itemList}>
              {funderGrants.map((g) => (
                <li key={g.id} className={styles.itemRow}>
                  <div className={styles.grantInfo}>
                    <span className={styles.itemName}>{g.title}</span>
                    {g.amount && <span className={styles.grantAmt}>{g.amount}</span>}
                  </div>
                  <span className={`${styles.grantStatus} ${styles[`status_${g.status?.toLowerCase()}`]}`}>
                    {g.status}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.empty}>No grants linked to this funder yet.</p>
          )}
        </section>
      </div>
    </div>
  );
}
