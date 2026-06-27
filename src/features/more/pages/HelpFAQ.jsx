import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronDown } from '../../../components/icons.jsx';
import styles from './HelpFAQ.module.css';

const FAQS = [
  {
    q: 'How do I add a new beneficiary?',
    a: 'Go to the Students tab and tap "+ Add" in the top right. Fill in the beneficiary\'s name, date of birth, and programme. You can also import beneficiaries in bulk from a CSV spreadsheet.',
  },
  {
    q: 'How do I capture attendance?',
    a: 'From the Attendance tab, select the programme and date. Tap each learner\'s row to mark them as Present, Absent, or Late. Tap "Save attendance" when done. You can also mark all present at once using the "Mark all present" button.',
  },
  {
    q: 'How do I create a report?',
    a: 'Go to Reports and tap "+ New". Choose a template or build from scratch. Follow the steps to set the title, programme, and sections. Once created, you can edit each section directly in the report view.',
  },
  {
    q: 'How do I schedule a report to be sent automatically?',
    a: 'Go to More → Scheduled reports and tap "+ Add". Set the report name, programme, frequency, and delivery channel (Email or WhatsApp). The report will be sent automatically at the time you specify.',
  },
  {
    q: 'How do I add a funder or donor?',
    a: 'Go to More → Funders & Donors and tap "+ Add". Enter the funder\'s organisation name, type, and contact details. You can link them to specific programmes and set reporting preferences.',
  },
  {
    q: 'How do I track a grant?',
    a: 'Go to More → Grants tracker and tap "+ Add". Enter the grant name, funder, linked programme, amount, and deadline. The tracker will show progress, status, and upcoming deadlines.',
  },
  {
    q: 'How do I invite a team member?',
    a: 'Go to More → Staff and tap "+ Invite". Enter their email address and select their access level (Admin, Manager, or Staff). They will receive an invitation to join your organisation.',
  },
  {
    q: 'Can I export my data?',
    a: 'Yes. Go to More → Organisation → Data export to download all your organisation\'s data. Individual attendance and report data can also be exported from within each section.',
  },
  {
    q: 'How do I set up WhatsApp notifications?',
    a: 'Go to More → Integrations & App. Under "WhatsApp connected", tap "Configure" to link your WhatsApp Business number. Once connected, you can send reports and attendance alerts via WhatsApp.',
  },
  {
    q: 'What happens if I lose internet connection?',
    a: 'Impactly saves your attendance and form data locally while offline. Changes are synced automatically once your connection is restored. You\'ll see a sync indicator when data is being uploaded.',
  },
  {
    q: 'How do I change my organisation details?',
    a: 'Go to More → Organisation and tap on "Organisation". You can update your organisation name, type, country, and beneficiary label. Tap "Save changes" to apply.',
  },
  {
    q: 'How do I change my programme template?',
    a: 'Go to More → Integrations & App → Templates. Select the template that best matches your programme type. This affects suggested report sections and content structure.',
  },
];

function FAQItem({ item }) {
  const [open, setOpen] = useState(false);
  return (
    <li className={styles.faqItem}>
      <button
        type="button"
        className={styles.faqBtn}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className={styles.faqQ}>{item.q}</span>
        <span className={`${styles.faqChevron} ${open ? styles.faqChevronOpen : ''}`} aria-hidden="true">
          <ChevronDown size={18} />
        </span>
      </button>
      {open && <p className={styles.faqA}>{item.a}</p>}
    </li>
  );
}

export default function HelpFAQ() {
  const navigate = useNavigate();

  function handleEmail() {
    window.location.href = 'mailto:support@impactly.app?subject=Support%20Request';
  }

  function handleWhatsApp() {
    window.open('https://wa.me/27600000000?text=Hi%2C%20I%20need%20help%20with%20Impactly', '_blank', 'noopener');
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button type="button" className={styles.back} onClick={() => navigate(-1)} aria-label="Back">
          <ChevronLeft size={24} />
        </button>
        <h1 className={styles.title}>Help / FAQ</h1>
        <div className={styles.contactRow}>
          <button type="button" className={styles.contactBtn} onClick={handleEmail} aria-label="Contact via email">
            <EmailIcon />
          </button>
          <button type="button" className={`${styles.contactBtn} ${styles.whatsappBtn}`} onClick={handleWhatsApp} aria-label="Contact via WhatsApp">
            <WhatsAppIcon />
          </button>
        </div>
      </header>

      <p className={styles.intro}>
        Find answers to common questions below, or reach out to our support team using the buttons above.
      </p>

      <ul className={styles.faqList}>
        {FAQS.map((item) => (
          <FAQItem key={item.q} item={item} />
        ))}
      </ul>

      <div className={styles.contactCard}>
        <h2 className={styles.contactTitle}>Still need help?</h2>
        <p className={styles.contactText}>Our team typically responds within one business day.</p>
        <div className={styles.contactBtns}>
          <button type="button" className={styles.emailBtn} onClick={handleEmail}>
            <EmailIcon />
            Email us
          </button>
          <button type="button" className={styles.waBtn} onClick={handleWhatsApp}>
            <WhatsAppIcon />
            WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}

function EmailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M2 7l10 7 10-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2C6.48 2 2 6.48 2 12c0 1.77.46 3.43 1.27 4.87L2 22l5.27-1.25A9.94 9.94 0 0012 22c5.52 0 10-4.48 10-10S17.52 2 12 2z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M8.5 9.5c.5 1 1.5 2.5 3 3.5 1.5 1 2.5 1.5 3 1.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
