import { useParams, useNavigate } from 'react-router-dom';
import { useStaff } from '../../../context/StaffContext.jsx';
import { useOrg } from '../../../context/OrgContext.jsx';
import { ChevronLeft, Pencil } from '../../../components/icons.jsx';
import styles from './StaffProfile.module.css';

function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function DetailRow({ label, value }) {
  return (
    <div className={styles.detailRow}>
      <span className={styles.detailLabel}>{label}:</span>
      <span className={styles.detailValue}>{value || 'N/A'}</span>
    </div>
  );
}

export default function StaffProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { activeStaff } = useStaff();
  const { org } = useOrg();

  const member = activeStaff.find((s) => s.id === id);

  if (!member) {
    return (
      <div className={styles.page}>
        <header className={styles.header}>
          <button type="button" className={styles.back} onClick={() => navigate(-1)} aria-label="Back">
            <ChevronLeft size={24} />
          </button>
          <h1 className={styles.title}>Staff profile</h1>
        </header>
        <p className={styles.notFound}>Staff member not found.</p>
      </div>
    );
  }

  const fullName = member.name || `${member.firstName} ${member.lastName}`.trim();

  const programmes = (org?.programmes ?? []).filter((p) =>
    member.programmeIds?.includes(p.id),
  );

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button type="button" className={styles.back} onClick={() => navigate(-1)} aria-label="Back">
          <ChevronLeft size={24} />
        </button>
        <h1 className={styles.title}>Staff profile</h1>
      </header>

      <div className={styles.card}>
        {/* Role header row */}
        <div className={styles.roleRow}>
          <span className={styles.roleTitle}>{member.role || 'Staff'}</span>
          <button type="button" className={styles.editBtn} aria-label="Edit profile">
            <Pencil size={14} />
            <span>Edit</span>
          </button>
        </div>

        {/* Avatar + name + pills */}
        <div className={styles.identity}>
          <span className={styles.avatar} aria-hidden="true">{initials(fullName)}</span>
          <div className={styles.nameBlock}>
            <span className={styles.name}>{fullName || 'Unknown'}</span>
            {programmes.length > 0 && (
              <div className={styles.pillRow}>
                {programmes.map((p) => (
                  <span key={p.id} className={styles.pill}>{p.shortLabel || p.name}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        <hr className={styles.divider} />

        {/* Personal details */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Personal details</h2>
          <DetailRow label="Address" value={member.address} />
          <DetailRow label="DOB" value={member.dob} />
          <DetailRow label="ID" value={member.idNumber} />
          <DetailRow label="Phone" value={member.phone} />
        </section>

        <hr className={styles.divider} />

        {/* Emergency contact */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Emergency Contact</h2>
          <DetailRow label="Name" value={member.emergencyName} />
          <DetailRow label="DOB" value={member.emergencyDob} />
          <DetailRow label="Relation" value={member.emergencyRelation} />
        </section>

        <hr className={styles.divider} />

        {/* Programme history */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Programme history</h2>
          <DetailRow label="Overall attendance" value={member.attendance ? `${member.attendance}%` : null} />
          <DetailRow label="Leave history" value={member.leaveHistory} />
        </section>

        <hr className={styles.divider} />

        {/* Payroll summary */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Payroll summary</h2>
          {member.payrollDoc ? (
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Document 1</span>
              <a href={member.payrollDoc} className={styles.viewLink} target="_blank" rel="noopener noreferrer">
                View PDF
              </a>
            </div>
          ) : (
            <p className={styles.empty}>No payroll documents on file.</p>
          )}
        </section>
      </div>
    </div>
  );
}
