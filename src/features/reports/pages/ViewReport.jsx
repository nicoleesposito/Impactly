import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../../lib/supabase.js';
import { useReports } from '../../../context/ReportsContext.jsx';
import { useOrg } from '../../../context/OrgContext.jsx';
import { useBeneficiaries } from '../../../context/BeneficiariesContext.jsx';
import { useGrants } from '../../../context/GrantsContext.jsx';
import { ChevronLeft, Pencil, Close, Plus } from '../../../components/icons.jsx';
import { Share } from '../../../components/icons.jsx';
import styles from './ViewReport.module.css';

const TABS = [
  { key: 'overview',         label: 'Overview' },
  { key: 'attendanceData',   label: 'Attendance' },
  { key: 'progressOutcomes', label: 'Progress' },
  { key: 'storyContent',     label: 'Stories' },
  { key: 'financials',       label: 'Financials' },
];

function fmtMonthYear(iso) {
  if (!iso) return '—';
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-ZA', { month: 'short', year: 'numeric' });
}

function fmtDueShort(d) {
  if (!d) return '';
  return 'Due ' + new Date(d + 'T00:00:00').toLocaleDateString('en-ZA', { month: 'long', day: 'numeric' });
}

function initials(name = '') {
  return name.trim().split(/\s+/).map((w) => w[0]).join('').toUpperCase().slice(0, 2);
}

/* ── Attendance data hook ──────────────────────────── */
function useAttendanceStats(programmeId) {
  const [state, setState] = useState({ loading: true, sessions: [], monthlyRows: [], stats: null });

  useEffect(() => {
    if (!programmeId) { setState({ loading: false, sessions: [], monthlyRows: [], stats: null }); return; }

    supabase
      .from('attendance_sessions')
      .select('id, session_date, attendance_records(present, status)')
      .eq('programme_id', programmeId)
      .order('session_date')
      .then(({ data: sessions }) => {
        if (!sessions?.length) {
          setState({ loading: false, sessions: [], monthlyRows: [], stats: null });
          return;
        }

        const byMonth = {};
        sessions.forEach((s) => {
          const month = s.session_date.slice(0, 7);
          if (!byMonth[month]) byMonth[month] = { present: 0, total: 0 };
          (s.attendance_records ?? []).forEach((r) => {
            byMonth[month].total++;
            if (r.present || r.status === 'present') byMonth[month].present++;
          });
        });

        const monthlyRows = Object.entries(byMonth)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([month, { present, total }]) => ({
            month,
            label: new Date(month + '-01').toLocaleDateString('en-ZA', { month: 'long' }),
            rate: total > 0 ? Math.round((present / total) * 100) : 0,
          }));

        const rates = monthlyRows.map((r) => r.rate);
        const avg = rates.length ? Math.round(rates.reduce((a, b) => a + b, 0) / rates.length) : 0;
        const hiIdx = rates.indexOf(Math.max(...rates));
        const loIdx = rates.indexOf(Math.min(...rates));

        setState({
          loading: false,
          sessions,
          monthlyRows,
          stats: {
            avg,
            total: sessions.length,
            highest: monthlyRows[hiIdx] ? `${monthlyRows[hiIdx].label.slice(0, 3)}. – ${monthlyRows[hiIdx].rate}%` : '—',
            lowest:  monthlyRows[loIdx] ? `${monthlyRows[loIdx].label.slice(0, 3)}. – ${monthlyRows[loIdx].rate}%` : '—',
            startDate: sessions[0].session_date,
            endDate: sessions[sessions.length - 1].session_date,
          },
        });
      });
  }, [programmeId]);

  return state;
}

