import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useOrg } from '../../../context/OrgContext.jsx';
import { useBeneficiaries } from '../../../context/BeneficiariesContext.jsx';
import { useGrants } from '../../../context/GrantsContext.jsx';
import { useReports } from '../../../context/ReportsContext.jsx';
import { ChevronLeft, Check } from '../../../components/icons.jsx';
import styles from './ReportBuilder.module.css';

const DEFAULT_SECTIONS = {
  overview: true,
  attendanceData: true,
  progressOutcomes: true,
  storyContent: true,
  financials: true,
  nextObjectives: false,
  challenges: false,
};

const SECTION_DEFS = [
  { key: 'overview',         label: 'Overview',                 desc: 'Auto-populated + narrative' },
  { key: 'attendanceData',   label: 'Attendance data',          desc: 'Monthly bars + narrative' },
  { key: 'progressOutcomes', label: 'Progress & outcomes',      desc: 'Cohort gains' },
  { key: 'storyContent',     label: 'Story content',            desc: 'Photos, quotes, testimonials' },
  { key: 'financials',       label: 'Financials',               desc: 'Grant spend, cost per learner' },
  { key: 'nextObjectives',   label: 'Next quarter objectives',  desc: '' },
  { key: 'challenges',       label: 'Challenges & mitigations', desc: '' },
];

const STEPS = [
  { num: 1, label: 'Details' },
  { num: 2, label: 'Sections' },
  { num: 3, label: 'Preview' },
  { num: 4, label: 'Review' },
];

export default function ReportBuilder() {
  const navigate = useNavigate();
  const { state: locationState } = useLocation();
  const seed = locationState ?? {};

  const { org } = useOrg();
  const { beneficiaries } = useBeneficiaries();
  const { grants } = useGrants();
  const { addReport } = useReports();

  const programmes = org?.programmes ?? [];

  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState({
    title: '',
    programmeId: seed.programmeId ?? '',
    funder: '',
    dueDate: '',
    template: seed.template ?? null,
    sections: seed.sections ?? DEFAULT_SECTIONS,
    objectives: '',
    challengesText: '',
  });

  const update = (key) => (e) =>
    setDraft((d) => ({ ...d, [key]: e.target.value }));

  function toggleSection(key) {
    setDraft((d) => ({
      ...d,
      sections: { ...d.sections, [key]: !d.sections[key] },
    }));
  }

  const programme = programmes.find((p) => p.id === draft.programmeId) ?? null;
  const enrolled = beneficiaries.filter(
    (b) => (!draft.programmeId || b.programmeId === draft.programmeId) && b.status === 'Active',
  );

  async function handleSave() {
    setSaving(true);
    const report = await addReport(draft);
    setSaving(false);
    if (report) {
      navigate(`/reports/${report.id}`, { replace: true });
    }
  }

  function canAdvance() {
    if (step === 1) return draft.title.trim().length > 0;
    return true;
  }

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <button
          type="button"
          className={styles.back}
          onClick={() => (step > 1 ? setStep((s) => s - 1) : navigate(-1))}
          aria-label="Back"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className={styles.title}>Report builder</h1>
        {step === 4 ? (
          <button
            type="button"
            className={styles.saveGhost}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
        ) : (
          <span className={styles.headerSpacer} aria-hidden="true" />
        )}
      </header>

      {/* Stepper */}
      <div className={styles.stepper} role="list">
        {STEPS.map((s, idx) => {
          const isDone = step > s.num;
          const isCurrent = step === s.num;
          return (
            <div key={s.num} className={styles.stepItem} role="listitem">
              <div
                className={`${styles.stepCircle} ${isDone ? styles.stepDone : ''} ${isCurrent ? styles.stepCurrent : ''}`}
                aria-current={isCurrent ? 'step' : undefined}
              >
                {isDone ? <Check size={14} /> : s.num}
              </div>
              <span className={`${styles.stepLabel} ${isCurrent ? styles.stepLabelCurrent : ''}`}>
                {s.label}
              </span>
              {idx < STEPS.length - 1 && <div className={styles.stepConnector} />}
            </div>
          );
        })}
      </div>

      {/* Step content */}
      <div className={styles.content}>
        {step === 1 && (
          <Step1Details draft={draft} update={update} programmes={programmes} />
        )}
        {step === 2 && (
          <Step2Sections draft={draft} toggleSection={toggleSection} update={update} />
        )}
        {step === 3 && (
          <Step3Preview draft={draft} programme={programme} enrolled={enrolled} grants={grants} />
        )}
        {step === 4 && (
          <Step4Review draft={draft} programme={programme} />
        )}
      </div>

      {/* Navigation */}
      <div className={styles.navRow}>
        {step > 1 && (
          <button
            type="button"
            className={styles.btnBack}
            onClick={() => setStep((s) => s - 1)}
          >
            Back
          </button>
        )}
        {step < 4 ? (
          <button
            type="button"
            className={styles.btnNext}
            onClick={() => setStep((s) => s + 1)}
            disabled={!canAdvance()}
          >
            Next
          </button>
        ) : (
          <button
            type="button"
            className={styles.btnNext}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving…' : 'Save report'}
          </button>
        )}
      </div>
    </div>
  );
}

