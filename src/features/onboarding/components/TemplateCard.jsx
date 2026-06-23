import TemplateIcon from './TemplateIcon.jsx';
import { Check } from '../../../components/icons.jsx';
import styles from './TemplateCard.module.css';

// Selectable template option (radio semantics). Selected = pink fill + check.
export default function TemplateCard({ template, selected, onSelect }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      className={`${styles.card} ${selected ? styles.selected : ''}`}
      onClick={() => onSelect(template.id)}
    >
      <span className={styles.icon}>
        <TemplateIcon id={template.id} />
      </span>
      <span className={styles.text}>
        <span className={styles.title}>{template.name}</span>
        <span className={styles.description}>{template.description}</span>
      </span>
      {selected && (
        <span className={styles.check} aria-hidden="true">
          <Check />
        </span>
      )}
    </button>
  );
}
