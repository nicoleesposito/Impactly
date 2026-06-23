// System roles (PRD §4.3) and the capability map (PRD §12 permissions matrix).
// UI gating reads from here; the real enforcement is Supabase RLS (PRD §17.5).

export const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  STAFF: 'staff',
};

export const ROLE_LABELS = {
  [ROLES.ADMIN]: 'Admin — Full access',
  [ROLES.MANAGER]: 'Manager — programmes & reports',
  [ROLES.STAFF]: 'Staff — attendance only',
};

// Coarse capability map. Programme-scoped checks (Manager/Staff assigned
// programmes) are additionally enforced server-side via RLS.
export const CAPABILITIES = {
  viewDashboard: [ROLES.ADMIN, ROLES.MANAGER, ROLES.STAFF],
  captureAttendance: [ROLES.ADMIN, ROLES.MANAGER, ROLES.STAFF],
  viewBeneficiaries: [ROLES.ADMIN, ROLES.MANAGER],
  editBeneficiaries: [ROLES.ADMIN, ROLES.MANAGER],
  deleteBeneficiary: [ROLES.ADMIN],
  viewReports: [ROLES.ADMIN, ROLES.MANAGER],
  editReports: [ROLES.ADMIN, ROLES.MANAGER],
  viewFunders: [ROLES.ADMIN],
  viewGrants: [ROLES.ADMIN],
  viewStaff: [ROLES.ADMIN],
  manageRoles: [ROLES.ADMIN],
  editOrgSettings: [ROLES.ADMIN],
  manageBilling: [ROLES.ADMIN],
  dataExport: [ROLES.ADMIN],
};

export function can(role, capability) {
  return Boolean(CAPABILITIES[capability]?.includes(role));
}
