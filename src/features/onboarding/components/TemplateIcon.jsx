// Per-template line icons, coloured to match the Figma frames.
const COLORS = {
  scratch: '#5aa02f',
  literacy: '#e8804f',
  digital: 'var(--programme-digital)',
  ecd: '#4a4a4a',
  youth: 'var(--programme-youth)',
};

export default function TemplateIcon({ id, size = 28 }) {
  const color = COLORS[id] || 'var(--color-text)';
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: color,
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  };

  switch (id) {
    case 'scratch': // magic wand
      return (
        <svg {...common}>
          <path d="M15 6l3 3L9 18l-3 1 1-3 8-10z" />
          <path d="M18 3l.7 1.3L20 5l-1.3.7L18 7l-.7-1.3L16 5l1.3-.7L18 3z" />
        </svg>
      );
    case 'literacy': // open book
      return (
        <svg {...common}>
          <path d="M12 6c-1.5-1-4-1.5-6-1v12c2-.5 4.5 0 6 1 1.5-1 4-1.5 6-1V5c-2-.5-4.5 0-6 1z" />
          <path d="M12 6v13" />
        </svg>
      );
    case 'digital': // chip
      return (
        <svg {...common}>
          <rect x="7" y="7" width="10" height="10" rx="1.5" />
          <rect x="10" y="10" width="4" height="4" rx="0.5" />
          <path d="M10 4v3M14 4v3M10 17v3M14 17v3M4 10h3M4 14h3M17 10h3M17 14h3" />
        </svg>
      );
    case 'ecd': // smiley
      return (
        <svg {...common}>
          <rect x="4" y="4" width="16" height="16" rx="4" />
          <circle cx="9" cy="10" r="0.6" fill={color} stroke="none" />
          <circle cx="15" cy="10" r="0.6" fill={color} stroke="none" />
          <path d="M9 14c.8.8 2 1.2 3 1.2s2.2-.4 3-1.2" />
        </svg>
      );
    case 'youth': // person in hexagon
      return (
        <svg {...common}>
          <path d="M12 3l7 4v8l-7 4-7-4V7l7-4z" />
          <circle cx="12" cy="10.5" r="2" />
          <path d="M8.5 16c.7-1.8 2-2.5 3.5-2.5s2.8.7 3.5 2.5" />
        </svg>
      );
    default:
      return <svg {...common} />;
  }
}
