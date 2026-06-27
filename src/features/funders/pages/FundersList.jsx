import { Link, useNavigate } from 'react-router-dom';
import StatTile from '../../../components/ui/StatTile/index.js';
import EmptyState from '../../dashboard/components/EmptyState.jsx';
import { useFunders } from '../../../context/FundersContext.jsx';
import { useGrants } from '../../../context/GrantsContext.jsx';
import { ROUTES } from '../../../constants/routes.js';
import { ChevronLeft, ArrowRight, Users } from '../../../components/icons.jsx';
import styles from './FundersList.module.css';

function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 3)
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

export default function FundersList() {
  const navigate = useNavigate();
  const { funders } = useFunders();
  const { grants } = useGrants();

  const totalFunders = funders.length;
  const activeGrants = grants.filter((g) => g.status === 'Active').length;
  const reportsDue = funders.filter((f) => f.reportDue).length;

  const currentYear = new Date().getFullYear();
  const fundingYTD = grants
    .filter((g) => g.createdAt && new Date(g.createdAt).getFullYear() === currentYear)
    .reduce((sum, g) => sum + parseAmount(g.amount), 0);

  function funderTotal(f) {
    return grants
      .filter((g) => g.funder && g.funder.toLowerCase() === f.name.toLowerCase())
      .reduce((sum, g) => sum + parseAmount(g.amount), 0);
  }

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
        <StatTile label="Funding YTD" value={fundingYTD > 0 ? fmtAmt(fundingYTD) : 'R0'} />
      </section>

      {funders.length === 0 ? (
        <EmptyState
          icon={<Users />}
          title="No funders yet"
          hint="Add your funders and donors to track grants, funding, and reporting deadlines."
        />
      ) : (
        <ul className={styles.list}>
          {funders.map((f) => {
            const total = funderTotal(f);
            const subtitleParts = [
              total > 0 ? fmtAmt(total) : null,
              f.type || null,
              f.status,
            ].filter(Boolean);
            return (
              <li key={f.id}>
                <Link to={ROUTES.funderProfile.replace(':id', f.id)} className={styles.row}>
                  <span className={styles.avatar} aria-hidden="true">{initials(f.name)}</span>
                  <span className={styles.rowText}>
                    <span className={styles.rowName}>{f.name}</span>
                    <span className={styles.rowSub}>{subtitleParts.join(' · ')}</span>
                  </span>
                  {f.reportDue && <span className={styles.dueBadge}>Report Due</span>}
                  <span className={styles.arrow} aria-hidden="true"><ArrowRight size={16} /></span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
