import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TemplateCard from '../../onboarding/components/TemplateCard.jsx';
import { TEMPLATES } from '../../../constants/templates.js';
import { ChevronLeft } from '../../../components/icons.jsx';
import styles from './Templates.module.css';

// Templates (PDF p.41).
// Standalone template picker reached from More — reuses the onboarding
// TemplateCard so the two stay visually identical.
export default function Templates() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button type="button" className={styles.back} onClick={() => navigate(-1)} aria-label="Back">
          <ChevronLeft size={24} />
        </button>
        <div className={styles.heading}>
          <h1 className={styles.title}>Templates</h1>
          <p className={styles.subtitle}>Pick the one closest to your work</p>
        </div>
      </header>

      <div className={styles.list} role="radiogroup" aria-label="Programme template">
        {TEMPLATES.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            selected={selected === template.id}
            onSelect={setSelected}
          />
        ))}
      </div>
    </div>
  );
}
