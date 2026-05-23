# Europa Jobs — European Job Portal

A multilingual, GDPR-compliant job portal targeting European markets. Built with
**Laravel 12 · React 19 · Inertia.js · TailwindCSS v4 · SQLite** for local dev.

> **Phase status:** Phase 1 (Project Setup & Architecture) + Phase 2 (Authentication & User Roles) complete.

## Stack

| Layer       | Tech                                                                                  |
|-------------|---------------------------------------------------------------------------------------|
| Backend     | PHP 8.3, Laravel 12, Sanctum, `spatie/laravel-permission`, Cashier (installed), Scout |
| Frontend    | React 19, Inertia.js v2, TailwindCSS v4, TanStack Query, Zustand, react-hook-form     |
| i18n        | react-i18next with 8 EU locales (en, fr, de, es, it, nl, pl, pt) — 16 more in Phase 8 |
| Database    | SQLite (`database/database.sqlite`) — swap for MySQL/Postgres in production           |
| Quality     | Pint (PSR-12), Larastan (level 6), ESLint, Prettier, PHPUnit, Vitest                  |
| Future prep | Cashier-Stripe, Scout (Meilisearch), Sentry, TipTap — installed but unused until later|

## Local development (Windows / PowerShell)

### Prerequisites

- PHP 8.3+ (Laragon recommended on Windows)
- Composer 2.x
- Node.js 22+
- Git

### One-time setup

```powershell
composer install
npm install --ignore-scripts
copy .env.example .env
php artisan key:generate
New-Item -ItemType File -Force database\database.sqlite | Out-Null
php artisan migrate --seed
```

> `--ignore-scripts` avoids a Windows-specific issue where `esbuild`'s
> postinstall validation fails when the project path contains spaces.

### Run the app

Two terminals:

```powershell
# Terminal 1 — Laravel dev server
php artisan serve

# Terminal 2 — Vite dev server (HMR)
npm run dev
```

Visit http://localhost:8000.

> **Windows styling note:** Some corporate Application Control policies block
> Tailwind's native scanner. The project auto-generates CSS class sources before
> `npm run dev` / `npm run build` via `scripts/generate-tailwind-sources.mjs`.
> If the page looks unstyled, stop Vite, run `npm run dev` again, then hard-refresh
> the browser (Ctrl+Shift+R).

### Run tests

```powershell
# Backend
php artisan test

# Frontend
npm test

# Lint / static analysis
vendor\bin\pint --test
vendor\bin\phpstan analyse
npm run lint
```

## Project structure

```
app/
  Actions/           Single-purpose service classes (DeleteAccountAction, …)
  Enums/             UserRole, …
  Http/
    Controllers/     Auth + role-namespaced (Seeker, Employer, Admin)
    Middleware/      EnsureRole, HandleInertiaRequests
    Requests/        Form Requests for validation
  Models/            User, SeekerProfile, EmployerProfile
database/
  database.sqlite    Local DB (gitignored)
  migrations/        Schema
  seeders/           RoleSeeder, AdminUserSeeder
resources/
  css/app.css        Tailwind v4 entry with @theme tokens
  js/
    Pages/           Inertia page components (Auth, Seeker, Employer, Admin, Public)
    Layouts/         GuestLayout, AppLayout
    Components/
      ui/            Button, Input, Card, Alert, Avatar, …
      layout/        TopNav, SiteFooter
    lib/             i18n, utils (cn), enums
    locales/         8 EU language JSON files
tests/
  Feature/           Laravel feature tests
  js/                Vitest component tests
.cursorrules         Stack rules read by Cursor
```

## What's NOT in this phase

- Job model / search / applications (Phase 3)
- Resume builder + TipTap (Phase 4)
- Stripe billing (Phase 5)
- Messaging + Reverb + Horizon (Phase 6 — Horizon needs Linux)
- Full admin dashboard (Phase 7)
- 16 remaining locales + cookie banner + VAT (Phase 8)
- Cloudflare R2 storage (later) — files use local `public` disk for now
- Docker (skipped given SQLite + Windows-friendly local dev)

## Default test accounts (seeded)

| Role        | Email                       | Password   |
|-------------|-----------------------------|------------|
| Admin       | `admin@europa.jobs`         | `password` |
| Employer    | `employer@example.com`      | `password` |
| Job seeker  | `seeker@example.com`        | `password` |

Emails go to `storage/logs/laravel.log` (MAIL_MAILER=log).

## License

Proprietary — all rights reserved.
