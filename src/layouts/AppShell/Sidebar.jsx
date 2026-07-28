import { NavLink } from 'react-router-dom';
import { ROUTES } from '../../constants/routes.js';
import { useOrg } from '../../context/OrgContext.jsx';
import styles from './Sidebar.module.css';

const MANAGE = [
  { to: ROUTES.staff, label: 'Staff' },
  { to: ROUTES.funders, label: 'Funders & donors' },
  { to: ROUTES.grants, label: 'Grants tracker' },
  { to: ROUTES.reportsScheduled, label: 'Scheduled' },
];

const ADMIN = [{ to: ROUTES.settingsOrganisation, label: 'Settings' }];

function Section({ heading, items }) {
  return (
    <div className={styles.section}>
      {heading && <p className={styles.heading}>{heading}</p>}
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.active}` : styles.link
          }
        >
          {item.label}
        </NavLink>
      ))}
    </div>
  );
}

export default function Sidebar() {
  const { beneficiaryLabel } = useOrg();

  const primary = [
    { to: ROUTES.home, label: 'Home' },
    { to: ROUTES.students, label: beneficiaryLabel },
    { to: ROUTES.attendance, label: 'Attendance' },
    { to: ROUTES.reports, label: 'Reports' },
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>Impactly</div>
      <nav className={styles.nav}>
        <Section items={primary} />
        <Section heading="MANAGE" items={MANAGE} />
        <Section heading="ADMIN" items={ADMIN} />
      </nav>
    </aside>
  );
}
