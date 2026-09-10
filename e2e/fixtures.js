// Shared E2E helpers: generate a unique test user per run so repeated CI
// runs never collide on "email already exists".
export const uniqueEmail = (label = "user") =>
  `${label}-${Date.now()}-${Math.floor(Math.random() * 100000)}@e2e-test.com`;

// Credentials for the fixed admin account bootstrapped before the suite
// runs (backend/scripts/ensureE2EAdmin.js, wired into
// .github/workflows/frontend-ci.yml). Locally, run that script yourself
// against your dev DB before running admin-dependent tests, or override
// these via env vars to match an admin account you already have.
export const E2E_ADMIN = {
  email: process.env.E2E_ADMIN_EMAIL || "e2e-admin@stayevents-demo.test",
  password: process.env.E2E_ADMIN_PASSWORD || "E2eAdmin@1234",
};

// Backend REST API base — separate from E2E_BASE_URL (the frontend origin)
// since a few setup/assertion steps (admin approval, verifying data actually
// persisted) go straight through the API rather than clicking through the UI.
export const API_BASE_URL = process.env.E2E_API_URL || "http://localhost:5000/api";
