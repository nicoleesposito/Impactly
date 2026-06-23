import { useNavigate } from 'react-router-dom';
import OnboardingShell from '../components/OnboardingShell.jsx';
import WizardFooter from '../components/WizardFooter.jsx';
import TemplateCard from '../components/TemplateCard.jsx';
import { useOnboarding } from '../OnboardingContext.jsx';
import { ROUTES } from '../../../constants/routes.js';
import { TEMPLATES } from '../../../constants/templates.js';
import styles from './Step3Template.module.css';

export default function Step3Template() {
  const navigate = useNavigate();
  const { data, setTemplate } = useOnboarding();
  const selected = data.template;

  function handleContinue() {
    if (selected) navigate(ROUTES.onboardingBeneficiaries);
  }

  return (
    <OnboardingShell
      step={3}
      label="Choose template"
      title="Choose a template"
      subtitle="Pick the one closest to your work. Everything is customisable later."
      footer={
        <WizardFooter
          onBack={() => navigate(ROUTES.onboardingOrganisation)}
          onContinue={handleContinue}
          continueLabel="Use this template"
          continueDisabled={!selected}
        />
      }
    >
      <div className={styles.list} role="radiogroup" aria-label="Programme template">
        {TEMPLATES.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            selected={selected === template.id}
            onSelect={setTemplate}
          />
        ))}
      </div>
    </OnboardingShell>
  );
}
