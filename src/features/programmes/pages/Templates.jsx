import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TemplateCard from '../../onboarding/components/TemplateCard.jsx';
import { TEMPLATES } from '../../../constants/templates.js';
import { useOrg } from '../../../context/OrgContext.jsx';
import { ChevronLeft } from '../../../components/icons.jsx';
import styles from './Templates.module.css';

const STORAGE_KEY = 'impactly_selected_template';

function loadSaved(orgId) {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY}_${orgId}`);
    if (raw) return raw;
  } catch { /* ignore */ }
  return null;
}

function saveTpl(orgId, templateId) {
  try {
    localStorage.setItem(`${STORAGE_KEY}_${orgId}`, templateId);
  } catch { /* ignore */ }
}

export default function Templates() {
  const navigate = useNavigate();
  const { org } = useOrg();
  const orgId = org?.id ?? 'default';

  const [selected, setSelected] = useState(() => loadSaved(orgId));

  function handleSelect(id) {
    setSelected(id);
    saveTpl(orgId, id);
  }

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
            onSelect={handleSelect}
          />
        ))}
      </div>
    </div>
  );
}
