import { createBrowserRouter, Navigate } from 'react-router-dom';

import AuthLayout from '../layouts/AuthLayout/index.js';
import OnboardingLayout from '../layouts/OnboardingLayout/index.js';
import AppShell from '../layouts/AppShell/index.js';
import ProtectedRoute from './ProtectedRoute.jsx';

// Auth
import SignIn from '../features/auth/pages/SignIn.jsx';
import ForgotPassword from '../features/auth/pages/ForgotPassword.jsx';
import AuthCallback from '../features/auth/pages/AuthCallback.jsx';

// Onboarding
import Step1Account from '../features/onboarding/pages/Step1Account.jsx';
import Step2Organisation from '../features/onboarding/pages/Step2Organisation.jsx';
import Step3Template from '../features/onboarding/pages/Step3Template.jsx';
import Step4Beneficiaries from '../features/onboarding/pages/Step4Beneficiaries.jsx';
import Step5Team from '../features/onboarding/pages/Step5Team.jsx';
import Step6Confirmation from '../features/onboarding/pages/Step6Confirmation.jsx';

// App (bottom-nav destinations wired; deeper screens added in later sections)
import Today from '../features/dashboard/pages/Today.jsx';
import AttendanceMulti from '../features/attendance/pages/AttendanceMulti.jsx';
import BeneficiaryList from '../features/beneficiaries/pages/BeneficiaryList.jsx';
import ReportsList from '../features/reports/pages/ReportsList.jsx';
import More from '../features/more/pages/More.jsx';

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/home" replace /> },

  // Public auth routes
  {
    element: <AuthLayout />,
    children: [
      { path: '/signin', element: <SignIn /> },
      { path: '/forgot-password', element: <ForgotPassword /> },
      { path: '/auth/callback', element: <AuthCallback /> },
    ],
  },

  // Onboarding wizard
  {
    element: <OnboardingLayout />,
    children: [
      { path: '/onboarding/account', element: <Step1Account /> },
      { path: '/onboarding/organisation', element: <Step2Organisation /> },
      { path: '/onboarding/template', element: <Step3Template /> },
      { path: '/onboarding/beneficiaries', element: <Step4Beneficiaries /> },
      { path: '/onboarding/team', element: <Step5Team /> },
      { path: '/onboarding/complete', element: <Step6Confirmation /> },
    ],
  },

  // Authenticated app shell
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppShell />,
        children: [
          { path: '/home', element: <Today /> },
          { path: '/attendance', element: <AttendanceMulti /> },
          { path: '/students', element: <BeneficiaryList /> },
          { path: '/reports', element: <ReportsList /> },
          { path: '/more', element: <More /> },
        ],
      },
    ],
  },

  { path: '*', element: <Navigate to="/home" replace /> },
]);
