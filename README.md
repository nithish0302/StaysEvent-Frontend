# StayEvents — Frontend

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white)
![Playwright](https://img.shields.io/badge/Tested_with-Playwright-2EAD33?logo=playwright&logoColor=white)
![CI](https://img.shields.io/github/actions/workflow/status/nithish0302/StaysEvent-Frontend/frontend-ci.yml?branch=main&label=CI)
[![Live Demo](https://img.shields.io/badge/Live_Demo-stayevents.vercel.app-000000?logo=vercel&logoColor=white)](https://stayevents.vercel.app/)

React 19 + Vite + Tailwind CSS frontend for **StayEvents**, a full-stack hotel & event booking platform with separate customer, vendor, and admin experiences.

**Live demo:** [stayevents.vercel.app](https://stayevents.vercel.app/)
**Backend repo:** [StaysEvent-Backend](https://github.com/nithish0302/StaysEvent-Backend) 
## Table of contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Available scripts](#available-scripts)
- [Testing](#testing)
- [Project structure](#project-structure)
- [Author](#author)

## Features

- Three distinct role-based experiences (customer / vendor / admin) behind a single auth flow, with Google OAuth as an alternate login
- Hotel & event browsing with search, filtering, and detail pages
- Booking flow with Razorpay Checkout, degrading gracefully to a "Pay Later" path if checkout is dismissed
- Vendor dashboard with listing management, a booking-status breakdown, and a 6-month earnings chart
- Vendor KYC flow — ID proof + business document upload, submitted for admin approval
- Admin dashboard for vendor approval, platform stats, and featured-listing management
- Review system with vendor replies
- Toast-based feedback and consistent loading states across write flows
- Accessibility-checked (axe) and responsive across desktop/tablet/mobile breakpoints

## Tech stack

| Layer | Choice |
|---|---|
| Framework | React 19, Vite |
| Routing | React Router v7 |
| State | Zustand |
| Styling | Tailwind CSS, framer-motion |
| Charts | Recharts |
| HTTP | axios |
| Realtime | Socket.IO client |
| Notifications | react-hot-toast |
| Testing | Playwright (Chromium, WebKit, mobile Chrome), @axe-core/playwright |

## Getting started

```bash
git clone https://github.com/nithish0302/StaysEvent-Frontend.git
cd StaysEvent-Frontend
npm install
cp .env.example .env   # fill in real values
npm run dev
```

Runs on `http://localhost:5173`. Requires the [backend](https://github.com/nithish0302/StaysEvent-Backend) running (or a deployed instance pointed to via `VITE_API_URL`) — this repo has no mock backend.

## Environment variables

Full list with explanations lives in [`.env.example`](./.env.example).

| Variable | Purpose |
|---|---|
| `VITE_API_URL` | Backend API base, e.g. `http://localhost:5000/api` |
| `VITE_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name for direct browser uploads |
| `VITE_CLOUDINARY_HOTEL_PRESET` | Unsigned Cloudinary upload preset |

Vite only exposes `VITE_`-prefixed vars to client code and inlines them at **build** time, so they need to be set before `npm run build` runs, not added afterward.

Google login is initiated by redirecting to the backend's `/api/auth/google` route — no Google client ID is needed on the frontend.

## Available scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |
| `npm run test:e2e` | Run the Playwright suite headlessly |
| `npm run test:e2e:ui` | Run Playwright in interactive UI mode |
| `npm run test:e2e:report` | Open the last HTML test report |

## Testing

```bash
npm run test:e2e
```

Requires the backend running locally on port 5000 (Playwright auto-starts the frontend dev server itself, but not the backend). Some tests are admin-gated; run `node scripts/ensureE2EAdmin.js` in the backend repo first so a login-able admin account exists.

Covers: accessibility (serious-violations-only), authentication, home page, hotel/event listings, a vendor flow suite (listing data persistence, dashboard rendering, error-state feedback), and visual regression snapshots. CI runs the full suite against a freshly-provisioned, empty database on every push.

## Project structure

```
frontend/
├── e2e/              # Playwright E2E suite
├── src/
│   ├── api/           # Axios wrappers around the backend REST API
│   ├── components/     # Shared and role-specific UI components
│   ├── config/         # Route path definitions
│   ├── pages/           # Route-level pages, split by role
│   │   ├── customer/
│   │   ├── vendor/
│   │   ├── admin/
│   │   └── auth/
│   ├── router/          # React Router setup
│   └── store/            # Zustand auth/session store
└── vite.config.js
```

## Author

**Nithish** — [GitHub](https://github.com/nithish0302)
