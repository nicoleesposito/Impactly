// Centralised route path constants (PRD §9 routes).
export const ROUTES = {
  // Marketing
  productOverview: '/product-overview',

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
  grantProfile: '/grants/:id',
  staff: '/staff',
  staffInvite: '/staff/invite',
  staffPermissions: '/staff/permissions',
  staffProfile: '/staff/:id',
  more: '/more',
  notifications: '/notifications',
  helpFaq: '/help',
  templates: '/templates',
  programmeAdd: '/programmes/add',

  // Settings
  settingsOrganisation: '/settings/organisation',
  settingsOrganisationDetails: '/settings/organisation/details',
  settingsDataImport: '/settings/data-import',
  settingsDataExport: '/settings/data-export',
  settingsPersonal: '/settings/personal',
  settingsIntegrations: '/settings/integrations',
  settingsBilling: '/settings/billing',
};
