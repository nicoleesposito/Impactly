// Option sets for the onboarding forms (PRD Step 2 / Step 5).

export const ORG_TYPES = [
  'NGO / Non-profit',
  'Non-profit',
  'Educational institution',
  'Community organisation',
  'Faith-based organisation',
  'Other',
];

export const COUNTRIES = [
  'South Africa',
  'Namibia',
  'Botswana',
  'Zimbabwe',
  'Lesotho',
  'Eswatini',
  'Other',
];

export const BENEFICIARY_RANGES = ['1 - 50', '51 - 100', '101 - 250', '251 - 500', '500+'];

// Roles offered when inviting team members (lowest privilege default = Staff).
export const INVITE_ROLES = [
  { value: 'admin', label: 'Admin - Full access' },
  { value: 'manager', label: 'Manager - programmes & reports' },
  { value: 'staff', label: 'Staff - attendance only' },
];