/* ── EditableCard ──────────────────────────────────── */
function EditableCard({ title, fieldKey, sections, reportId, updateReport }) {
  const text = sections[fieldKey] ?? '';
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const [saving, setSaving] = useState(false);

  function startEdit() { setDraft(text); setEditing(true); }

  async function save() {
    setSaving(true);
    await updateReport(reportId, { ...sections, [fieldKey]: draft });
    setSaving(false);
    setEditing(false);
  }

  return (
    <div className={styles.card}>
      <div className={styles.cardHead}>
        <h3 className={styles.cardTitle}>{title}</h3>
        {!editing && (
          <button type="button" className={styles.editBtn} onClick={startEdit}>
            <Pencil size={14} /> Edit
          </button>
        )}
      </div>
      {editing ? (
        <>
          <textarea
            className={styles.editTextarea}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={5}
            autoFocus
          />
          <div className={styles.editActions}>
            <button type="button" className={styles.cancelEditBtn} onClick={() => setEditing(false)}>Cancel</button>
            <button type="button" className={styles.saveEditBtn} onClick={save} disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </>
      ) : (
        <p className={text ? styles.bodyText : styles.empty}>
          {text || 'Tap Edit to add content.'}
        </p>
      )}
    </div>
  );
}

/* ── StatGrid (2-col) ──────────────────────────────── */
function StatGrid({ items }) {
  return (
    <div className={styles.statGrid}>
      {items.map(([label, value]) => (
        <div key={label} className={styles.statCell}>
          <span className={styles.statLabel}>{label}</span>
          <span className={styles.statValue}>{value ?? '—'}</span>
        </div>
      ))}
    </div>
  );
}

