// @ts-check
import { defineConfig, devices } from "@playwright/test";

const BASE_URL = process.env.E2E_BASE_URL || "http://localhost:5173";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [["html", { open: "never" }], ["list"]],
  timeout: 60000,
  expect: { timeout: 15000 },
  // Single worker locally — the Vite dev server (npm run dev) does on-demand
  // compilation and was getting overwhelmed by multiple concurrent browser
  // contexts, causing hydration/font-loading to randomly exceed timeouts.
  // In CI the app is built + served via `vite preview` (static, much
  // faster), so this only slows local runs down, not CI.
  workers: 1,
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    navigationTimeout: 30000,
    actionTimeout: 30000,
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
    { name: "mobile-chrome", use: { ...devices["Pixel 7"] } },
  ],
  // Starts the Vite dev server automatically for local runs; in CI the
  // workflow starts backend + frontend explicitly and points E2E_BASE_URL
  // at them, so this is skipped there.
  webServer: process.env.CI
    ? undefined
    : {
        command: "npm run dev",
        url: BASE_URL,
        reuseExistingServer: true,
        timeout: 30000,
      },
});
