# Impactly

A mobile-first platform for NGOs and non-profits to track beneficiary attendance, manage grants, and schedule reports—all in one place.

## Problem

NGOs juggle spreadsheets, emails, and fragmented tools to track who's attending programs, which grants are due, and what reports need sending. This creates delays, data loss, and manual overhead that distracts from mission work.

## Solution

Impactly consolidates attendance tracking, beneficiary management, grant monitoring, and report scheduling into a single mobile-optimized app. Staff mark attendance in seconds. Managers track funding deadlines. Admins manage users and integrations. Everyone exports data on demand.

## Target Users

- **NGO Staff & Volunteers** — Record daily attendance, update student profiles, view their team
- **Programme Managers** — Track programmes, manage grants and funders, schedule reports
- **Admin/Directors** — Manage org settings, user roles, integrations, and billing

## Platform Core Journey

### 1. Sign Up
Account creation with email/password via Supabase Auth

### 2. Onboarding (6 Steps)
- Account details (name, email)
- Organisation setup (name, type, country)
- Programme template selection
- Beneficiary import (CSV or manual entry)
- Team invite (add staff members)
- Confirmation

### 3. Daily Use
- **Capture attendance** on the Attendance tab with instant rate tracking
- **View the Today dashboard** for quick programme and beneficiary overview
- **Track beneficiaries** on the Students tab, filter by programme

### 4. Reporting
- Create reports from templates (Attendance, Impact summary, Progress, Financial, Custom)
- View and edit report sections
- Schedule automated delivery via email or WhatsApp

### 5. Funding Management
- Track funders and donors with contact details
- Link them to grants and funding amounts
- Monitor grant deadlines and application status
- Export funder data for external reporting

### 6. Settings & Team
- Manage staff roles and permissions (Admin, Manager, Staff)
- Update organisation details (logo, country, integrations)
- Import/export data as CSV

**Continuous Improvement & Better Impact** — All features feed back into better data, faster decisions, and measurable programme outcomes.

## What's Working (MVP)

### Authentication & Onboarding
- Email-based sign-in with Supabase Auth
- 6-step org setup wizard (account → org details → templates → beneficiaries → team → confirmation)
- Role-based access control (Admin / Manager / Staff)

### Core Features
- **Attendance** — Multi-programme capture with rate tracking, modular workflows, and mark-all actions
- **Beneficiaries** — Add/edit students with demographics, status, linked programmes
- **Grants** — Tracker with status badges, progress bars, inline editing, and deadline alerts
- **Funders** — Full profiles with contact details, funding history, and linked grants
- **Staff** — Team roster with roles, programme assignments, and invite system
- **Reports** — Library with builder, viewer, and scheduled report delivery (email/WhatsApp/download)
- **Notifications** — Activity feed showing team actions with unread badge

### Admin & Settings
- Organisation details (name, logo, country, VAT)
- Data import (CSV upload for beneficiaries, funders, grants)
- Data export (CSV download of all org data)
- Integrations & billing (Supabase-backed; billing UI in place)
- Team permissions management

### Design & UX
- **Mobile-first bottom navigation** with elevated Attendance FAB
- **Responsive web** (desktop sidebar, mobile bottom nav)
- **Dark mode toggle**
- **Programme filter** persistent across all screens
- **Role-based UI** — Staff see simplified views; irrelevant features hidden
- **Inline editing** for profiles, funders, grants
- **Avatar color-coding** for quick recognition
- **Status colors** for attendance and entity states

## Key Design Decisions

- **Mobile-first with elevated attendance FAB** — Daily check-ins are the most frequent action
- **Role-based UI filtering** — No disabled menu items; irrelevant features disappear entirely for staff/volunteers
- **Persistent programme filter** — All data scoped to selected programme to reduce noise
- **Avatar color-coding** — Consistent colors per person help users recognize colleagues at a glance
- **Inline editing** — Edit profiles, funders, and grants without leaving the page
- **Card-based scannable layouts** — Clear interaction targets without extra labels
- **Notifications with unread badge** — Mirrors modern app patterns
- **Scheduled reports grouped by urgency** — "Sending this week" vs. "Recurring schedules"
- **Status colors** — Quick visual scan using color psychology
- **CSV import/export for all roles** — Data portability as a core feature, not admin-only

## What's Tested

- **Manual testing** of core workflows:
  - Attendance marking across multiple programmes
  - Grant creation, editing, filtering by status
  - Funder profile CRUD with linked grants
  - Staff invitations and role assignments
  - Report scheduling and CSV export
  - Role-based UI visibility (staff vs. manager vs. admin)
  - Notifications page and unread badge behavior
- **Browser compatibility** — Chrome, Safari, Firefox (mobile & desktop)
- **Responsive design** — iPhone SE to iPad widths
- **Dark mode** — Theme toggle across all screens
- **Error handling** — Network failures, file upload validation, form errors

## What's Production-Ready

✅ Authentication & onboarding  
✅ Multi-programme attendance tracking  
✅ Beneficiary, grant, and funder management  
✅ Staff invitations and role-based access control  
✅ Report library and scheduling  
✅ CSV import/export  
✅ Notifications  
✅ Dark mode  
✅ Mobile-responsive UI  
✅ Supabase integration (auth, database, RLS policies)  

## What Remains (Post-MVP)

- **Live integrations** — WhatsApp/email report delivery (UI scaffolded, delivery logic pending external APIs)
- **Integrations hub** — Third-party apps (Slack, Google Drive, etc.)
- **Advanced reporting** — Custom report builder with charts and filters
- **Bulk actions** — Batch mark attendance across classes
- **Mobile app** — Native iOS/Android (currently web-only)
- **Offline sync** — Work without internet; sync when reconnected
- **Analytics dashboard** — Org-wide metrics and trends
- **Audit logs** — Track who changed what and when
- **Team collaboration** — Comments, @mentions, activity feeds per beneficiary/grant

## Tech Stack

- **Frontend** — React 18, React Router v6, CSS Modules with design tokens, Vite
- **Backend** — Supabase (Auth, Postgres, RLS, Storage)
- **Icons** — Inline SVG (no icon font)
- **Deployment** — Netlify

## Getting Started

```bash
# Install dependencies
npm install

# Create .env.local with Supabase keys
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_key

# Start dev server
npm run dev

# Build for production
npm run build
```

## Contributing

This project is under active development. Issues and PRs welcome.
