import {
  ClipboardCheck,
  Users,
  FileText,
  CalendarDays,
  UploadCloud,
  UserCog,
  Bell,
} from '../../../components/icons.jsx';

// Full platform capability list shown on the Product overview subpage.
export const CAPABILITIES = [
  {
    Icon: ClipboardCheck,
    title: 'Attendance tracking',
    body: 'Mark present, absent or late in one tap. See your rate for the day at a glance, across every programme you run.',
  },
  {
    Icon: Users,
    title: 'Beneficiary management',
    body: 'Keep every beneficiary’s profile, programme history and status in one place. No more spreadsheets that lock when one person leaves.',
  },
  {
    Icon: FileText,
    title: 'Funder reporting',
    body: 'Build reports for any programme and funder, fill them in as you go, and pick up exactly where you left off.',
  },
  {
    Icon: CalendarDays,
    title: 'Scheduled reports',
    body: 'Automate delivery to funders and your team by email or WhatsApp.',
  },
  {
    Icon: UploadCloud,
    title: 'Data import and export',
    body: 'Bring in an existing spreadsheet, or export everything to CSV at any time.',
  },
  {
    Icon: UserCog,
    title: 'Role-based access',
    body: 'Give staff, managers and admins the right level of access, automatically.',
  },
  {
    Icon: Bell,
    title: 'Notifications',
    body: 'Stay on top of team activity with an in-app notification feed.',
  },
];
