import { test, expect } from "@playwright/test";

// Visual regression baselines. First run on a fresh checkout creates the
// baseline screenshots under e2e/visual.spec.js-snapshots/ — commit those,
// then future runs diff against them and fail on unexpected layout changes.
// Update intentional changes with: npx playwright test --update-snapshots
//
// CI-skipped: Playwright's screenshot baselines are per-OS (the files are
// literally suffixed -win32/-linux/etc.), so baselines captured locally on
// Windows never match GitHub Actions' Linux runners, and there's no way to
// generate correct Linux baselines from a Windows machine. Re-generating
// them from CI itself just means every legitimate UI change requires a
// manual baseline-approval loop through Actions logs — high maintenance for
// a portfolio project. Kept as a local-only sanity check instead; run
// `npx playwright test e2e/visual.spec.js` on your own machine when you want
// a layout regression check, and `--update-snapshots` after an intentional
// design change.
test.describe("Visual regression", () => {
  test.skip(
    !!process.env.CI,
    "Screenshot baselines are OS-specific and only maintained locally — see comment above.",
  );

  test("home page layout", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    // Not networkidle: the app keeps a socket.io connection open, so
    // networkidle would never resolve. Wait for real page content instead.
    await page.getByText("Find your perfect").waitFor();

    // The Featured Hotels / Upcoming Events sections show live data from
    // getAllHotels/getAllEvents. They start in a loading (spinner) state and
    // swap to real cards once the fetch resolves — screenshotting mid-swap
    // is a race. Worse, that data keeps growing over time (e.g. the E2E
    // suite itself creates a new event in vendor.spec.js's pinCode test on
    // every run), so even a perfectly-timed screenshot would never stay in
    // sync with a fixed baseline. Wait for both to finish loading, then mask
    // both sections out of the pixel comparison entirely — the rest of the
    // page (hero, stats strip, CTA) is genuinely static and worth diffing.
    const hotelsSection = page.getByTestId("home-hotels-section");
    const eventsSection = page.getByTestId("home-events-section");
    await expect(hotelsSection.locator(".animate-spin")).toHaveCount(0, {
      timeout: 15000,
    });
    await expect(eventsSection.locator(".animate-spin")).toHaveCount(0, {
      timeout: 15000,
    });

    await expect(page).toHaveScreenshot("home-page.png", {
      fullPage: true,
      maxDiffPixelRatio: 0.02,
      mask: [hotelsSection, eventsSection],
    });
  });

  test("login page layout", async ({ page }) => {
    await page.goto("/login", { waitUntil: "domcontentloaded" });
    await page.getByTestId("login-submit").waitFor();
    // The form panel slides in via framer-motion (transform/opacity driven
    // by JS, transition duration 0.5s) — Playwright's built-in "disable CSS
    // animations" only patches actual CSS animations/transitions, so it
    // doesn't freeze this. Without waiting it out, the screenshot can land
    // mid-slide and never match a baseline captured at a different point in
    // the animation.
    await page.waitForTimeout(700);
    await expect(page).toHaveScreenshot("login-page.png", {
      fullPage: true,
      maxDiffPixelRatio: 0.02,
    });
  });
});
