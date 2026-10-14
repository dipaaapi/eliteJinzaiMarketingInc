# Elite Jinzai Marketing — Staff Portal

A web portal for **Elite Jinzai Marketing Services Inc.**, Unit 4th flr., Cypress Gardens, 112 V.A. Rufino St., Legazpi Village, Makati.

> **Status: early prototype.** The portal has a working demo login and the page layout. Transaction recording, real accounts and a database are not built yet. See the [Roadmap](#roadmap).

## Purpose

*Jinzai* (人材) is Japanese for "human resources". Elite Jinzai Marketing places staff such as **promodisers and merchandisers** in partner retail stores. This portal gives those field staff and the office one place to work:

- **Field staff** sign in, select the **store** they are assigned to, enter their **PS code** and record the day's **transactions** (sales and stock activity).
- **The office** sees those records by store, by staff member and by date, without collecting paper forms or chat messages.

The original 2020 draft had a branded login page and an unfinished "Store Code / PS Code / Transaction" screen ([src/login.jsx](src/login.jsx)). This project continues from that draft.

## What works today

| Page | Path | What it does |
| --- | --- | --- |
| Home | `/` | Service-cycle infographic, about (since 2010), services, how we work, why choose us, mission & vision, team photos, careers, accreditations, contact |
| Account | `/account` | One page: **Log in / Register** tabs when signed out; **profile, password, language and theme** when signed in. `/login`, `/register` and `/settings` redirect here |
| Dashboard | `/dashboard` | Role-based overview: hiring pipeline and to-dos (recruiters), application and time clock (applicants), requests and on-duty staff (clients) |
| Portal pages | `/jobs`, `/applications`, `/requests`, `/deployments` | See **Portal: what each user can do** below |

- **English and Japanese (日本語)** on every page. English is the default, and each visitor's choice is remembered.
- **Theme: System, Light or Dark** on every page. System follows the device and switches live; each visitor's choice is remembered.
- Dashboard and Settings require sign-in; signed-out visitors are sent to Log in.

> ⚠️ **Prototype accounts are stored in the browser only** (`src/auth/authService.js`). Passwords are hashed, but the data stays on one device and the demo admin password is visible in the site's code. Don't use real passwords. Replacing `authService.js` with calls to a real backend API is the next step; the pages won't need to change.

## Portal: what each user can do

The portal turns the company's services into day-to-day tools. Data is stored in the browser for now (`src/data/db.js`), behind one module that a backend API can replace.

| Company service | Recruiters (admin) | Applicants / employees | Clients (brands, retailers) |
| --- | --- | --- | --- |
| Recruitment & talent sourcing | Post, edit, close and reopen job openings (`/jobs`) | Browse openings by category and apply in one click | — |
| Pre-employment screening | Move applicants Applied → Screening → Interview → Hired; verify resume, IDs, NBI and barangay clearance. **Hiring is blocked until required documents are verified** (`/applications`) | Track each application step and see which documents to bring | — |
| Industry-specific, bulk & seasonal hiring | Work client requests, turn them into job postings, set status (`/requests`) | — | Request staff per store, role, headcount and start date; see how many are deployed |
| Local placement & field supervision | Deploy hires to client stores, log field supervisor visits, end deployments (`/deployments`) | See their store assignment | See staff deployed to their stores and supervisor visits |
| Payroll, timekeeping & benefits | See hours worked this month; track SSS, PhilHealth and Pag-IBIG enrolment | Clock in and out; see hours and benefit status | See who is on duty today |

Each dashboard shows the figures and next steps for that role, together with the part of the company mission it serves. Registration offers **Applicant** or **Client** accounts; the admin account comes from `.env`. Three starter job openings (from the roles on elitejinzai.com) are added on first run.

## Help, guides and demo data

- **Public Help & FAQ** (`/help`, linked in the header and footer): quick-start steps for job seekers and for client companies, and a searchable FAQ based on the official FAQ on elitejinzai.com, plus questions about using this website.
- **Portal Guide & FAQ** (`/guide`, in every role's sidebar): a step-by-step guide for the signed-in role (recruiters can open all three), a glossary of every status, and portal questions such as "Why is Move to Hired greyed out?".
- Help texts live in `src/help/content.en.js` and `content.ja.js`; a test fails if the two languages get out of sync.
- **Demo data:** set `VITE_DEMO_DATA=true` in `.env` to fill the portal with fake data on first start, or use **Demo data → Load** on the recruiter dashboard. It creates 5 fictional client companies, 32 applicants, 9 jobs, applications at every stage, client requests, deployments and two weeks of attendance. All demo accounts use the password `demo1234` and `@example.com` emails (for example `demo.kaito` is a client). **Remove demo data** deletes only demo records. Turn this off before real use.

## Tech stack

| Area | Tool |
| --- | --- |
| UI | React 19 + React Router 7 |
| Build / dev server | Vite 8 |
| Tests | Vitest + React Testing Library + jsdom |
| Linting | ESLint 9 (flat config) |
| Container | Docker: Node 24 build → nginx static server |

Requires **Node.js 20.19 or newer** (Node 24 recommended) for local development.

## Getting started

### 1. Configure `.env`

Copy the template, then edit the values:

```bash
cp .env.example .env
```

| Variable | Purpose | Default |
| --- | --- | --- |
| `VITE_COMPANY_NAME` | Company name on the login page | Elite Jinzai Marketing Services Inc. |
| `VITE_COMPANY_SHORT_NAME` | Name in the top menu | Elite Jinzai |
| `VITE_COMPANY_ADDRESS` | Office address (English) | Makati office address |
| `VITE_COMPANY_ADDRESS_JA` | Office address shown in Japanese mode | Japanese address |
| `VITE_COMPANY_PHONES` | Comma-separated phone numbers | Both office numbers |
| `VITE_FACEBOOK_URL` | Recruitment Facebook page | facebook.com/recruitELITE |
| `VITE_DEMO_USER` | Demo login username | admin |
| `VITE_DEMO_PASS` | Demo login password | admin123 |
| `VITE_DEFAULT_LANGUAGE` | Default language: `en` (English) or `ja` (Japanese) | en |
| `VITE_DEMO_DATA` | `true` loads fake demo data on first start | false |
| `VITE_DEFAULT_THEME` | Default theme: `system`, `light` or `dark` | system |
| `VITE_SESSION_KEY` | Browser storage key for the signed-in user | ej-user |
| `WEB_PORT` | Docker port: `http://localhost:<WEB_PORT>` | 3000 |

`.env` is git-ignored; `.env.example` is the template that gets committed. All `VITE_*` values are public in the built site, so never put real secrets in them.

### 2a. Run with Docker (recommended)

```bash
docker compose up -d --build   # build and start → http://localhost:3000
docker compose down            # stop
```

Settings are built into the site, so **rebuild after you change `.env`** (`docker compose up -d --build`).

### 2b. Run locally

```bash
npm install
npm run dev        # dev server with hot reload → http://localhost:3000
```

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm test` | Run the tests once |
| `npm run test:watch` | Re-run tests when files change |
| `npm run lint` | Check the code with ESLint |

## Project structure

```text
index.html              Entry page (title, icons, social share tags)
nginx.conf              Serves the app in Docker; sends every path to index.html for page routing
src/
  main.jsx              Starts React with the router, language and auth providers
  App.jsx               Route list
  config.js             Reads settings from .env
  pages/                HomePage, AccountPage, DashboardPage, NotFoundPage
  pages/portal/         JobsPage, ApplicationsPage, RequestsPage, DeploymentsPage
  data/db.js            Browser data store (jobs, applications, requests, deployments, attendance)
  portal/constants.js   Stages, document requirements, benefits, roles
  components/           Layouts, Logo, Icons, HeroInfographic, ProcessInfographic, ScrollManager, ScrollTopButton
  auth/                 authService.js (accounts), AuthProvider.jsx (session + route guard)
  i18n/                 en.js, ja.js, language provider and switcher
  theme/                Theme provider and switcher (system / light / dark)
  App.test.jsx          Tests
public/
  logo.svg, favicon.ico, logo192.png, logo512.png, apple-touch-icon.png   App icons (logo symbol)
  images/               Official logo files, hero illustration, infographics, social share image
```

## Brand assets

| File | Use |
| --- | --- |
| `public/images/logo.svg` / `.png` | **Official logo** (purple bars, grey frame, black text), redrawn as a sharp vector from `logo-original.png` |
| `public/images/logo-light.svg` / `.png` | Same logo with white text, for dark backgrounds |
| `public/images/logo-mark.svg` | Logo symbol only (bars and frame) |
| `public/images/logo-original.png` | The original low-resolution logo, kept for reference |
| `public/logo.svg`, `favicon.ico`, `logo192.png`, `logo512.png`, `apple-touch-icon.png` | App and browser-tab icons made from the logo symbol |
| `public/images/company/` | Team photos, services photo, PALSCON and PMAP logos from elitejinzai.com, resized to WebP/PNG for the web |
| `public/images/how-we-work.svg` | Recruit → Train → Deploy → Report infographic |
| `public/images/mission-vision.svg` | Mission, vision and values infographic (1200×630) |
| `public/images/og-image.svg` / `.png` | Image shown when the site link is shared |

The home page hero is a live infographic (`src/components/HeroInfographic.jsx`), so its text follows the language and theme. In the app, the logo is drawn by `src/components/Logo.jsx`. Its text follows the theme colour, so it turns white in dark mode.

## Company information

Content comes from the official website **https://www.elitejinzai.com/** (checked October 2026): history, mission, vision, services, team departments, founder, careers, accreditations (PALSCON, PMAP, DOLE D.O. 174), phone numbers and opening hours. The workforce size (101–1,000) is from the company's [JobStreet profile](https://ph.jobstreet.com/companies/elite-jinzai-marketing-services-inc-168556880840142). All texts are in `src/i18n/en.js` and `ja.js`; the Japanese is a translation and should be reviewed by a native speaker.

## Languages

All on-screen text lives in `src/i18n/en.js` and `src/i18n/ja.js`. When you add text to a page:

1. Add a key with the English text to `en.js` and the same key with the Japanese text to `ja.js`.
2. In the component, use `const { t } = useI18n();` and show it with `t("your.key")`.

A missing Japanese entry falls back to English, so the page never breaks. To add another language, create a new dictionary file and register it in `src/i18n/index.jsx`.

## Roadmap

1. **Rebrand.** Replace the placeholder pages with real company content.
2. **Real accounts.** Add a backend API and database with hashed passwords, then remove the demo login.
3. **Transaction entry.** Turn the legacy `login.jsx` draft into a working form for store, PS code, items, amounts and timestamp.
4. **Office view.** List, filter and export records by store, staff member and date.
5. **Roles.** Separate permissions for field staff and office admins.

## History

Started on 2020-02-04 as a Create React App project and left unfinished. In 2026 it was moved to Vite, React 19 and Vitest, and a Docker setup was added.

**Security note:** an SSH private key was committed in `87a5bee` and is still in the git history. If that key was ever used, revoke it and create a new one.
