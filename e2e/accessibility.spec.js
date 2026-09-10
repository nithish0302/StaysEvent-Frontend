import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// Accessibility scans via axe-core. Flags WCAG A/AA violations (missing
// alt text, insufficient contrast, unlabeled form fields, etc). Serious/
// critical violations fail the test; moderate/minor ones are reported in
// the HTML report only, so the suite doesn't become impossibly strict
// overnight on an app that hasn't had an a11y pass yet.

const seriousOrWorse = (violations) =>
  violations.filter((v) => v.impact === "serious" || v.impact === "critical");

// The auth pages (and some home page elements) fade in via framer-motion
// (opacity 0 -> 1 over ~0.5s). If axe scans mid-animation, elements with
// opacity near 0 report near-invisible/blended foreground colors, which
// axe misreports as color-contrast violations even though the final
// rendered state is fine. Wait for the transition to settle before
// scanning.
const settleAnimations = (page) => page.waitForTimeout(800);

test.describe("Accessibility", () => {
  test("home page has no serious a11y violations", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await settleAnimations(page);
    const results = await new AxeBuilder({ page }).analyze();
    expect(seriousOrWorse(results.violations), JSON.stringify(results.violations, null, 2)).toEqual([]);
  });

  test("login page has no serious a11y violations", async ({ page }) => {
    await page.goto("/login", { waitUntil: "domcontentloaded" });
    await settleAnimations(page);
    const results = await new AxeBuilder({ page }).analyze();
    expect(seriousOrWorse(results.violations), JSON.stringify(results.violations, null, 2)).toEqual([]);
  });

  test("register page has no serious a11y violations", async ({ page }) => {
    await page.goto("/register", { waitUntil: "domcontentloaded" });
    await settleAnimations(page);
    const results = await new AxeBuilder({ page }).analyze();
    expect(seriousOrWorse(results.violations), JSON.stringify(results.violations, null, 2)).toEqual([]);
  });
});
