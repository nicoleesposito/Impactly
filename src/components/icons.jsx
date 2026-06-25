// Lightweight inline SVG icons (stroke = currentColor unless noted).
// Keeps the 3G performance budget tight — no icon-font dependency.

export function ChevronLeft({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ChevronRight({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ChevronDown({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Check({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12l5 5L20 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Upload({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M12 17v-6m0 0l-2.5 2.5M12 11l2.5 2.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Pencil({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 20h4l10-10a2.83 2.83 0 0 0-4-4L4 16v4z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

export function Close({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function ArrowRight({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function FileText({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M14 3v5h5M9 13h6M9 17h6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CalendarDays({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="5" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M4 9h16M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M8 13h2M14 13h2M8 17h2M14 17h2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export function BarChart({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 20V10M10 20V4M16 20v-8M4 20h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Users({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="9" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M3.5 19a5.5 5.5 0 0 1 11 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M16 5.2a3.2 3.2 0 0 1 0 5.6M17.5 14.2A5.5 5.5 0 0 1 20.5 19" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export function Search({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
      <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function Plus({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// Brand mark — three nodes connected in a triangle (the Impactly logo).
export function BrandMark({ size = 96 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 96 96" fill="none" aria-hidden="true">
      <path d="M37 30a13 13 0 0 1 22 0" stroke="var(--color-primary)" strokeWidth="6" strokeLinecap="round" />
      <path d="M62 40a13 13 0 0 1-11 19" stroke="var(--color-primary)" strokeWidth="6" strokeLinecap="round" />
      <path d="M45 59a13 13 0 0 1-11-19" stroke="var(--color-primary)" strokeWidth="6" strokeLinecap="round" />
      <circle cx="48" cy="24" r="9" stroke="var(--color-primary)" strokeWidth="6" />
      <circle cx="68" cy="58" r="9" stroke="var(--color-primary)" strokeWidth="6" />
      <circle cx="28" cy="58" r="9" stroke="var(--color-primary)" strokeWidth="6" />
    </svg>
  );
}
