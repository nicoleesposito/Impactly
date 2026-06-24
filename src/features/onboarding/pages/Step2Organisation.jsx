import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OnboardingShell from '../components/OnboardingShell.jsx';
import WizardFooter from '../components/WizardFooter.jsx';
import TextField from '../../../components/ui/TextField/index.js';
import SelectField from '../../../components/ui/SelectField/index.js';
import { useOnboarding } from '../OnboardingContext.jsx';
import { ROUTES } from '../../../constants/routes.js';
import { ORG_TYPES, COUNTRIES, BENEFICIARY_RANGES } from '../../../constants/onboarding.js';
import styles from './Step2Organisation.module.css';

export default function Step2Organisation() {
  const navigate = useNavigate();
  const { data, setOrganisation } = useOnboarding();
  const org = data.organisation;
  const [errors, setErrors] = useState({});

  const update = (field) => (e) => setOrganisation({ [field]: e.target.value });

  function validate() {
    const next = {};
    if (!org.name.trim()) next.name = 'Please enter your organisation name';
    if (!org.type) next.type = 'Please select an organisation type';
    if (!org.country) next.country = 'Please select a country';
    if (!org.size) next.size = 'Please select a range';
    if (!org.beneficiaryLabel.trim())
      next.beneficiaryLabel = 'Please enter a label (e.g. Students, Learners, Youth)';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleContinue() {
    if (validate()) navigate(ROUTES.onboardingTemplate);
  }

  return (
    <OnboardingShell
      step={2}
      label="Organisation"
      title="Your organisation"
      subtitle="Helps us tailor the setup to how you work."
      footer={
        <WizardFooter
          onBack={() => navigate(ROUTES.onboardingAccount)}
          onContinue={handleContinue}
        />
      }
    >
      <TextField
        label="Organisation name"
        value={org.name}
        onChange={update('name')}
        error={errors.name}
      />
      <SelectField
        label="Type"
        options={ORG_TYPES}
        value={org.type}
        onChange={update('type')}
        error={errors.type}
      />
      <SelectField
        label="Country"
        options={COUNTRIES}
        value={org.country}
        onChange={update('country')}
        error={errors.country}
      />
      <SelectField
        label="Number of beneficiaries"
        options={BENEFICIARY_RANGES}
        value={org.size}
        onChange={update('size')}
        error={errors.size}
      />
      <p className={styles.trialNote}>
        All organisations get a free 1-month Pro trial with unlimited beneficiaries.
        After the trial, plans supporting more than 300 beneficiaries require a paid subscription.
      </p>
      <TextField
        label="Beneficiaries"
        value={org.beneficiaryLabel}
        onChange={update('beneficiaryLabel')}
        error={errors.beneficiaryLabel}
        maxLength={30}
      />
    </OnboardingShell>
  );
}
