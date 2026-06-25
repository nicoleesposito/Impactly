// Centralised route path constants (PRD §9 routes).
export const ROUTES = {
  // Auth
  signIn: '/signin',
  forgotPassword: '/forgot-password',
  authCallback: '/auth/callback',

  // Onboarding
  onboardingAccount: '/onboarding/account',
  onboardingOrganisation: '/onboarding/organisation',
  onboardingTemplate: '/onboarding/template',
  onboardingBeneficiaries: '/onboarding/beneficiaries',
  onboardingTeam: '/onboarding/team',
  onboardingComplete: '/onboarding/complete',

  // App
  home: '/home',
  attendance: '/attendance',
  attendanceCapture: '/attendance/:programme/:date',
  students: '/students',
  studentProfile: '/students/:id',
  studentAdd: '/students/add',
  reports: '/reports',
  reportBuilder: '/reports/:id',
  reportsScheduled: '/reports/scheduled',
  reportsScheduleNew: '/reports/schedule/new',
  funders: '/funders',
  funderAdd: '/funders/add',
  funderProfile: '/funders/:id',
  grants: '/grants',
  grantAdd: '/grants/add',
  staff: '/staff',
  staffInvite: '/staff/invite',
  staffProfile: '/staff/:id',
  more: '/more',
  templates: '/templates',

  // Settings
  settingsOrganisation: '/settings/organisation',
  settingsUsers: '/settings/users',
  settingsPersonal: '/settings/personal',
  settingsIntegrations: '/settings/integrations',
  settingsBilling: '/settings/billing',
};
