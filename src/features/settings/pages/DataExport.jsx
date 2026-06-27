import { useNavigate } from 'react-router-dom';
import { useBeneficiaries } from '../../../context/BeneficiariesContext.jsx';
import { useFunders } from '../../../context/FundersContext.jsx';
import { useGrants } from '../../../context/GrantsContext.jsx';
import { useStaff } from '../../../context/StaffContext.jsx';
import { ChevronLeft, Download } from '../../../components/icons.jsx';
import styles from './DataExport.module.css';

// ── CSV helpers ───────────────────────────────────────────────────────────────
function escape(v) {
  if (v === null || v === undefined) return '';
  const s = String(v);
  return s.includes(',') || s.includes('"') || s.includes('\n')
    ? `"${s.replace(/"/g, '""')}"`
    : s;
}

function toCsv(headers, rows) {
  return [
    headers.join(','),
    ...rows.map((r) => headers.map((h) => escape(r[h])).join(',')),
  ].join('\n');
}

function download(filename, content) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Export configs ────────────────────────────────────────────────────────────
export default function DataExport() {
  const navigate = useNavigate();
  const { beneficiaries } = useBeneficiaries();
  const { funders } = useFunders();
  const { grants } = useGrants();
  const { activeStaff } = useStaff();

  function exportBeneficiaries() {
    const headers = ['first_name', 'last_name', 'dob', 'gender', 'address', 'id_number', 'status'];
    const rows = beneficiaries.map((b) => ({
      first_name: b.firstName,
      last_name: b.lastName,
      dob: b.dob,
      gender: b.gender,
      address: b.address,
      id_number: b.idNumber,
      status: b.status,
    }));
    download('beneficiaries.csv', toCsv(headers, rows));
  }

  function exportFunders() {
    const headers = ['name', 'type', 'status', 'address', 'phone', 'contact_name', 'contact_email', 'contact_role', 'registration_id'];
    const rows = funders.map((f) => ({
      name: f.name,
      type: f.type,
      status: f.status,
      address: f.address,
      phone: f.phone,
      contact_name: f.contactName,
      contact_email: f.contactEmail,
      contact_role: f.contactRole,
      registration_id: f.registrationId,
    }));
    download('funders.csv', toCsv(headers, rows));
  }

  function exportGrants() {
    const headers = ['title', 'funder', 'programme', 'amount', 'period', 'due_date', 'status', 'filter'];
    const rows = grants.map((g) => ({
      title: g.title,
      funder: g.funder,
      programme: g.programme,
      amount: g.amount,
      period: g.period,
      due_date: g.dueDate,
      status: g.status,
      filter: g.filter,
    }));
    download('grants.csv', toCsv(headers, rows));
  }

  function exportStaff() {
    const headers = ['first_name', 'last_name', 'role', 'status'];
    const rows = activeStaff.map((s) => ({
      first_name: s.firstName,
      last_name: s.lastName,
      role: s.role,
      status: s.status,
    }));
    download('staff.csv', toCsv(headers, rows));
  }

  const exports = [
    {
      key: 'beneficiaries',
      label: 'Beneficiaries',
      hint: `${beneficiaries.length} record${beneficiaries.length !== 1 ? 's' : ''}`,
      fn: exportBeneficiaries,
    },
    {
      key: 'funders',
      label: 'Funders & Donors',
      hint: `${funders.length} record${funders.length !== 1 ? 's' : ''}`,
      fn: exportFunders,
    },
    {
      key: 'grants',
      label: 'Grants',
      hint: `${grants.length} record${grants.length !== 1 ? 's' : ''}`,
      fn: exportGrants,
    },
    {
      key: 'staff',
      label: 'Staff',
      hint: `${activeStaff.length} record${activeStaff.length !== 1 ? 's' : ''}`,
      fn: exportStaff,
    },
  ];

  function exportAll() {
    exportBeneficiaries();
    exportFunders();
    exportGrants();
    exportStaff();
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button type="button" className={styles.back} onClick={() => navigate(-1)} aria-label="Back">
          <ChevronLeft size={24} />
        </button>
        <div>
          <h1 className={styles.title}>Data export</h1>
          <p className={styles.subtitle}>Download your organisation's data as CSV files</p>
        </div>
      </header>

      <button type="button" className={styles.exportAllBtn} onClick={exportAll}>
        <Download size={18} />
        Export all data
      </button>

      <ul className={styles.list}>
        {exports.map((item) => (
          <li key={item.key} className={styles.item}>
            <span className={styles.itemText}>
              <span className={styles.itemLabel}>{item.label}</span>
              <span className={styles.itemHint}>{item.hint}</span>
            </span>
            <button type="button" className={styles.downloadBtn} onClick={item.fn}>
              <Download size={16} />
              Download
            </button>
          </li>
        ))}
      </ul>

      <p className={styles.note}>
        Each export is a standard CSV file compatible with Excel, Google Sheets, and most data tools.
      </p>
    </div>
  );
}
