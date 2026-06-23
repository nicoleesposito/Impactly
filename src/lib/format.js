// Formatting helpers. South African Rand currency and locale (PRD context).

export function formatCurrency(amount, { currency = 'ZAR', maximumFractionDigits = 0 } = {}) {
  if (amount == null || Number.isNaN(Number(amount))) return '--';
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency,
    maximumFractionDigits,
  }).format(Number(amount));
}

export function formatPercent(value) {
  if (value == null || Number.isNaN(Number(value))) return '--';
  return `${Math.round(Number(value))}%`;
}

// Attendance rate = present / expected * 100 (PRD CALC-001).
export function attendanceRate(present, expected) {
  if (!expected) return '--';
  return formatPercent((present / expected) * 100);
}
