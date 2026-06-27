import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext.jsx';
import { useOrg } from '../../../context/OrgContext.jsx';
import { useStaff } from '../../../context/StaffContext.jsx';
import { useFunders } from '../../../context/FundersContext.jsx';
import { useGrants } from '../../../context/GrantsContext.jsx';
import { useTheme } from '../../../context/ThemeContext.jsx';
import { supabase } from '../../../lib/supabase.js';
import { ROUTES } from '../../../constants/routes.js';
import {
  ArrowRight,
  Building,
  Users,
  RefreshCw,
  CalendarDays,
  UserCog,
  Network,
  Grid,
  HelpCircle,
  Moon,
  LogOut,
} from '../../../components/icons.jsx';
import styles from './More.module.css';

// More tab (PDF p.22).
// Sections: Funding / Settings / Support. Dark mode toggle at bottom.
// Logout is inside the identity card. Templates removed.

export default function More() {
  const { user } = useAuth();
  const { org } = useOrg();
  const { activeStaff, pendingInvites } = useStaff();
  const { funders } = useFunders();
  const { grants } = useGrants();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const displayName =
    user?.user_metadata?.first_name
      ? `${user.user_metadata.first_name} ${user.user_metadata.last_name ?? ''}`.trim()
      : user?.email ?? '';

  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || '?';

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate(ROUTES.signIn, { replace: true });
  }

  // Live hint text
  const activeGrants = grants.filter((g) => g.filter !== 'Unsuccessful').length;
  const reportsDue = funders.filter((f) => f.reportDue).length;
  const volunteers = activeStaff.filter((s) => s.volunteer).length;
  const openGrants = grants.filter((g) => g.filter === 'Open').length;

  const fundingItems = [
    {
      to: ROUTES.funders,
      icon: <Building />,
      label: 'Funders & donors',
      hint: funders.length > 0
        ? `${funders.length} funder${funders.length !== 1 ? 's' : ''} · ${activeGrants} active grant${activeGrants !== 1 ? 's' : ''}`
        : 'Manage grant funders',
      badge: reportsDue > 0 ? `${reportsDue} due` : null,
    },
    {
      to: ROUTES.staff,
      icon: <Users />,
      label: 'Staff',
      hint: activeStaff.length > 0
        ? `${activeStaff.length} staff${volunteers > 0 ? ` · ${volunteers} volunteer${volunteers !== 1 ? 's' : ''}` : ''}`
        : 'Team members and roles',
      badge: pendingInvites.length > 0 ? `${pendingInvites.length} invite${pendingInvites.length !== 1 ? 's' : ''}` : null,
    },
    {
      to: ROUTES.grants,
      icon: <RefreshCw />,
      label: 'Grants tracker',
      hint: openGrants > 0 ? `${openGrants} open application${openGrants !== 1 ? 's' : ''}` : 'Track grants and deadlines',
      badge: null,
    },
    {
      to: ROUTES.reportsScheduled,
      icon: <CalendarDays />,
      label: 'Scheduled reports',
      hint: 'Scheduled this week',
      badge: null,
    },
  ];

  const settingsItems = [
    {
      to: ROUTES.settingsPersonal,
      icon: <UserCog />,
      label: 'Personal Settings',
      hint: 'Email, password, profile image',
    },
    {
      to: ROUTES.settingsOrganisation,
      icon: <Network />,
      label: 'Organisation',
      hint: 'Name, logo, users, roles, data',
    },
    {
      to: ROUTES.settingsIntegrations,
      icon: <Grid />,
      label: 'Integrations & App',
      hint: 'Connect apps, billing, and templates',
    },
  ];

  const supportItems = [
    {
      to: ROUTES.helpFaq,
      icon: <HelpCircle />,
      label: 'Help / FAQ',
      hint: 'Support for commonly asked questions',
    },
  ];

  return (
    <div className={styles.page}>
      {/* Identity card */}
      <div className={styles.identity}>
        <span className={styles.avatar} aria-hidden="true">{initials}</span>
        <div className={styles.identityText}>
          <p className={styles.identityName}>{displayName}</p>
          {org?.name && <p className={styles.identityOrg}>{org.name}</p>}
        </div>
        <button type="button" className={styles.logoutBtn} onClick={handleLogout}>
          <LogOut size={18} />
          Logout
        </button>
      </div>

      <Section heading="Funding" items={fundingItems} />
      <Section heading="Settings" items={settingsItems} />
      <Section heading="Support" items={supportItems} />

      {/* Dark mode toggle */}
      <button
        type="button"
        className={`${styles.darkMode} ${theme === 'dark' ? styles.darkModeOn : ''}`}
        onClick={toggleTheme}
        aria-pressed={theme === 'dark'}
      >
        <Moon size={18} />
        Dark mode
      </button>
    </div>
  );
}

function Section({ heading, items }) {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionHeading}>{heading}</h2>
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.label}>
            <Link to={item.to} className={styles.item}>
              <span className={styles.itemIcon} aria-hidden="true">{item.icon}</span>
              <span className={styles.itemText}>
                <span className={styles.itemLabel}>{item.label}</span>
                {item.hint && <span className={styles.itemHint}>{item.hint}</span>}
              </span>
              {item.badge && <span className={styles.badge}>{item.badge}</span>}
              <span className={styles.arrow} aria-hidden="true">
                <ArrowRight size={16} />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
