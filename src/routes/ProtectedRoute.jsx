import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { ROUTES } from '../constants/routes.js';

// Gates the authenticated app. Unauthenticated direct access → sign-in (FR-012).
export default function ProtectedRoute() {
  const { session, loading } = useAuth();
  const location = useLocation();

  if (loading) return null; // a splash/skeleton can render here later

  if (!session) {
    return <Navigate to={ROUTES.signIn} replace state={{ from: location }} />;
  }

  return <Outlet />;
}
