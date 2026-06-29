import { useAuth } from '../context/AuthContext.jsx';

export function useRole() {
  const { role } = useAuth();
  const r = (role ?? '').toLowerCase();
  const isAdmin   = r === 'admin';
  const isManager = r === 'manager';
  const isStaff   = !isAdmin && !isManager; // staff / volunteer / intern / unset

  return {
    role: r,
    isAdmin,
    isManager,
    isStaff,
    canEditFunders:    isAdmin || isManager,
    canEditGrants:     isAdmin || isManager,
    canViewPermissions: isAdmin || isManager,
    canManageOrg:      isAdmin,   // org details, integrations, templates
  };
}