/* ── HorizBar ──────────────────────────────────────── */
function HorizBar({ label, pct }) {
  return (
    <div className={styles.barRow}>
      <span className={styles.barLabel}>{label}</span>
      <div className={styles.barTrack}>
        <div className={styles.barFill} style={{ width: `${pct}%` }}>
          {pct > 0 && <span className={styles.barCap} />}
        </div>
      </div>
      <span className={styles.barPct}>{pct}%</span>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   Main component
══════════════════════════════════════════════════════ */
export default function ViewReport() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { reports, updateReport } = useReports();
  const { org } = useOrg();
  const { beneficiaries } = useBeneficiaries();
  const { grants } = useGrants();

  const report = reports.find((r) => r.id === id);
  const sections = report?.sections ?? {};

  const visibleTabs = TABS.filter((t) => sections[t.key] !== false);
  const [activeKey, setActiveKey] = useState(() => visibleTabs[0]?.key ?? 'overview');
  const activeTab = visibleTabs.find((t) => t.key === activeKey) ?? visibleTabs[0];

  if (!report) {
    return (
      <div className={styles.page}>
        <header className={styles.header}>
          <button type="button" className={styles.back} onClick={() => navigate('/reports')} aria-label="Back">
            <ChevronLeft size={24} />
          </button>
          <h1 className={styles.title}>Report not found</h1>
        </header>
      </div>
    );
  }

  const programmes = org?.programmes ?? [];
  const programme = programmes.find((p) => p.id === report.programmeId) ?? null;
  const enrolled = beneficiaries.filter(
    (b) => (!report.programmeId || b.programmeId === report.programmeId) && b.status === 'Active',
  );
  const programmeGrants = grants.filter(
    (g) => !report.programmeId || g.programme === programme?.name,
  );

  // Completion
  const narrativeFields = [
    sections.executiveSummary,
    sections.attendanceData !== false ? sections.attendanceNarrative : null,
    sections.progressOutcomes !== false ? sections.progressNarrative : null,
    sections.financials !== false ? sections.budgetNarrative : null,
    sections.financials !== false ? sections.varianceExplanation : null,
    sections.challenges ? sections.challengesText : null,
    sections.nextObjectives ? sections.objectivesText : null,
  ].filter((v) => v !== null);
  const filledCount = narrativeFields.filter(Boolean).length;
  const completion = narrativeFields.length > 0
    ? Math.round((filledCount / narrativeFields.length) * 100)
    : 0;

  const subtitleParts = [report.funder, report.dueDate ? fmtDueShort(report.dueDate) : null]
    .filter(Boolean).join(' · ');

  return (
    <div className={styles.page}>
      {/* ── Header ── */}
      <header className={styles.header}>
        <button type="button" className={styles.back} onClick={() => navigate('/reports')} aria-label="Back">
          <ChevronLeft size={24} />
        </button>
        <h1 className={styles.title}>
          {report.title}{activeTab ? ` – ${activeTab.label}` : ''}
        </h1>
      </header>

      {/* ── Subtitle ── */}
      <div className={styles.subtitleRow}>
        {programme && (
          <span
            className={styles.programmePill}
            style={{ background: programme.color ?? 'var(--color-primary)' }}
          >
            {programme.name}
          </span>
        )}
        {subtitleParts && <span className={styles.subtitleText}>{subtitleParts}</span>}
      </div>

      {/* ── Actions ── */}
      <div className={styles.actionRow}>
        <button type="button" className={styles.sendBtn}>Send</button>
        <button type="button" className={styles.pdfBtn}>PDF</button>
        <button type="button" className={styles.shareBtn} aria-label="Share">
          <Share size={18} />
        </button>
      </div>

      {/* ── Completion ── */}
      <div className={styles.completionRow}>
        <span className={styles.completionLabel}>Completion</span>
        <div className={styles.completionTrack}>
          <div className={styles.completionFill} style={{ width: `${completion}%` }} />
        </div>
        <span className={styles.completionPct}>{completion}%</span>
      </div>

      {/* ── Tab bar ── */}
      <div className={styles.tabBar} role="tablist">
        {visibleTabs.map((t) => (
          <button
            key={t.key}
            role="tab"
            type="button"
            aria-selected={t.key === activeTab?.key}
            className={`${styles.tab} ${t.key === activeTab?.key ? styles.tabActive : ''}`}
            onClick={() => setActiveKey(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Panel ── */}
      <div className={styles.panel} role="tabpanel">
        {activeKey === 'overview' && (
          <OverviewPanel
            org={org}
            programme={programme}
            enrolled={enrolled}
            programmeId={report.programmeId}
            sections={sections}
            reportId={report.id}
            updateReport={updateReport}
          />
        )}
        {activeKey === 'attendanceData' && (
          <AttendancePanel
            programmeId={report.programmeId}
            sections={sections}
            reportId={report.id}
            updateReport={updateReport}
          />
        )}
        {activeKey === 'progressOutcomes' && (
          <ProgressPanel
            enrolled={enrolled}
            sections={sections}
            reportId={report.id}
            updateReport={updateReport}
          />
        )}
        {activeKey === 'storyContent' && (
          <StoriesPanel
            enrolled={enrolled}
            sections={sections}
            reportId={report.id}
            updateReport={updateReport}
          />
        )}
        {activeKey === 'financials' && (
          <FinancialsPanel
            grants={programmeGrants}
            enrolled={enrolled}
            sections={sections}
            reportId={report.id}
            updateReport={updateReport}
          />
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   Overview panel
══════════════════════════════════════════════════════ */
function OverviewPanel({ org, programme, enrolled, programmeId, sections, reportId, updateReport }) {
  const [sessionCount, setSessionCount] = useState(null);
  const [dateRange, setDateRange] = useState(null);

  useEffect(() => {
    if (!programmeId) { setSessionCount(0); return; }
    supabase
      .from('attendance_sessions')
      .select('session_date')
      .eq('programme_id', programmeId)
      .order('session_date')
      .then(({ data }) => {
        setSessionCount(data?.length ?? 0);
        if (data?.length) {
          setDateRange({
            start: fmtMonthYear(data[0].session_date),
            end:   fmtMonthYear(data[data.length - 1].session_date),
          });
        }
      });
  }, [programmeId]);

  const periodLabel = dateRange ? `${dateRange.start} – ${dateRange.end}` : '—';

  return (
    <div className={styles.panelWrap}>
      {/* Populated from programme data */}
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Populated from programme data</h3>
        <StatGrid items={[
          ['Reporting period', periodLabel],
          ['Programme', programme?.name ?? 'All programmes'],
          ['Beneficiaries', enrolled.length],
          ['Sessions run', sessionCount ?? '…'],
        ]} />
      </div>

      {/* Executive summary — auto text */}
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Executive summary</h3>
        {sections.executiveSummary ? (
          <p className={styles.bodyText}>{sections.executiveSummary}</p>
        ) : (
          <p className={styles.autoText}>
            {programme?.name ?? (org?.name ?? 'This programme')} supported {enrolled.length} enrolled{' '}
            beneficiaries{dateRange ? ` from ${dateRange.start} to ${dateRange.end}` : ''}
            {sessionCount != null && sessionCount > 0 ? ` across ${sessionCount} sessions` : ''}.
          </p>
        )}
      </div>

      {/* Challenges — editable */}
      {sections.challenges !== false && (
        <EditableCard
          title="Challenges & Mitigations"
          fieldKey="challengesText"
          sections={sections}
          reportId={reportId}
          updateReport={updateReport}
        />
      )}

      {/* Next quarter objectives — editable */}
      {sections.nextObjectives !== false && (
        <EditableCard
          title="Next quarter objectives"
          fieldKey="objectivesText"
          sections={sections}
          reportId={reportId}
          updateReport={updateReport}
        />
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   Attendance panel
══════════════════════════════════════════════════════ */
function AttendancePanel({ programmeId, sections, reportId, updateReport }) {
  const { loading, monthlyRows, stats } = useAttendanceStats(programmeId);

  return (
    <div className={styles.panelWrap}>
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Attendance data</h3>

        {loading ? (
          <p className={styles.empty}>Loading…</p>
        ) : !stats ? (
          <p className={styles.empty}>No attendance sessions recorded yet.</p>
        ) : (
          <>
            <StatGrid items={[
              ['Avg. Attendance', `${stats.avg}%`],
              ['Total sessions',  stats.total],
              ['Highest month',   stats.highest],
              ['Lowest month',    stats.lowest],
            ]} />

            <div className={styles.barList}>
              {monthlyRows.map((row) => (
                <HorizBar key={row.month} label={row.label} pct={row.rate} />
              ))}
            </div>
          </>
        )}
      </div>

      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Attendance narrative</h3>
        {sections.attendanceNarrative ? (
          <p className={styles.bodyText}>{sections.attendanceNarrative}</p>
        ) : (
          <p className={styles.autoText}>
            {stats
              ? `Attendance across the reporting period averaged ${stats.avg}%, with ${stats.total} sessions recorded.`
              : 'Attendance narrative will appear here once sessions are recorded.'}
          </p>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   Progress panel
══════════════════════════════════════════════════════ */
function ProgressPanel({ enrolled, sections, reportId, updateReport }) {
  const genderMap = enrolled.reduce((acc, b) => {
    const g = b.gender || 'Unknown';
    acc[g] = (acc[g] ?? 0) + 1;
    return acc;
  }, {});
  const total = enrolled.length;

  const progressRows = total > 0
    ? Object.entries(genderMap).map(([label, count]) => ({
        label,
        pct: Math.round((count / total) * 100),
      }))
    : [];

  return (
    <div className={styles.panelWrap}>
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Progress</h3>
        <p className={styles.cardSubtitle}>Beneficiary breakdown</p>

        {total === 0 ? (
          <p className={styles.empty}>No enrolled beneficiaries yet.</p>
        ) : (
          <>
            <div className={styles.barList}>
              {progressRows.map((r) => (
                <HorizBar key={r.label} label={r.label} pct={r.pct} />
              ))}
            </div>

            <div className={styles.statBoxRow}>
              <div className={styles.statBox}>
                <span className={styles.statBoxLabel}>Total enrolled</span>
                <span className={styles.statBoxValue}>{total}</span>
              </div>
              <div className={styles.statBox}>
                <span className={styles.statBoxLabel}>Active</span>
                <span className={styles.statBoxValue}>{enrolled.filter((b) => b.status === 'Active').length}</span>
              </div>
            </div>
          </>
        )}
      </div>

      <EditableCard
        title="Progress narrative"
        fieldKey="progressNarrative"
        sections={sections}
        reportId={reportId}
        updateReport={updateReport}
      />

      <EditableCard
        title="Support areas"
        fieldKey="supportAreas"
        sections={sections}
        reportId={reportId}
        updateReport={updateReport}
      />
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   Stories panel
══════════════════════════════════════════════════════ */
function StoriesPanel({ enrolled, sections, reportId, updateReport }) {
  const photoInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [newQuote, setNewQuote] = useState(false);
  const [quoteDraft, setQuoteDraft] = useState({ text: '', author: '' });

  const autoPhotos = enrolled.flatMap((b) => b.storyImageUrls ?? []);
  const featuredPhotos = sections.featuredPhotoUrls ?? [];
  const allPhotos = [...new Set([...autoPhotos, ...featuredPhotos])];

  const hiddenIds = sections.hiddenQuoteIds ?? [];
  const quotes = enrolled
    .filter((b) => b.storyQuotes && !hiddenIds.includes(b.id))
    .map((b) => ({
      id: b.id,
      text: b.storyQuotes,
      author: `${b.firstName} ${b.lastName ?? ''}`.trim(),
      initials: initials(`${b.firstName} ${b.lastName ?? ''}`),
    }));
  const customQuotes = sections.customQuotes ?? [];

  async function handlePhotoUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const path = `report-photos/${reportId}/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from('beneficiary-images').upload(path, file);
    if (!error) {
      const { data: { publicUrl } } = supabase.storage.from('beneficiary-images').getPublicUrl(path);
      await updateReport(reportId, { ...sections, featuredPhotoUrls: [...featuredPhotos, publicUrl] });
    }
    setUploading(false);
    e.target.value = '';
  }

  function hideQuote(beneficiaryId) {
    updateReport(reportId, { ...sections, hiddenQuoteIds: [...hiddenIds, beneficiaryId] });
  }

  function removeCustomQuote(idx) {
    const updated = customQuotes.filter((_, i) => i !== idx);
    updateReport(reportId, { ...sections, customQuotes: updated });
  }

  function addCustomQuote() {
    if (!quoteDraft.text.trim()) return;
    const updated = [...customQuotes, { text: quoteDraft.text.trim(), author: quoteDraft.author.trim() }];
    updateReport(reportId, { ...sections, customQuotes: updated });
    setQuoteDraft({ text: '', author: '' });
    setNewQuote(false);
  }

  return (
    <div className={styles.panelWrap}>
      <div className={styles.storiesHeading}>
        <p className={styles.storiesTitle}>Narrative data – Stories</p>
        <p className={styles.storiesSubtitle}>Bring the report to life for your funder.</p>
      </div>

      {/* Featured photos */}
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Featured photos</h3>
        <div className={styles.photoGrid}>
          {allPhotos.map((url, i) => (
            <img key={url + i} src={url} alt={`Story ${i + 1}`} className={styles.photoThumb} />
          ))}
          <button
            type="button"
            className={styles.addPhotoBtn}
            onClick={() => photoInputRef.current?.click()}
            disabled={uploading}
            aria-label="Add photo"
          >
            {uploading ? '…' : <Plus size={24} />}
          </button>
          <input
            ref={photoInputRef}
            type="file"
            accept="image/*"
            className={styles.fileHidden}
            onChange={handlePhotoUpload}
          />
        </div>
      </div>

      {/* Beneficiary quotes */}
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Beneficiary quotes</h3>

        <div className={styles.quoteList}>
          {quotes.map((q) => (
            <div key={q.id} className={styles.quoteItem}>
              <div className={styles.quoteAvatar}>{q.initials}</div>
              <div className={styles.quoteBody}>
                <p className={styles.quoteText}>"{q.text}"</p>
                <p className={styles.quoteAuthor}>– {q.author}</p>
              </div>
              <button
                type="button"
                className={styles.removeQuoteBtn}
                onClick={() => hideQuote(q.id)}
                aria-label="Remove quote"
              >
                <Close size={16} />
              </button>
            </div>
          ))}

          {customQuotes.map((q, i) => (
            <div key={`custom-${i}`} className={styles.quoteItem}>
              <div className={styles.quoteAvatar}>{initials(q.author || '?')}</div>
              <div className={styles.quoteBody}>
                <p className={styles.quoteText}>"{q.text}"</p>
                {q.author && <p className={styles.quoteAuthor}>– {q.author}</p>}
              </div>
              <button
                type="button"
                className={styles.removeQuoteBtn}
                onClick={() => removeCustomQuote(i)}
                aria-label="Remove quote"
              >
                <Close size={16} />
              </button>
            </div>
          ))}

          {quotes.length === 0 && customQuotes.length === 0 && (
            <p className={styles.empty}>No quotes yet. Add one below or add story quotes to your beneficiary profiles.</p>
          )}
        </div>

        {newQuote ? (
          <div className={styles.addQuoteForm}>
            <textarea
              className={styles.editTextarea}
              placeholder="Quote text…"
              value={quoteDraft.text}
              onChange={(e) => setQuoteDraft((d) => ({ ...d, text: e.target.value }))}
              rows={3}
              autoFocus
            />
            <input
              className={styles.quoteAuthorInput}
              placeholder="Name, Grade (optional)"
              value={quoteDraft.author}
              onChange={(e) => setQuoteDraft((d) => ({ ...d, author: e.target.value }))}
            />
            <div className={styles.editActions}>
              <button type="button" className={styles.cancelEditBtn} onClick={() => setNewQuote(false)}>Cancel</button>
              <button type="button" className={styles.saveEditBtn} onClick={addCustomQuote}>Add</button>
            </div>
          </div>
        ) : (
          <button type="button" className={styles.addQuoteBtn} onClick={() => setNewQuote(true)}>
            <Plus size={16} /> Add a quote
          </button>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   Financials panel
══════════════════════════════════════════════════════ */
function FinancialsPanel({ grants, enrolled, sections, reportId, updateReport }) {
  const totalAmount = grants.reduce((sum, g) => {
    const n = parseFloat(String(g.amount ?? '').replace(/[^0-9.]/g, ''));
    return sum + (isNaN(n) ? 0 : n);
  }, 0);

  const fmtR = (n) =>
    n > 0
      ? 'R' + n.toLocaleString('en-ZA', { maximumFractionDigits: 0 })
      : '—';

  const costPerLearner = enrolled.length > 0 && totalAmount > 0
    ? Math.round(totalAmount / enrolled.length)
    : 0;

  return (
    <div className={styles.panelWrap}>
      {/* Grant summary */}
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Populated grant data</h3>
        <StatGrid items={[
          ['Grand amount',    fmtR(totalAmount)],
          ['Spent to date',   '—'],
          ['Remaining',       '—'],
          ['Cost per learner', costPerLearner > 0 ? fmtR(costPerLearner) : '—'],
        ]} />
      </div>

      <EditableCard
        title="Budget narrative"
        fieldKey="budgetNarrative"
        sections={sections}
        reportId={reportId}
        updateReport={updateReport}
      />

      <EditableCard
        title="Variance explanation"
        fieldKey="varianceExplanation"
        sections={sections}
        reportId={reportId}
        updateReport={updateReport}
      />

      {/* Grants list */}
      {grants.length > 0 && (
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Grants</h3>
          <ul className={styles.grantList}>
            {grants.map((g) => (
              <li key={g.id} className={styles.grantItem}>
                <div className={styles.grantInfo}>
                  <span className={styles.grantTitle}>{g.title}</span>
                  {g.funder && <span className={styles.grantFunder}>{g.funder}</span>}
                </div>
                <div className={styles.grantRight}>
                  {g.amount && <span className={styles.grantAmt}>{g.amount}</span>}
                  <span className={`${styles.grantStatus} ${styles['status_' + (g.status ?? 'draft').toLowerCase().replace(/\s/g, '_')]}`}>
                    {g.status}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