/* ── Step 1: Details ─────────────────────────────── */
function Step1Details({ draft, update, programmes }) {
  return (
    <fieldset className={styles.card}>
      <legend className={styles.cardTitle}>Report details</legend>
      <input
        className={styles.input}
        placeholder="Report title *"
        value={draft.title}
        onChange={update('title')}
        aria-label="Report title"
      />
      <div className={styles.selectWrap}>
        <select
          className={`${styles.select} ${!draft.programmeId ? styles.placeholder : ''}`}
          value={draft.programmeId}
          onChange={update('programmeId')}
          aria-label="Programme"
        >
          <option value="">All programmes</option>
          {programmes.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>
      <input
        className={styles.input}
        placeholder="Funder (optional)"
        value={draft.funder}
        onChange={update('funder')}
        aria-label="Funder"
      />
      <div className={styles.dateWrap}>
        <input
          type="date"
          className={styles.input}
          value={draft.dueDate}
          onChange={update('dueDate')}
          aria-label="Due date"
        />
      </div>
    </fieldset>
  );
}

/* ── Step 2: Sections ────────────────────────────── */
function Step2Sections({ draft, toggleSection, update }) {
  return (
    <div className={styles.step2Wrap}>
      <fieldset className={styles.card}>
        <legend className={styles.cardTitle}>SECTIONS TO INCLUDE</legend>
        {SECTION_DEFS.map((def, i) => {
          const isOn = !!draft.sections[def.key];
          return (
            <div
              key={def.key}
              className={`${styles.toggleRow} ${i < SECTION_DEFS.length - 1 ? styles.divided : ''}`}
            >
              <div className={styles.toggleInfo}>
                <span className={styles.toggleLabel}>{def.label}</span>
                {def.desc && <span className={styles.toggleDesc}>{def.desc}</span>}
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={isOn}
                aria-label={def.label}
                className={`${styles.toggle} ${isOn ? styles.toggleOn : ''}`}
                onClick={() => toggleSection(def.key)}
              >
                <span className={styles.knob} />
              </button>
            </div>
          );
        })}
      </fieldset>

      {draft.sections.nextObjectives && (
        <fieldset className={styles.card}>
          <legend className={styles.cardTitle}>Next quarter objectives</legend>
          <textarea
            className={styles.textarea}
            placeholder="Describe your objectives for the next quarter&hellip;"
            value={draft.objectives}
            onChange={update('objectives')}
            aria-label="Next quarter objectives"
            rows={4}
          />
        </fieldset>
      )}

      {draft.sections.challenges && (
        <fieldset className={styles.card}>
          <legend className={styles.cardTitle}>Challenges &amp; mitigations</legend>
          <textarea
            className={styles.textarea}
            placeholder="Describe challenges faced and how they were mitigated&hellip;"
            value={draft.challengesText}
            onChange={update('challengesText')}
            aria-label="Challenges and mitigations"
            rows={4}
          />
        </fieldset>
      )}
    </div>
  );
}

/* ── Step 3: Preview ─────────────────────────────── */
function Step3Preview({ draft, programme, enrolled, grants }) {
  const enabledSections = SECTION_DEFS.filter((d) => draft.sections[d.key]);
  const relevantGrants = grants.filter(
    (g) => !draft.programmeId || g.programme === programme?.name,
  );

  return (
    <div className={styles.previewWrap}>
      <p className={styles.previewHint}>
        Preview of data that will be included in your report.
      </p>
      {enabledSections.length === 0 && (
        <div className={styles.previewCard}>
          <p className={styles.previewEmpty}>No sections enabled. Go back to Step 2 to add sections.</p>
        </div>
      )}
      {enabledSections.map((def) => (
        <div key={def.key} className={styles.previewCard}>
          <h3 className={styles.previewCardTitle}>{def.label}</h3>
          <PreviewContent
            sectionKey={def.key}
            draft={draft}
            programme={programme}
            enrolled={enrolled}
            grants={relevantGrants}
          />
        </div>
      ))}
    </div>
  );
}

function PreviewContent({ sectionKey, draft, programme, enrolled, grants }) {
  switch (sectionKey) {
    case 'overview':
      return (
        <ul className={styles.previewList}>
          <li>Programme: {programme?.name ?? 'All programmes'}</li>
          <li>{enrolled.length} enrolled</li>
        </ul>
      );
    case 'attendanceData':
      return (
        <p className={styles.previewMeta}>{enrolled.length} enrolled &middot; attendance data will appear here</p>
      );
    case 'progressOutcomes':
      return (
        <p className={styles.previewMeta}>{enrolled.length} enrolled &middot; cohort progress data will appear here</p>
      );
    case 'storyContent': {
      const photos = enrolled.flatMap((b) => b.storyImageUrls ?? []).length;
      const quoteCount = enrolled.filter((b) => b.storyQuotes).length;
      return (
        <p className={styles.previewMeta}>{photos} photos &middot; {quoteCount} quotes from {enrolled.length} beneficiaries</p>
      );
    }
    case 'financials':
      return (
        <p className={styles.previewMeta}>
          {grants.length > 0 ? `${grants.length} grant(s) found` : 'No grants found for this programme'}
        </p>
      );
    case 'nextObjectives':
      return (
        <p className={styles.previewMeta}>{draft.objectives || 'No objectives entered yet'}</p>
      );
    case 'challenges':
      return (
        <p className={styles.previewMeta}>{draft.challengesText || 'No challenges entered yet'}</p>
      );
    default:
      return null;
  }
}

/* ── Step 4: Review ──────────────────────────────── */
function Step4Review({ draft, programme }) {
  const enabledSections = SECTION_DEFS.filter((d) => draft.sections[d.key]);

  function formatDate(d) {
    if (!d) return '—';
    return new Date(d + 'T00:00:00').toLocaleDateString('en-ZA', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  return (
    <div className={styles.reviewWrap}>
      <div className={styles.card}>
        <div className={styles.reviewRow}>
          <span className={styles.reviewKey}>Title</span>
          <span className={styles.reviewVal}>{draft.title || '—'}</span>
        </div>
        <div className={styles.reviewRow}>
          <span className={styles.reviewKey}>Programme</span>
          <span className={styles.reviewVal}>{programme?.name ?? 'All programmes'}</span>
        </div>
        <div className={styles.reviewRow}>
          <span className={styles.reviewKey}>Funder</span>
          <span className={styles.reviewVal}>{draft.funder || '—'}</span>
        </div>
        <div className={styles.reviewRow}>
          <span className={styles.reviewKey}>Due date</span>
          <span className={styles.reviewVal}>{formatDate(draft.dueDate)}</span>
        </div>
        {draft.template && (
          <div className={styles.reviewRow}>
            <span className={styles.reviewKey}>Template</span>
            <span className={styles.reviewVal}>{draft.template}</span>
          </div>
        )}
      </div>

      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Sections included</h3>
        {enabledSections.length === 0 ? (
          <p className={styles.reviewEmpty}>No sections selected</p>
        ) : (
          <ul className={styles.sectionList}>
            {enabledSections.map((d) => (
              <li key={d.key} className={styles.sectionListItem}>
                <Check size={14} />
                {d.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
