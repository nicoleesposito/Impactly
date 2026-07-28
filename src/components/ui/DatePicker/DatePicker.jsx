import { useEffect, useId, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, CalendarDays } from '../../icons.jsx';
import styles from './DatePicker.module.css';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function pad(n) {
  return String(n).padStart(2, '0');
}

function toISO(y, m, d) {
  return `${y}-${pad(m + 1)}-${pad(d)}`;
}

function parseISO(value) {
  if (!value) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  return { y: Number(match[1]), m: Number(match[2]) - 1, d: Number(match[3]) };
}

function daysInMonth(y, m) {
  return new Date(y, m + 1, 0).getDate();
}

function formatDisplay(value) {
  const parsed = parseISO(value);
  if (!parsed) return '';
  return `${parsed.d} ${MONTHS[parsed.m]} ${parsed.y}`;
}

const TODAY = new Date();
const CURRENT_YEAR = TODAY.getFullYear();

// Calendar-dropdown date picker (day grid + month/year jump) for birthdates
// and other dates where the native OS date input is too fiddly to navigate
// decades back. Value/onChange use plain 'YYYY-MM-DD' strings — a drop-in
// swap for <input type="date">.
export default function DatePicker({
  label,
  value,
  onChange,
  error,
  hint,
  placeholder = 'Select date',
  disableFuture = false,
  minYear = CURRENT_YEAR - 120,
  maxYear = CURRENT_YEAR,
  id,
  className = '',
}) {
  const autoId = useId();
  const fieldId = id || autoId;
  const errorId = error ? `${fieldId}-error` : undefined;
  const hintId = hint && !error ? `${fieldId}-hint` : undefined;

  const selected = parseISO(value);
  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(selected?.y ?? CURRENT_YEAR);
  const [viewMonth, setViewMonth] = useState(selected?.m ?? TODAY.getMonth());
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    function handlePointerDown(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    }
    function handleKeyDown(e) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  function openPicker() {
    const base = selected ?? { y: CURRENT_YEAR, m: TODAY.getMonth() };
    setViewYear(base.y);
    setViewMonth(base.m);
    setOpen(true);
  }

  function pickDay(day) {
    onChange(toISO(viewYear, viewMonth, day));
    setOpen(false);
  }

  function goToMonth(delta) {
    let m = viewMonth + delta;
    let y = viewYear;
    if (m < 0) { m = 11; y -= 1; }
    if (m > 11) { m = 0; y += 1; }
    setViewMonth(m);
    setViewYear(y);
  }

  const leadingBlanks = new Date(viewYear, viewMonth, 1).getDay();
  const totalDays = daysInMonth(viewYear, viewMonth);
  const cells = [
    ...Array(leadingBlanks).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ];
  const isFutureDisabled = (day) => {
    if (!disableFuture) return false;
    const candidate = new Date(viewYear, viewMonth, day);
    candidate.setHours(0, 0, 0, 0);
    const todayMidnight = new Date(TODAY);
    todayMidnight.setHours(0, 0, 0, 0);
    return candidate > todayMidnight;
  };

  const years = [];
  for (let y = maxYear; y >= minYear; y -= 1) years.push(y);

  return (
    <div className={`${styles.wrap} ${className}`} ref={wrapRef}>
      <button
        type="button"
        id={fieldId}
        className={`${styles.field} ${error ? styles.fieldError : ''}`}
        onClick={() => (open ? setOpen(false) : openPicker())}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={errorId || hintId}
      >
        <span className={styles.textCol}>
          {label && <span className={styles.label}>{label}</span>}
          <span className={value ? styles.value : styles.placeholder}>
            {value ? formatDisplay(value) : placeholder}
          </span>
        </span>
        <span className={styles.calIcon} aria-hidden="true"><CalendarDays size={18} /></span>
      </button>

      {error && (
        <span id={errorId} className={styles.message} role="alert">
          {error}
        </span>
      )}
      {!error && hint && (
        <span id={hintId} className={styles.hint}>
          {hint}
        </span>
      )}

      {open && (
        <div className={styles.panel} role="dialog" aria-label="Choose a date">
          <div className={styles.panelHeader}>
            <button type="button" className={styles.navBtn} onClick={() => goToMonth(-1)} aria-label="Previous month">
              <ChevronLeft size={18} />
            </button>
            <div className={styles.jumpRow}>
              <select
                className={styles.jumpSelect}
                value={viewMonth}
                onChange={(e) => setViewMonth(Number(e.target.value))}
                aria-label="Month"
              >
                {MONTHS.map((m, i) => (
                  <option key={m} value={i}>{m}</option>
                ))}
              </select>
              <select
                className={styles.jumpSelect}
                value={viewYear}
                onChange={(e) => setViewYear(Number(e.target.value))}
                aria-label="Year"
              >
                {years.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
            <button type="button" className={styles.navBtn} onClick={() => goToMonth(1)} aria-label="Next month">
              <ChevronRight size={18} />
            </button>
          </div>

          <div className={styles.weekdayRow}>
            {WEEKDAYS.map((w) => (
              <span key={w} className={styles.weekday}>{w}</span>
            ))}
          </div>

          <div className={styles.dayGrid}>
            {cells.map((day, i) => {
              if (day === null) return <span key={`blank-${i}`} className={styles.dayBlank} />;
              const isSelected = selected && selected.y === viewYear && selected.m === viewMonth && selected.d === day;
              const disabled = isFutureDisabled(day);
              return (
                <button
                  key={day}
                  type="button"
                  className={`${styles.day} ${isSelected ? styles.daySelected : ''}`}
                  onClick={() => pickDay(day)}
                  disabled={disabled}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
