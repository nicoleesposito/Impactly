import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext.jsx';
import { useOrg } from '../../../context/OrgContext.jsx';
import { supabase } from '../../../lib/supabase.js';
import { ROUTES } from '../../../constants/routes.js';
import { ChevronRight } from '../../../components/icons.jsx';
import styles from './More.module.css';

const SECTIONS = [
  {
    heading: 'Manage',
    items: [
      { label: 'Funders',      to: ROUTES.funders,    hint: 'Manage grant funders'         },
      { label: 'Grants',       to: ROUTES.grants,     hint: 'Track grants and deadlines'   },
      { label: 'Staff',        to: ROUTES.staff,      hint: 'Team members and roles'       },
      { label: 'Templates',    to: ROUTES.templates,  hint: 'Programme and report templates'},
    ],
  },
  {
    heading: 'Settings',
    items: [
      { label: 'Organisation',       to: ROUTES.settingsOrganisation, hint: 'Profile, logo, and details' },
      { label: 'Integrations & App', to: ROUTES.settingsIntegrations, hint: 'Connect apps, billing, and templates' },
      { label: 'Personal',           to: ROUTES.settingsPersonal,     hint: 'Your account settings'      },
    ],
  },
];

export default function More() {
  const { user } = useAuth();
  const { org } = useOrg();
  const navigate = useNavigate();

  const displayName =
    user?.user_metadata?.first_name
      ? `${user.user_metadata.first_name} ${user.user_metadata.last_name ?? ''}`.trim()
      : user?.email ?? '';

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate(ROUTES.signIn, { replace: true });
  }

  return (
    <div className={styles.page}>
      {/* Identity card */}
      <div className={styles.identity}>
        <span className={styles.avatar} aria-hidden="true">
          {displayName?.[0]?.toUpperCase() ?? '?'}
        </span>
        <div className={styles.identityText}>
          <p className={styles.identityName}>{displayName}</p>
          {org?.name && <p className={styles.identityOrg}>{org.name}</p>}
        </div>
      </div>

      {SECTIONS.map((section) => (
        <section key={section.heading} className={styles.section}>
          <h2 className={styles.sectionHeading}>{section.heading}</h2>
          <ul className={styles.list}>
            {section.items.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className={styles.item}>
                  <span className={styles.itemText}>
                    <span className={styles.itemLabel}>{item.label}</span>
                    {item.hint && <span className={styles.itemHint}>{item.hint}</span>}
                  </span>
                  <span className={styles.chevron} aria-hidden="true">
                    <ChevronRight size={16} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <button type="button" className={styles.signOut} onClick={handleSignOut}>
        Sign out
      </button>
    </div>
  );
}
