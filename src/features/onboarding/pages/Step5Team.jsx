import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OnboardingShell from '../components/OnboardingShell.jsx';
import WizardFooter from '../components/WizardFooter.jsx';
import PersonRow from '../components/PersonRow.jsx';
import TextField from '../../../components/ui/TextField/index.js';
import SelectField from '../../../components/ui/SelectField/index.js';
import { ChevronDown } from '../../../components/icons.jsx';
import { useOnboarding } from '../OnboardingContext.jsx';
import { ROUTES } from '../../../constants/routes.js';
import { INVITE_ROLES } from '../../../constants/onboarding.js';
import styles from './Step5Team.module.css';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function roleLabel(value) {
  return INVITE_ROLES.find((r) => r.value === value)?.label.split(' - ')[0] ?? value;
}

export default function Step5Team() {
  const navigate = useNavigate();
  const { data, addTeamMember, removeTeamMember } = useOnboarding();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('staff');
  const [errors, setErrors] = useState({});

  function handleAdd() {
    const next = {};
    if (!EMAIL_RE.test(email)) next.email = 'Please enter a valid email address';
    else if (data.team.some((m) => m.email === email.trim()))
      next.email = 'This email has already been added';
    if (!role) next.role = 'Please select a role';
    setErrors(next);
    if (Object.keys(next).length) return;

    addTeamMember({ id: crypto.randomUUID(), email: email.trim(), role });
    setEmail('');
    setRole('staff');
  }

  const list = data.team;

  return (
    <OnboardingShell
      step={5}
      label="Invite team"
      title="Invite your team"
      subtitle="Add staff so they can log attendance. You control their access level."
      footer={
        <WizardFooter
          onBack={() => navigate(ROUTES.onboardingBeneficiaries)}
          onContinue={() => navigate(ROUTES.onboardingComplete)}
        />
      }
      afterFooter={
        list.length > 0 ? (
          <div className={styles.afterList}>
            <div className={styles.nudge} aria-hidden="true">
              <ChevronDown />
            </div>
            <section>
              <h2 className={styles.listHeading}>Invited members</h2>
              {list.map((m) => (
                <PersonRow
                  key={m.id}
                  initials={m.email.charAt(0).toUpperCase()}
                  title={m.email}
                  subtitle={roleLabel(m.role)}
                  onRemove={() => removeTeamMember(m.id)}
                />
              ))}
            </section>
          </div>
        ) : null
      }
    >
      <ul className={styles.legend}>
        {INVITE_ROLES.map((r) => (
          <li key={r.value} className={styles.chip}>
            {r.label}
          </li>
        ))}
      </ul>

      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
        autoComplete="email"
      />
      <SelectField
        label="Role"
        options={INVITE_ROLES}
        value={role}
        onChange={(e) => setRole(e.target.value)}
        error={errors.role}
      />

      <button type="button" className={styles.addBtn} onClick={handleAdd}>
        + Add
      </button>
    </OnboardingShell>
  );
}
