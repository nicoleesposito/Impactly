import { ChevronLeft, ChevronRight } from '../../../components/icons.jsx';
import styles from './WizardFooter.module.css';

// Back (outline) + Continue (primary) footer, pinned to the bottom of each step.
export default function WizardFooter({
  onBack,
  onContinue,
  continueLabel = 'Continue',
  continueDisabled = false,
  continueType = 'button',
}) {
  return (
    <div className={styles.footer}>
      <button type="button" className={styles.back} onClick={onBack}>
        <ChevronLeft />
        Back
      </button>
      <button
        type={continueType}
        className={styles.continue}
        onClick={onContinue}
        disabled={continueDisabled}
      >
        {continueLabel}
        <ChevronRight />
      </button>
    </div>
  );
}
