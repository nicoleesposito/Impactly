# Impactly

A mobile-first impact management platform for NGO staff (Tebelo Tech Hub) — attendance capture, beneficiary management, funder reporting, and grant tracking in a single system.

> This commit establishes the **project file structure / scaffold** only. Individual feature screens are stubs to be built out in subsequent sections.

## Tech stack

| Concern | Choice |
|---|---|
| Build / routing | Vite + React Router |
| Language | JavaScript + JSX (PRD C-001) |
| Styling | CSS Modules + design tokens (`src/styles/tokens.css`) |
| Backend | Supabase — Postgres, Auth (email/password + Google OAuth), Storage, RLS |

PRD references: §11.3 names Supabase for the build; §17.7 names the Vite setup.

## Getting started

```bash
npm install
cp .env.example .env   # add your Supabase URL + anon key
npm run dev
```

## Project structure

```
src/
├── main.jsx · App.jsx          # entry + provider/router composition
├── routes/                     # router tree + ProtectedRoute + RoleRoute (RBAC)
├── layouts/                    # AppShell (sidebar ⇄ bottom nav), Auth, Onboarding
├── features/                   # feature-first: each owns pages/ components/ api/
│   ├── auth · onboarding · dashboard · attendance · beneficiaries
│   ├── reports · funders · grants · staff · notifications
│   └── programmes · settings · more
├── components/                 # shared: ui/ · ProgrammePills/ · charts/ · feedback/
├── context/                    # Auth · ProgrammeFilter · Theme · Org (global state)
├── hooks/ · lib/ · services/   # shared hooks, Supabase client, csv/pdf/format helpers
├── constants/                  # roles, routes, templates, programme colours
└── styles/                     # tokens · theme (dark) · reset · global

supabase/
├── migrations/                 # schema + RLS policies (server-side RBAC)
└── seed.sql                    # Tebelo demo data
```

## Conventions

- **Feature-first.** A screen and its Supabase data access live together under `src/features/<feature>/`.
- **Co-located CSS Modules.** Components are `Name.jsx` + `Name.module.css` + `index.js`, consuming variables from `tokens.css`. Dark mode is a single `[data-theme="dark"]` swap.
- **RBAC in two layers.** `RoleRoute` gates the UI; Supabase **RLS** is the real server-side enforcement (PRD §17.5).
- **Global concerns in `context/`.** Session/role, the persistent programme pill filter (FR-014), theme, and the org beneficiary label (BR-006).
