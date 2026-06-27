import { useParams, useNavigate } from 'react-router-dom';
import { useReports } from '../../../context/ReportsContext.jsx';
import { useOrg } from '../../../context/OrgContext.jsx';
import { useBeneficiaries } from '../../../context/BeneficiariesContext.jsx';
import { useGrants } from '../../../context/GrantsContext.jsx';
import { ChevronLeft } from '../../../components/icons.jsx';
import styles from './ViewReport.module.css';

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

  const sections = report.sections ?? {};
  const today = new Date().toLocaleDateString('en-ZA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

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
          {programme && (
            <span
              className={styles.programmePill}
              style={{ background: programme.color ?? 'var(--color-primary)' }}
            >
              {programme.name}
            </span>
          )}
        </div>
      </header>

      {/* Subtitle */}
      {(report.funder || report.dueDate) && (
        <div className={styles.subtitleRow}>
          {report.funder && (
            <span className={styles.subtitleChip}>Funder &middot; {report.funder}</span>
          )}
          {report.dueDate && (
            <span className={styles.subtitleChip}>Due {formatDate(report.dueDate)}</span>
          )}
        </div>
      )}

      {/* Sections */}
      <div className={styles.sections}>
        {sections.overview && (
          <OverviewSection org={org} programme={programme} enrolled={enrolled} today={today} />
        )}
        {sections.attendanceData && (
          <AttendanceSection enrolled={enrolled} />
        )}
        {sections.progressOutcomes && (
          <ProgressSection enrolled={enrolled} />
        )}
        {sections.storyContent && (
          <StorySection enrolled={enrolled} />
        )}
        {sections.financials && (
          <FinancialsSection grants={programmeGrants} />
        )}
        {sections.nextObjectives && (
          <ObjectivesSection text={sections.objectivesText} />
        )}
        {sections.challenges && (
          <ChallengesSection text={sections.challengesText} />
        )}
      </div>
    </div>
  );
}

/* ── Overview ─────────────────────────────────────── */
function OverviewSection({ org, programme, enrolled, today }) {
  const active = enrolled.filter((b) => b.status === 'Active');
  return (
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
        <dd className={styles.dd}>{active.length}</dd>
        <dt className={styles.dt}>Report date</dt>
        <dd className={styles.dd}>{today}</dd>
      </dl>
    </section>
  );
}

/* ── Attendance ───────────────────────────────────── */
function AttendanceSection({ enrolled }) {
  return (
    <section className={styles.sectionCard}>
      <h2 className={styles.sectionTitle}>Attendance data</h2>
      {enrolled.length === 0 ? (
        <p className={styles.empty}>No attendance recorded yet.</p>
      ) : (
        <p className={styles.sectionMeta}>{enrolled.length} enrolled participants</p>
      )}
    </section>
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
    <section className={styles.sectionCard}>
      <h2 className={styles.sectionTitle}>Progress &amp; outcomes</h2>
      <p className={styles.sectionMeta}>{total} enrolled &middot; {enrolled.filter((b) => b.status === 'Active').length} active</p>
      {total > 0 && Object.entries(genderCounts).length > 0 && (
        <div className={styles.genderBreakdown}>
          {Object.entries(genderCounts).map(([gender, count]) => (
            <div key={gender} className={styles.genderRow}>
              <span className={styles.genderLabel}>{gender}</span>
              <span className={styles.genderCount}>{count}</span>
            </div>
          ))}
        </div>
      )}
    </section>
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
    <section className={styles.sectionCard}>
      <h2 className={styles.sectionTitle}>Story content</h2>

      {storyImages.length > 0 && (
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
      )}

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
        <p className={styles.empty}>No story content yet.</p>
      )}
    </section>
  );
}

/* ── Financials ───────────────────────────────────── */
function FinancialsSection({ grants }) {
  return (
    <section className={styles.sectionCard}>
      <h2 className={styles.sectionTitle}>Financials</h2>
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
  );
}

/* ── Objectives ───────────────────────────────────── */
function ObjectivesSection({ text }) {
  return (
    <section className={styles.sectionCard}>
      <h2 className={styles.sectionTitle}>Next quarter objectives</h2>
      {text ? (
        <p className={styles.bodyText}>{text}</p>
      ) : (
        <p className={styles.empty}>No objectives entered.</p>
      )}
    </section>
  );
}

/* ── Challenges ───────────────────────────────────── */
function ChallengesSection({ text }) {
  return (
    <section className={styles.sectionCard}>
      <h2 className={styles.sectionTitle}>Challenges &amp; mitigations</h2>
      {text ? (
        <p className={styles.bodyText}>{text}</p>
      ) : (
        <p className={styles.empty}>No challenges entered.</p>
      )}
    </section>
  );
}
