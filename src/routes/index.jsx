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

// App — bottom-nav destinations
import Today from '../features/dashboard/pages/Today.jsx';
import AttendanceMulti from '../features/attendance/pages/AttendanceMulti.jsx';
import BeneficiaryList from '../features/beneficiaries/pages/BeneficiaryList.jsx';
import ReportsList from '../features/reports/pages/ReportsList.jsx';
import ScheduledReports from '../features/reports/pages/ScheduledReports.jsx';
import ScheduleReport from '../features/reports/pages/ScheduleReport.jsx';
import More from '../features/more/pages/More.jsx';

// Manage
import FundersList from '../features/funders/pages/FundersList.jsx';
import AddFunder from '../features/funders/pages/AddFunder.jsx';
import GrantsTracker from '../features/grants/pages/GrantsTracker.jsx';
import StaffList from '../features/staff/pages/StaffList.jsx';
import InviteStaff from '../features/staff/pages/InviteStaff.jsx';
import Permissions from '../features/staff/pages/Permissions.jsx';
import Templates from '../features/programmes/pages/Templates.jsx';
import AddProgramme from '../features/programmes/pages/AddProgramme.jsx';
import AddGrant from '../features/grants/pages/AddGrant.jsx';
import AddBeneficiary from '../features/beneficiaries/pages/AddBeneficiary.jsx';
import BeneficiaryProfile from '../features/beneficiaries/pages/BeneficiaryProfile.jsx';

// Settings
import OrganisationSettings from '../features/settings/pages/OrganisationSettings.jsx';
import OrganisationDetails from '../features/settings/pages/OrganisationDetails.jsx';
import Integrations from '../features/settings/pages/Integrations.jsx';
import Billing from '../features/settings/pages/Billing.jsx';
import PersonalSettings from '../features/settings/pages/PersonalSettings.jsx';

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
          { path: '/home',       element: <Today /> },
          { path: '/attendance', element: <AttendanceMulti /> },
          { path: '/students',     element: <BeneficiaryList /> },
          { path: '/students/add', element: <AddBeneficiary /> }, // before /students/:id
          { path: '/students/:id',  element: <BeneficiaryProfile /> },
          { path: '/reports',              element: <ReportsList /> },
          { path: '/reports/scheduled',    element: <ScheduledReports /> },  // before /reports/:id
          { path: '/reports/schedule/new', element: <ScheduleReport /> },    // before /reports/:id
          { path: '/more',       element: <More /> },

          // Manage
          { path: '/funders',        element: <FundersList /> },
          { path: '/funders/add',    element: <AddFunder /> }, // before /funders/:id
          { path: '/grants',         element: <GrantsTracker /> },
          { path: '/grants/add',     element: <AddGrant /> },        // before /grants/:id
          { path: '/staff',             element: <StaffList /> },
          { path: '/staff/invite',      element: <InviteStaff /> },   // before /staff/:id
          { path: '/staff/permissions', element: <Permissions /> },   // before /staff/:id
          { path: '/templates',         element: <Templates /> },
          { path: '/programmes/add',    element: <AddProgramme /> },

          // Settings
          { path: '/settings/organisation',         element: <OrganisationSettings /> },
          { path: '/settings/organisation/details', element: <OrganisationDetails /> },
          { path: '/settings/integrations',         element: <Integrations /> },
          { path: '/settings/billing',              element: <Billing /> },
          { path: '/settings/personal',             element: <PersonalSettings /> },
        ],
      },
    ],
  },

  { path: '*', element: <Navigate to="/home" replace /> },
]);

