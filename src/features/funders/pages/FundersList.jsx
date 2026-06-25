import { Link, useNavigate } from 'react-router-dom';
import StatTile from '../../../components/ui/StatTile/index.js';
import EmptyState from '../../dashboard/components/EmptyState.jsx';
import { ROUTES } from '../../../constants/routes.js';
import { ChevronLeft, ArrowRight, Users } from '../../../components/icons.jsx';
import styles from './FundersList.module.css';

// Funders & Donors (PDF p.10).
// Data-driven and empty for a new organisation; the list fills in as funders are
// added. Wired to live Supabase queries in a later section.
const funders = [];

function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 3)
    .join('')
    .toUpperCase();
}

export default function FundersList() {
  const navigate = useNavigate();

  const totalFunders = funders.length;
  const activeGrants = funders.filter((f) => f.status === 'Active').length;
  const reportsDue = funders.filter((f) => f.reportDue).length;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button type="button" className={styles.back} onClick={() => navigate(-1)} aria-label="Back">
          <ChevronLeft size={24} />
        </button>
        <h1 className={styles.title}>Funders &amp; Donors</h1>
        <Link to={ROUTES.funderAdd} className={styles.add}>+ Add</Link>
      </header>

      <section className={styles.stats} aria-label="Summary">
        <StatTile label="Total funders" value={totalFunders} />
        <StatTile label="Active grants" value={activeGrants} />
        <StatTile label="Reports due" value={reportsDue} />
        <StatTile label="Funding YTD" value="R0" />
      </section>

      {funders.length === 0 ? (
        <EmptyState
          icon={<Users />}
          title="No funders yet"
          hint="Add your funders and donors to track grants, funding, and reporting deadlines."
        />
      ) : (
        <ul className={styles.list}>
          {funders.map((f) => (
            <li key={f.id}>
              <Link to={ROUTES.funderProfile.replace(':id', f.id)} className={styles.row}>
                <span className={styles.avatar} aria-hidden="true">{initials(f.name)}</span>
                <span className={styles.rowText}>
                  <span className={styles.rowName}>{f.name}</span>
                  <span className={styles.rowSub}>
                    {[f.amount, f.programme, f.status].filter(Boolean).join(' · ')}
                  </span>
                </span>
                {f.reportDue && <span className={styles.dueBadge}>Report Due</span>}
                <span className={styles.arrow} aria-hidden="true"><ArrowRight size={16} /></span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
