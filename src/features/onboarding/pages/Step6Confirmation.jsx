import { useNavigate } from 'react-router-dom';
import StepProgress from '../components/StepProgress.jsx';
import { Check } from '../../../components/icons.jsx';
import { useOnboarding } from '../OnboardingContext.jsx';
import { ROUTES } from '../../../constants/routes.js';
import styles from './Step6Confirmation.module.css';

export default function Step6Confirmation() {
  const navigate = useNavigate();
  const { data } = useOnboarding();

  const checklist = [
    'Organisation profile created',
    'Template applied',
    `${data.beneficiaries.length} ${data.beneficiaries.length === 1 ? 'beneficiary' : 'beneficiaries'} added`,
    `${data.team.length} team ${data.team.length === 1 ? 'member' : 'members'} invited`,
  ];

  return (
    <div className={styles.shell}>
      <StepProgress step={6} />

      <div className={styles.body}>
        <span className={styles.badge} aria-hidden="true">
          <Check size={36} />
        </span>
        <h1 className={styles.title}>Your organisation is ready</h1>
        <p className={styles.subtitle}>Here&rsquo;s what we&rsquo;ve set up</p>

        <ul className={styles.checklist}>
          {checklist.map((item) => (
            <li key={item} className={styles.item}>
              <span className={styles.check} aria-hidden="true">
                <Check />
              </span>
              {item}
            </li>
          ))}
        </ul>

        <div className={styles.taskCard}>
          <p className={styles.taskTitle}>Your first task is waiting</p>
          <p className={styles.taskHint}>Capture today&rsquo;s attendance</p>
          <button
            type="button"
            className={styles.cta}
            onClick={() => navigate(ROUTES.home)}
          >
            Go to today
          </button>
        </div>
      </div>
    </div>
  );
}
