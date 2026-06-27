import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useFunders } from '../../../context/FundersContext.jsx';
import { useGrants } from '../../../context/GrantsContext.jsx';
import { useReports } from '../../../context/ReportsContext.jsx';
import { useOrg } from '../../../context/OrgContext.jsx';
import { ChevronLeft, Pencil } from '../../../components/icons.jsx';
import styles from './FunderProfile.module.css';

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
  if (!value) return null;
  return (
    <div className={styles.detailRow}>
      <span className={styles.detailLabel}>{label}</span>
      <span className={styles.detailValue}>{value}</span>
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

  const funder = funders.find((f) => f.id === id);

  const [editingNotes, setEditingNotes] = useState(false);
  const [notesDraft, setNotesDraft] = useState('');

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

  function startEditNotes() {
    setNotesDraft(funder.notes || '');
    setEditingNotes(true);
  }

  async function saveNotes() {
    await updateFunder(funder.id, { notes: notesDraft });
    setEditingNotes(false);
  }

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
          <div className={styles.avatar} aria-hidden="true">{initials(funder.name)}</div>
          <div className={styles.nameBlock}>
            <h1 className={styles.funderName}>{funder.name}</h1>
            {funder.type && <span className={styles.funderType}>{funder.type}</span>}
            {linkedProgrammeNames.length > 0 && (
              <div className={styles.pillRow}>
                {linkedProgrammeNames.map((n) => (
                  <span key={n} className={styles.pill}>{n}</span>
                ))}
              </div>
            )}
          </div>
          <button
            type="button"
            className={styles.editTopBtn}
            onClick={() => navigate(`/funders/${funder.id}/edit`)}
            aria-label="Edit funder"
          >
            <Pencil size={16} />
            <span>Edit</span>
          </button>
        </div>

        <hr className={styles.divider} />

        {/* Contact details */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Contact details</h2>
          <DetailRow label="Address" value={funder.address} />
          <DetailRow label="Phone" value={funder.phone} />
          <DetailRow label="Email" value={funder.contactEmail} />
          <DetailRow label="ID / Reg." value={funder.registrationId} />
          <DetailRow label="Representative" value={funder.contactName} />
          {funder.contactRole && (
            <DetailRow label="Role" value={funder.contactRole} />
          )}
        </section>

        <hr className={styles.divider} />

        {/* Funding history */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Funding history</h2>
          <DetailRow
            label="Total donated"
            value={totalFunding > 0 ? fmtAmt(totalFunding) : 'No grants recorded'}
          />
          <DetailRow
            label="Active grants"
            value={activeGrantCount > 0 ? String(activeGrantCount) : '0'}
          />
          <DetailRow label="Status" value={funder.status} />
        </section>

        {/* Notes */}
        {(funder.notes || editingNotes) && (
          <>
            <hr className={styles.divider} />
            <section className={styles.section}>
              <div className={styles.sectionHead}>
                <h2 className={styles.sectionTitle}>Notes</h2>
                {!editingNotes && (
                  <button type="button" className={styles.editInlineBtn} onClick={startEditNotes}>
                    <Pencil size={14} /> Edit
                  </button>
                )}
              </div>
              {editingNotes ? (
                <>
                  <textarea
                    className={styles.textarea}
                    rows={4}
                    value={notesDraft}
                    onChange={(e) => setNotesDraft(e.target.value)}
                  />
                  <div className={styles.editActions}>
                    <button type="button" className={styles.cancelBtn} onClick={() => setEditingNotes(false)}>Cancel</button>
                    <button type="button" className={styles.saveBtn} onClick={saveNotes}>Save</button>
                  </div>
                </>
              ) : (
                <p className={styles.notesText}>{funder.notes}</p>
              )}
            </section>
          </>
        )}

        {/* Reports sent */}
        {funderReports.length > 0 && (
          <>
            <hr className={styles.divider} />
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Reports sent</h2>
              <ul className={styles.itemList}>
                {funderReports.map((r) => (
                  <li key={r.id} className={styles.itemRow}>
                    <span className={styles.itemName}>{r.title}</span>
                    <Link to={`/reports/${r.id}`} className={styles.viewLink}>View</Link>
                  </li>
                ))}
              </ul>
            </section>
          </>
        )}

        {/* Linked grants */}
        {funderGrants.length > 0 && (
          <>
            <hr className={styles.divider} />
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Linked grants &amp; projects</h2>
              <ul className={styles.itemList}>
                {funderGrants.map((g) => (
                  <li key={g.id} className={styles.itemRow}>
                    <div className={styles.grantInfo}>
                      <span className={styles.itemName}>{g.title}</span>
                      {g.amount && (
                        <span className={styles.grantAmt}>{g.amount}</span>
                      )}
                    </div>
                    <span className={`${styles.grantStatus} ${styles[`status_${g.status?.toLowerCase()}`]}`}>
                      {g.status}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          </>
        )}
      </div>

      {/* Add notes CTA if empty */}
      {!funder.notes && !editingNotes && (
        <button type="button" className={styles.addNotesBtn} onClick={startEditNotes}>
          + Add notes
        </button>
      )}
    </div>
  );
}
