import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes.js';
import { ChevronLeft, ArrowRight, Cog, Download, UploadCloud } from '../../../components/icons.jsx';
import styles from './OrganisationSettings.module.css';

// Organisation settings hub (PDF p.24).
// Users & Roles has been removed — permissions now live under Staff.
const ITEMS = [
  {
    to: ROUTES.settingsOrganisationDetails,
    icon: <Cog />,
    label: 'Organisation',
    hint: 'Name, type, country, etc',
  },
  {
    to: ROUTES.settingsOrganisation, // data import — placeholder destination
    icon: <Download />,
    label: 'Data import',
    hint: 'Import from CSV or Excel',
  },
  {
    to: ROUTES.settingsOrganisation, // data export — placeholder destination
    icon: <UploadCloud />,
    label: 'Data export',
    hint: 'Download all org data',
  },
];

export default function OrganisationSettings() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button type="button" className={styles.back} onClick={() => navigate(-1)} aria-label="Back">
          <ChevronLeft size={24} />
        </button>
        <h1 className={styles.title}>Organisation settings</h1>
      </header>

      <ul className={styles.list}>
        {ITEMS.map((item) => (
          <li key={item.label}>
            <Link to={item.to} className={styles.item}>
              <span className={styles.itemIcon} aria-hidden="true">{item.icon}</span>
              <span className={styles.itemText}>
                <span className={styles.itemLabel}>{item.label}</span>
                <span className={styles.itemHint}>{item.hint}</span>
              </span>
              <span className={styles.arrow} aria-hidden="true"><ArrowRight size={16} /></span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
