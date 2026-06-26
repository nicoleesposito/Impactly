import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScheduledReports, ONE_TIME } from '../../../context/ScheduledReportsContext.jsx';
import { useOrg } from '../../../context/OrgContext.jsx';
import { ChevronLeft, ChevronDown, Mail, Phone, Download } from '../../../components/icons.jsx';
import styles from './ScheduleReport.module.css';

// Schedule a report (PDF p.37).
// On submit the schedule is added to ScheduledReportsContext and appears on the
// Scheduled reports list (p.36) — under "Sending this week" for a one-time send,
// or "Recurring schedules" otherwise.

const FREQUENCIES = [ONE_TIME, 'Weekly', 'Monthly', 'Quarterly', 'Annually'];

const REPORT_TYPES = [
  'Attendance report',
  'Impact summary',
  'Progress report',
  'Financial report',
  'Custom report',
];

const TIMEZONES = [
  'South Africa GMT +2',
  'GMT +0',
  'GMT +1',
  'East Africa GMT +3',
];

const CHANNELS = [
  { value: 'email',    label: 'Email',    icon: <Mail size={22} /> },
  { value: 'whatsapp', label: 'WhatsApp', icon: <Phone size={22} /> },
  { value: 'download', label: 'Download', icon: <Download size={22} /> },
];

const CONTENT = [
  { key: 'attendance', label: 'Attendance data',    default: false },
  { key: 'progress',   label: 'Progress & Outcomes', default: true },
  { key: 'story',      label: 'Story content',       default: true },
  { key: 'financials', label: 'Financials',          default: true },
];

export default function ScheduleReport() {
  const navigate = useNavigate();
  const { addScheduledReport } = useScheduledReports();
  const { org } = useOrg();

  const programmes = org?.programmes ?? [];

  const [form, setForm] = useState({
    name: '',
    programme: '',
    reportType: '',
    frequency: '',
    sendDate: '',
    sendTime: '',
    timezone: TIMEZONES[0],
    recipients: '',
  });
  const [channels, setChannels] = useState(['email']);
  const [content, setContent] = useState(
    () => Object.fromEntries(CONTENT.map((c) => [c.key, c.default])),
  );
  const [error, setError] = useState('');

  const update = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  function toggleChannel(value) {
    setChannels((prev) =>
      prev.includes(value) ? prev.filter((c) => c !== value) : [...prev, value],
    );
  }

  function toggleContent(key) {
    setContent((c) => ({ ...c, [key]: !c[key] }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) {
      setError('Please enter a report name.');
      return;
    }
    setError('');

    const frequency = form.frequency || ONE_TIME;
    // Summary line shown beneath the name on recurring schedules.
    const scheduleSummary = [
      form.recipients.trim() || form.programme,
      frequency !== ONE_TIME ? frequency.toLowerCase() : null,
    ].filter(Boolean).join(' · ');

    addScheduledReport({
      name: form.name.trim(),
      programme: form.programme,
      reportType: form.reportType,
      frequency,
      sendDate: form.sendDate,
      sendTime: form.sendTime,
      timezone: form.timezone,
      recipients: form.recipients.trim(),
      channels,
      content,
      scheduleSummary,
    });

    navigate(-1);
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button type="button" className={styles.back} onClick={() => navigate(-1)} aria-label="Back">
          <ChevronLeft size={24} />
        </button>
        <h1 className={styles.title}>Schedule a report</h1>
      </header>

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        {/* Report details */}
        <fieldset className={styles.card}>
          <legend className={styles.cardTitle}>Report details</legend>
          <input
            className={styles.input}
            placeholder="Report name"
            value={form.name}
            onChange={update('name')}
            aria-label="Report name"
          />
          <div className={styles.selectWrap}>
            <select
              className={`${styles.select} ${!form.programme ? styles.placeholder : ''}`}
              value={form.programme}
              onChange={update('programme')}
              aria-label="Programme"
            >
              <option value="" disabled>Programme</option>
              <option value="All programmes">All programmes</option>
              {programmes.map((p) => (
                <option key={p.id} value={p.name}>{p.name}</option>
              ))}
            </select>
          </div>
          <div className={styles.selectWrap}>
            <select
              className={`${styles.select} ${!form.reportType ? styles.placeholder : ''}`}
              value={form.reportType}
              onChange={update('reportType')}
              aria-label="Report type"
            >
              <option value="" disabled>Report type</option>
              {REPORT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </fieldset>

        {/* Schedule */}
        <fieldset className={styles.card}>
          <legend className={styles.cardTitle}>Schedule</legend>
          <div className={styles.selectWrap}>
            <select
              className={`${styles.select} ${!form.frequency ? styles.placeholder : ''}`}
              value={form.frequency}
              onChange={update('frequency')}
              aria-label="Frequency"
            >
              <option value="" disabled>Frequency</option>
              {FREQUENCIES.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div className={styles.row}>
            <label className={styles.miniField}>
              <span className={styles.miniLabel}>Send date</span>
              <input
                type="date"
                className={styles.miniInput}
                value={form.sendDate}
                onChange={update('sendDate')}
                aria-label="Send date"
              />
            </label>
            <label className={styles.miniField}>
              <span className={styles.miniLabel}>Send time</span>
              <input
                type="time"
                className={styles.miniInput}
                value={form.sendTime}
                onChange={update('sendTime')}
                aria-label="Send time"
              />
            </label>
          </div>
          <div className={styles.selectWrap}>
            <select
              className={styles.select}
              value={form.timezone}
              onChange={update('timezone')}
              aria-label="Timezone"
            >
              {TIMEZONES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </fieldset>

        {/* Delivery channel */}
        <fieldset className={styles.card}>
          <legend className={styles.cardTitle}>Delivery channel</legend>
          <div className={styles.channelRow}>
            {CHANNELS.map((c) => {
              const selected = channels.includes(c.value);
              return (
                <button
                  key={c.value}
                  type="button"
                  className={`${styles.channelBtn} ${selected ? styles.channelOn : ''}`}
                  aria-pressed={selected}
                  onClick={() => toggleChannel(c.value)}
                >
                  <span className={styles.channelIcon} aria-hidden="true">{c.icon}</span>
                  {c.label}
                </button>
              );
            })}
          </div>
          <input
            className={styles.input}
            placeholder="Recipients (e.g. funders, parents)"
            value={form.recipients}
            onChange={update('recipients')}
            aria-label="Recipients"
          />
        </fieldset>

        {/* Content to include */}
        <fieldset className={styles.card}>
          <legend className={styles.cardTitle}>Content to include</legend>
          {CONTENT.map((c, i) => (
            <div
              key={c.key}
              className={`${styles.toggleRow} ${i < CONTENT.length - 1 ? styles.divided : ''}`}
            >
              <span className={styles.toggleLabel}>{c.label}</span>
              <button
                type="button"
                role="switch"
                aria-checked={content[c.key]}
                aria-label={c.label}
                className={`${styles.toggle} ${content[c.key] ? styles.toggleOn : ''}`}
                onClick={() => toggleContent(c.key)}
              >
                <span className={styles.knob} />
              </button>
            </div>
          ))}
        </fieldset>

        {error && <p className={styles.error} role="alert">{error}</p>}

        <button type="submit" className={styles.submit}>Add</button>
      </form>
    </div>
  );
}
