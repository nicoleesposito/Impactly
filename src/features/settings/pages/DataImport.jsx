import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBeneficiaries } from '../../../context/BeneficiariesContext.jsx';
import { useFunders } from '../../../context/FundersContext.jsx';
import { useGrants } from '../../../context/GrantsContext.jsx';
import { ChevronLeft, UploadCloud } from '../../../components/icons.jsx';
import styles from './DataImport.module.css';

// ── Simple CSV parser ─────────────────────────────────────────────────────────
function parseLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current.trim());
  return result;
}

function parseCsv(text) {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length === 0) return { headers: [], rows: [] };
  const headers = parseLine(lines[0]);
  const rows = lines.slice(1).map(parseLine);
  return { headers, rows };
}

function rowToObj(headers, row) {
  const obj = {};
  headers.forEach((h, i) => { obj[h.toLowerCase().replace(/\s+/g, '_')] = row[i] ?? ''; });
  return obj;
}

function detectType(headers) {
  const h = headers.map((x) => x.toLowerCase().replace(/\s+/g, '_'));
  if (h.some((x) => ['first_name', 'firstname'].includes(x))) return 'beneficiaries';
  if (h.some((x) => ['title', 'grant_title'].includes(x)) && h.some((x) => x === 'funder')) return 'grants';
  if (h.some((x) => ['name', 'org_name', 'organisation_name'].includes(x))) return 'funders';
  return null;
}

const TYPE_LABELS = { beneficiaries: 'Beneficiaries', funders: 'Funders & Donors', grants: 'Grants' };

export default function DataImport() {
  const navigate = useNavigate();
  const { addBeneficiary } = useBeneficiaries();
  const { addFunder } = useFunders();
  const { addGrant } = useGrants();

  const fileRef = useRef(null);
  const [parsed, setParsed] = useState(null); // { headers, rows, type }
  const [status, setStatus] = useState(null); // 'importing' | 'done' | 'error'
  const [imported, setImported] = useState(0);
  const [error, setError] = useState('');

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const { headers, rows } = parseCsv(ev.target.result);
      const type = detectType(headers);
      if (!type) {
        setError('Could not detect data type from CSV headers. Expected headers for beneficiaries, funders, or grants.');
        setParsed(null);
        return;
      }
      setError('');
      setParsed({ headers, rows, type });
    };
    reader.readAsText(file);
  }

  async function handleImport() {
    if (!parsed) return;
    setStatus('importing');
    setImported(0);

    const { headers, rows, type } = parsed;
    let count = 0;

    for (const row of rows) {
      const obj = rowToObj(headers, row);
      try {
        if (type === 'beneficiaries') {
          await addBeneficiary({
            firstName: obj.first_name || obj.firstname || '',
            lastName: obj.last_name || obj.lastname || '',
            dob: obj.date_of_birth || obj.dob || '',
            gender: obj.gender || '',
            address: obj.address || '',
            idNumber: obj.id_number || obj.id || '',
          });
        } else if (type === 'funders') {
          await addFunder({
            name: obj.name || obj.org_name || obj.organisation_name || '',
            type: obj.type || obj.funder_type || '',
            address: obj.address || '',
            phone: obj.phone || '',
            contactName: obj.contact_name || obj.contact || '',
            contactEmail: obj.email || obj.contact_email || '',
            registrationId: obj.registration_id || obj.npo_number || '',
            linkedProgrammes: [],
          });
        } else if (type === 'grants') {
          await addGrant({
            title: obj.title || obj.grant_title || '',
            funder: obj.funder || '',
            programme: obj.programme || '',
            amount: obj.amount || '',
            period: obj.period || '',
            dueDate: obj.due_date || obj.deadline || '',
          });
        }
        count++;
        setImported(count);
      } catch {
        // skip failed rows
      }
    }

    setStatus('done');
  }

  function reset() {
    setParsed(null);
    setStatus(null);
    setImported(0);
    setError('');
    if (fileRef.current) fileRef.current.value = '';
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button type="button" className={styles.back} onClick={() => navigate(-1)} aria-label="Back">
          <ChevronLeft size={24} />
        </button>
        <div>
          <h1 className={styles.title}>Data import</h1>
          <p className={styles.subtitle}>Import records from a CSV file</p>
        </div>
      </header>

      {/* Instructions card */}
      <div className={styles.infoCard}>
        <h2 className={styles.infoTitle}>Supported formats</h2>
        <ul className={styles.infoList}>
          <li><strong>Beneficiaries</strong> — columns: first_name, last_name, dob, gender, address, id_number</li>
          <li><strong>Funders</strong> — columns: name, type, address, phone, contact_name, email, registration_id</li>
          <li><strong>Grants</strong> — columns: title, funder, programme, amount, period, due_date</li>
        </ul>
        <p className={styles.infoNote}>The first row must be headers. The data type is detected automatically from the column names.</p>
      </div>

      {/* Upload zone */}
      {!parsed && status !== 'done' && (
        <label className={styles.dropZone} htmlFor="csv-upload">
          <UploadCloud size={36} />
          <span className={styles.dropTitle}>Choose a CSV file</span>
          <span className={styles.dropSub}>Tap to browse</span>
          <input
            id="csv-upload"
            ref={fileRef}
            type="file"
            accept=".csv,text/csv"
            className={styles.fileInput}
            onChange={handleFile}
          />
        </label>
      )}

      {error && <p className={styles.errorMsg} role="alert">{error}</p>}

      {/* Preview */}
      {parsed && status !== 'done' && (
        <div className={styles.previewCard}>
          <div className={styles.previewHeader}>
            <span className={styles.previewType}>Detected: <strong>{TYPE_LABELS[parsed.type]}</strong></span>
            <span className={styles.previewCount}>{parsed.rows.length} row{parsed.rows.length !== 1 ? 's' : ''}</span>
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  {parsed.headers.map((h) => <th key={h} className={styles.th}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {parsed.rows.slice(0, 5).map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, j) => <td key={j} className={styles.td}>{cell}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
            {parsed.rows.length > 5 && (
              <p className={styles.moreRows}>…and {parsed.rows.length - 5} more rows</p>
            )}
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={reset}>Choose different file</button>
            <button
              type="button"
              className={styles.importBtn}
              onClick={handleImport}
              disabled={status === 'importing'}
            >
              {status === 'importing' ? `Importing… (${imported})` : `Import ${parsed.rows.length} records`}
            </button>
          </div>
        </div>
      )}

      {/* Done state */}
      {status === 'done' && (
        <div className={styles.doneCard}>
          <span className={styles.doneIcon} aria-hidden="true">✓</span>
          <h2 className={styles.doneTitle}>Import complete</h2>
          <p className={styles.doneSub}>{imported} record{imported !== 1 ? 's' : ''} imported successfully.</p>
          <button type="button" className={styles.importBtn} onClick={reset}>Import another file</button>
        </div>
      )}
    </div>
  );
}
