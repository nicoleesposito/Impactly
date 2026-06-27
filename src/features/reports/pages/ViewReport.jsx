import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useReports } from '../../../context/ReportsContext.jsx';
import { useOrg } from '../../../context/OrgContext.jsx';
import { useBeneficiaries } from '../../../context/BeneficiariesContext.jsx';
import { useGrants } from '../../../context/GrantsContext.jsx';
import { ChevronLeft } from '../../../components/icons.jsx';
import styles from './ViewReport.module.css';

const TAB_DEFS = [
  { key: 'overview',         label: 'Overview' },
  { key: 'attendanceData',   label: 'Attendance' },
  { key: 'progressOutcomes', label: 'Progress' },
  { key: 'storyContent',     label: 'Stories' },
  { key: 'financials',       label: 'Financials' },
  { key: 'nextObjectives',   label: 'Objectives' },
  { key: 'challenges',       label: 'Challenges' },
];

function formatDate(d) {
  if (!d) return '';
  return new Date(d + 'T00:00:00').toLocaleDateString('en-ZA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function ViewReport() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { reports } = useReports();
  const { org } = useOrg();
  const { beneficiaries } = useBeneficiaries();
  const { grants } = useGrants();

  const report = reports.find((r) => r.id === id);

  const sections = report?.sections ?? {};
  const enabledTabs = TAB_DEFS.filter((t) => sections[t.key]);

  const [activeTab, setActiveTab] = useState(() => enabledTabs[0]?.key ?? 'overview');

  if (!report) {
    return (
      <div className={styles.page}>
        <header className={styles.header}>
          <button
            type="button"
            className={styles.back}
            onClick={() => navigate('/reports')}
            aria-label="Back"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className={styles.title}>Report not found</h1>
        </header>
        <p className={styles.notFound}>
          This report does not exist or could not be loaded.
        </p>
      </div>
    );
  }

  const programmes = org?.programmes ?? [];
  const programme = programmes.find((p) => p.id === report.programmeId) ?? null;

  const enrolled = beneficiaries.filter(
    (b) =>
      (!report.programmeId || b.programmeId === report.programmeId) &&
      b.status === 'Active',
  );

  const programmeGrants = grants.filter(
    (g) => !report.programmeId || g.programme === programme?.name,
  );

  const today = new Date().toLocaleDateString('en-ZA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const currentTab = enabledTabs.find((t) => t.key === activeTab) ?? enabledTabs[0];

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <button
          type="button"
          className={styles.back}
          onClick={() => navigate('/reports')}
          aria-label="Back"
        >
          <ChevronLeft size={24} />
        </button>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>{report.title}</h1>
          <div className={styles.headerMeta}>
            {programme && (
              <span
                className={styles.programmePill}
                style={{ background: programme.color ?? 'var(--color-primary)' }}
              >
                {programme.name}
              </span>
            )}
            {report.funder && (
              <span className={styles.metaChip}>Funder · {report.funder}</span>
            )}
            {report.dueDate && (
              <span className={styles.metaChip}>Due {formatDate(report.dueDate)}</span>
            )}
          </div>
        </div>
      </header>

      {/* Tab bar */}
      {enabledTabs.length > 0 && (
        <div className={styles.tabBar} role="tablist" aria-label="Report sections">
          {enabledTabs.map((t) => (
            <button
              key={t.key}
              role="tab"
              type="button"
              aria-selected={t.key === (currentTab?.key)}
              className={`${styles.tab} ${t.key === currentTab?.key ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      {/* Active panel */}
      <div className={styles.panel} role="tabpanel">
        {currentTab?.key === 'overview' && (
          <OverviewSection org={org} programme={programme} enrolled={enrolled} today={today} />
        )}
        {currentTab?.key === 'attendanceData' && (
          <AttendanceSection enrolled={enrolled} />
        )}
        {currentTab?.key === 'progressOutcomes' && (
          <ProgressSection enrolled={enrolled} />
        )}
        {currentTab?.key === 'storyContent' && (
          <StorySection enrolled={enrolled} />
        )}
        {currentTab?.key === 'financials' && (
          <FinancialsSection grants={programmeGrants} enrolled={enrolled} />
        )}
        {currentTab?.key === 'nextObjectives' && (
          <ObjectivesSection text={sections.objectivesText} />
        )}
        {currentTab?.key === 'challenges' && (
          <ChallengesSection text={sections.challengesText} />
        )}
      </div>
    </div>
  );
}

/* ── Overview ─────────────────────────────────────── */
function OverviewSection({ org, programme, enrolled, today }) {
  return (
    <div className={styles.sectionWrap}>
      <section className={styles.sectionCard}>
        <h2 className={styles.sectionTitle}>Overview</h2>
        <dl className={styles.dl}>
          {org?.name && (
            <>
              <dt className={styles.dt}>Organisation</dt>
              <dd className={styles.dd}>{org.name}</dd>
            </>
          )}
          <dt className={styles.dt}>Programme</dt>
          <dd className={styles.dd}>{programme?.name ?? 'All programmes'}</dd>
          <dt className={styles.dt}>Beneficiaries enrolled</dt>
          <dd className={styles.dd}>{enrolled.length}</dd>
          <dt className={styles.dt}>Active</dt>
          <dd className={styles.dd}>{enrolled.filter((b) => b.status === 'Active').length}</dd>
          <dt className={styles.dt}>Report date</dt>
          <dd className={styles.dd}>{today}</dd>
        </dl>
      </section>
    </div>
  );
}

/* ── Attendance ───────────────────────────────────── */
function AttendanceSection({ enrolled }) {
  return (
    <div className={styles.sectionWrap}>
      <section className={styles.sectionCard}>
        <h2 className={styles.sectionTitle}>Attendance data</h2>
        {enrolled.length === 0 ? (
          <p className={styles.empty}>No attendance recorded yet.</p>
        ) : (
          <p className={styles.sectionMeta}>{enrolled.length} enrolled participants</p>
        )}
      </section>
    </div>
  );
}

/* ── Progress & outcomes ──────────────────────────── */
function ProgressSection({ enrolled }) {
  const genderCounts = enrolled.reduce((acc, b) => {
    const g = b.gender || 'Unknown';
    acc[g] = (acc[g] ?? 0) + 1;
    return acc;
  }, {});
  const total = enrolled.length;

  return (
    <div className={styles.sectionWrap}>
      <section className={styles.sectionCard}>
        <h2 className={styles.sectionTitle}>Progress &amp; outcomes</h2>
        <p className={styles.sectionMeta}>
          {total} enrolled &middot; {enrolled.filter((b) => b.status === 'Active').length} active
        </p>
        {total > 0 && Object.keys(genderCounts).length > 0 && (
          <div className={styles.breakdown}>
            {Object.entries(genderCounts).map(([gender, count]) => (
              <div key={gender} className={styles.breakdownRow}>
                <span className={styles.breakdownLabel}>{gender}</span>
                <span className={styles.breakdownCount}>{count}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

/* ── Story content ────────────────────────────────── */
function StorySection({ enrolled }) {
  const storyImages = enrolled.flatMap((b) => b.storyImageUrls ?? []);
  const quotes = enrolled
    .filter((b) => b.storyQuotes)
    .map((b) => ({
      text: b.storyQuotes,
      author: `${b.firstName} ${b.lastName ?? ''}`.trim(),
    }));

  return (
    <div className={styles.sectionWrap}>
      {storyImages.length > 0 && (
        <section className={styles.sectionCard}>
          <h2 className={styles.sectionTitle}>Photos</h2>
          <div className={styles.imageGrid}>
            {storyImages.map((url, i) => (
              <img
                key={url + i}
                src={url}
                alt={`Story image ${i + 1}`}
                className={styles.imageThumb}
              />
            ))}
          </div>
        </section>
      )}

      <section className={styles.sectionCard}>
        <h2 className={styles.sectionTitle}>Quotes &amp; testimonials</h2>
        {quotes.length > 0 ? (
          <ul className={styles.quoteList}>
            {quotes.map((q, i) => (
              <li key={i} className={styles.quoteItem}>
                <p className={styles.quoteText}>&ldquo;{q.text}&rdquo;</p>
                <p className={styles.quoteAuthor}>&bull; {q.author}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.empty}>No quotes or story content yet.</p>
        )}
      </section>
    </div>
  );
}

/* ── Financials ───────────────────────────────────── */
function FinancialsSection({ grants, enrolled }) {
  const total = grants.reduce((sum, g) => {
    const n = parseFloat(String(g.amount ?? '').replace(/[^0-9.]/g, ''));
    return sum + (isNaN(n) ? 0 : n);
  }, 0);

  return (
    <div className={styles.sectionWrap}>
      {grants.length > 0 && (
        <section className={styles.sectionCard}>
          <h2 className={styles.sectionTitle}>Summary</h2>
          <dl className={styles.dl}>
            <dt className={styles.dt}>Total grants</dt>
            <dd className={styles.dd}>{grants.length}</dd>
            {total > 0 && (
              <>
                <dt className={styles.dt}>Total funding</dt>
                <dd className={styles.dd}>{total.toLocaleString('en-ZA', { style: 'currency', currency: 'ZAR', maximumFractionDigits: 0 })}</dd>
              </>
            )}
            {enrolled.length > 0 && total > 0 && (
              <>
                <dt className={styles.dt}>Cost per beneficiary</dt>
                <dd className={styles.dd}>{(total / enrolled.length).toLocaleString('en-ZA', { style: 'currency', currency: 'ZAR', maximumFractionDigits: 0 })}</dd>
              </>
            )}
          </dl>
        </section>
      )}

      <section className={styles.sectionCard}>
        <h2 className={styles.sectionTitle}>Grants</h2>
        {grants.length === 0 ? (
          <p className={styles.empty}>No grants found for this programme.</p>
        ) : (
          <ul className={styles.grantList}>
            {grants.map((g) => (
              <li key={g.id} className={styles.grantItem}>
                <div className={styles.grantInfo}>
                  <span className={styles.grantTitle}>{g.title}</span>
                  {g.funder && <span className={styles.grantFunder}>{g.funder}</span>}
                </div>
                <div className={styles.grantRight}>
                  {g.amount && <span className={styles.grantAmount}>{g.amount}</span>}
                  <span className={`${styles.grantStatus} ${styles['grantStatus_' + (g.status ?? 'draft').toLowerCase().replace(/\s/g, '_')]}`}>
                    {g.status}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

/* ── Objectives ───────────────────────────────────── */
function ObjectivesSection({ text }) {
  return (
    <div className={styles.sectionWrap}>
      <section className={styles.sectionCard}>
        <h2 className={styles.sectionTitle}>Next quarter objectives</h2>
        {text ? (
          <p className={styles.bodyText}>{text}</p>
        ) : (
          <p className={styles.empty}>No objectives entered.</p>
        )}
      </section>
    </div>
  );
}

/* ── Challenges ───────────────────────────────────── */
function ChallengesSection({ text }) {
  return (
    <div className={styles.sectionWrap}>
      <section className={styles.sectionCard}>
        <h2 className={styles.sectionTitle}>Challenges &amp; mitigations</h2>
        {text ? (
          <p className={styles.bodyText}>{text}</p>
        ) : (
          <p className={styles.empty}>No challenges entered.</p>
        )}
      </section>
    </div>
  );
}
