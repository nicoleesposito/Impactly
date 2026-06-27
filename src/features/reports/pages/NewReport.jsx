import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from '../../../components/icons.jsx';
import styles from './NewReport.module.css';

const TEMPLATES = [
  {
    id: 'funder-impact',
    name: 'Funder impact report',
    desc: 'Overview, attendance, progress',
    sections: {
      overview: true,
      attendanceData: true,
      progressOutcomes: true,
      storyContent: false,
      financials: false,
      nextObjectives: false,
      challenges: false,
    },
  },
  {
    id: 'parent-update',
    name: 'Parent update',
    desc: 'Attendance, session highlights',
    sections: {
      overview: false,
      attendanceData: true,
      progressOutcomes: false,
      storyContent: true,
      financials: false,
      nextObjectives: false,
      challenges: false,
    },
  },
  {
    id: 'annual-report',
    name: 'Annual report',
    desc: 'Full year, all sections',
    sections: {
      overview: true,
      attendanceData: true,
      progressOutcomes: true,
      storyContent: true,
      financials: true,
      nextObjectives: true,
      challenges: true,
    },
  },
  {
    id: 'grant-application',
    name: 'Grant application',
    desc: 'Overview, programme, budget',
    sections: {
      overview: true,
      attendanceData: false,
      progressOutcomes: false,
      storyContent: false,
      financials: true,
      nextObjectives: true,
      challenges: false,
    },
  },
  {
    id: 'project-report',
    name: 'Project report',
    desc: 'Progress, challenges, next steps',
    sections: {
      overview: false,
      attendanceData: false,
      progressOutcomes: true,
      storyContent: false,
      financials: false,
      nextObjectives: true,
      challenges: true,
    },
  },
];

const DEFAULT_SECTIONS = {
  overview: true,
  attendanceData: true,
  progressOutcomes: true,
  storyContent: true,
  financials: true,
  nextObjectives: false,
  challenges: false,
};

export default function NewReport() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(TEMPLATES[0].id);

  const selectedTemplate = TEMPLATES.find((t) => t.id === selected) ?? TEMPLATES[0];

  function handleUseTemplate() {
    navigate('/reports/builder', {
      state: { template: selectedTemplate.id, sections: selectedTemplate.sections },
    });
  }

  function handleBuildFromScratch() {
    navigate('/reports/builder', {
      state: { template: null, sections: DEFAULT_SECTIONS },
    });
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button
          type="button"
          className={styles.back}
          onClick={() => navigate(-1)}
          aria-label="Back"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className={styles.title}>New report</h1>
      </header>

      <div className={styles.banner}>
        <p className={styles.bannerText}>
          Pick a template or build from scratch with the report builder
        </p>
      </div>

      <section className={styles.templateSection}>
        <h2 className={styles.sectionLabel}>START FROM A TEMPLATE</h2>
        <div className={styles.templateList}>
          {TEMPLATES.map((t) => {
            const isSelected = selected === t.id;
            return (
              <button
                key={t.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                className={`${styles.templateCard} ${isSelected ? styles.templateCardSelected : ''}`}
                onClick={() => setSelected(t.id)}
              >
                <div className={styles.templateCardInner}>
                  <div className={styles.templateInfo}>
                    <span className={styles.templateName}>{t.name}</span>
                    <span className={styles.templateDesc}>{t.desc}</span>
                  </div>
                  {isSelected && (
                    <span className={styles.selectedDot} aria-hidden="true" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <div className={styles.orDivider}>
        <span className={styles.orText}>or</span>
      </div>

      <button
        type="button"
        className={styles.scratchBtn}
        onClick={handleBuildFromScratch}
      >
        Build from scratch
      </button>

      <div className={styles.footer}>
        <button
          type="button"
          className={styles.useTemplateBtn}
          onClick={handleUseTemplate}
        >
          Use this template &rarr;
        </button>
      </div>
    </div>
  );
}
