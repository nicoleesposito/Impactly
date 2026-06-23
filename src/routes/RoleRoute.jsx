import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { ROUTES } from '../constants/routes.js';

// Restricts a route subtree to specific roles (PRD §12). RLS is the real
// enforcement; this prevents the UI from rendering disallowed screens.
export default function RoleRoute({ allow = [] }) {
  const { role } = useAuth();

  if (role && !allow.includes(role)) {
    return <Navigate to={ROUTES.home} replace />;
  }

  return <Outlet />;
}
