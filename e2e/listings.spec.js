import { test, expect } from "@playwright/test";

// Smoke tests for the public listing pages — these don't require auth and
// verify the core browse flow renders without console errors.

test.describe("Listings browse flow", () => {
  test("hotels page renders without console errors", async ({ page }) => {
    const errors = [];
    page.on("pageerror", (err) => errors.push(err.message));

    await page.goto("/hotel", { waitUntil: "domcontentloaded" });
    // Not networkidle: the app keeps a socket.io connection open, so
    // networkidle would never resolve. Wait for real page content instead.
    await page.getByText(/Showing \d+ of \d+ hotels/).waitFor({ timeout: 15000 }).catch(() => {});

    expect(errors).toEqual([]);
  });

  test("events page renders without console errors", async ({ page }) => {
    const errors = [];
    page.on("pageerror", (err) => errors.push(err.message));

    await page.goto("/events", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1000);

    expect(errors).toEqual([]);
  });

  test("clicking a hotel card navigates to its detail page", async ({ page }) => {
    await page.goto("/hotel", { waitUntil: "domcontentloaded" });
    await page.getByText(/Showing \d+ of \d+ hotels/).waitFor({ timeout: 15000 }).catch(() => {});

    const firstCard = page.locator("a[href^='/hotel/'], [class*='card']").first();
    const count = await firstCard.count();
    test.skip(count === 0, "No hotels seeded — run `npm run seed` in backend first");

    await firstCard.click();
    await expect(page).toHaveURL(/\/hotel\//);
  });
});
