import { useState } from 'react';
import { Link } from 'react-router-dom';
import EmptyState from '../../dashboard/components/EmptyState.jsx';
import { useOrg } from '../../../context/OrgContext.jsx';
import { useReports } from '../../../context/ReportsContext.jsx';
import { FileText, Search, ArrowRight } from '../../../components/icons.jsx';
import styles from './ReportsList.module.css';

// Reports hub (FR-010).
// Grouped by status: Due soon → In progress → Completed.
// Wired to live Supabase data via ReportsContext.

const GROUPS = [
  { key: 'due-soon',    label: 'Due soon'    },
  { key: 'in-progress', label: 'In progress' },
  { key: 'completed',   label: 'Completed'   },
];

function formatDate(d) {
  if (!d) return '';
  return new Date(d + 'T00:00:00').toLocaleDateString('en-ZA', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function ReportsList() {
  const { org } = useOrg();
  const { reports } = useReports();
  const [query, setQuery] = useState('');

  const programmeCount = org?.programmes?.length ?? 0;
  const subtitle = [
    org?.name,
    `${programmeCount} ${programmeCount === 1 ? 'programme' : 'programmes'}`,
  ].filter(Boolean).join(' · ');

  const term = query.trim().toLowerCase();
  const visible = term
    ? reports.filter(
        (r) =>
          r.title.toLowerCase().includes(term) ||
          (r.funder ?? '').toLowerCase().includes(term),
      )
    : reports;

  function groupReports(status) {
    return visible.filter((r) => r.status === status);
  }

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Reports</h1>
        <div className={styles.headerActions}>
          <Link to="/reports/new" className={styles.btnPrimary}>
            + New
          </Link>
        </div>
      </div>

      {/* Subtitle + filter */}
      <div className={styles.subRow}>
        <p className={styles.meta}>{subtitle}</p>
        <button type="button" className={styles.filterBtn}>Filter</button>
      </div>

      {/* Search */}
      <label className={styles.searchField}>
        <span className={styles.searchIcon} aria-hidden="true"><Search /></span>
        <input
          type="search"
          className={styles.searchInput}
          placeholder="Search ..."
          aria-label="Search reports"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </label>

      {/* Grouped sections */}
      {reports.length === 0 ? (
        <EmptyState
          icon={<FileText />}
          title="No reports yet"
          hint="Create your first report to start tracking and sharing your organisation's impact."
        />
      ) : (
        GROUPS.map(({ key, label }) => {
          const items = groupReports(key);
          if (items.length === 0) return null;
          return (
            <section key={key} className={styles.group}>
              <h2 className={styles.groupLabel}>{label}</h2>
              <ul className={styles.cardList}>
                {items.map((r) => (
                  <ReportCard key={r.id} report={r} />
                ))}
              </ul>
            </section>
          );
        })
      )}
    </div>
  );
}

function ReportCard({ report: r }) {
  const subtitle = r.dueDate ? `Due ${formatDate(r.dueDate)}` : (r.funder || '');
  return (
    <li className={styles.card}>
      <div className={styles.cardTop}>
        <span className={styles.cardName}>
          <span
            className={styles.dot}
            style={{ background: 'var(--color-primary)' }}
            aria-hidden="true"
          />
          {r.title}
        </span>
      </div>
      {subtitle && <p className={styles.cardSub}>{subtitle}</p>}
      <div className={styles.cardFoot}>
        <span className={styles.pct}>{r.status}</span>
        <Link
          to={`/reports/${r.id}`}
          className={styles.arrowBtn}
          aria-label={`Open ${r.title}`}
        >
          <ArrowRight size={16} />
        </Link>
      </div>
    </li>
  );
}
