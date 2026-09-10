# StayEvents — Frontend

React 19 + Vite + Tailwind CSS frontend for the StayEvents hotel & event booking platform.

## Setup

```bash
cd frontend
npm install
```

Create a `.env` with:

```
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=...
```

Run the dev server:

```bash
npm run dev
```

## Roles

- **Customer** — browse hotels/events, book, pay (Razorpay), view bookings, leave reviews, manage profile.
- **Vendor** — manage listings (hotels/events), view/manage bookings, respond to reviews, view booking stats.
- **Admin** — approve/suspend vendors, view platform stats, moderate reviews, manage featured listings.

## Structure

- `src/pages/` — route-level pages, split by role (`customer/`, `vendor/`, `admin/`, `account/`)
- `src/components/` — shared and role-specific UI components
- `src/api/` — thin wrappers around the backend REST API (axios)
- `src/store/authStore.js` — Zustand auth/session store
- `src/config/routes.js` — centralized route path definitions

## Notes

- Booking payments go through Razorpay Checkout; the flow degrades gracefully to a "Pay Later" path if the checkout is dismissed or fails.
- The customer "leave a review" prompt and the vendor "new booking" badge are both polling-based (every 45s / 30s respectively) against lightweight count/list endpoints.
