import { test, expect } from "@playwright/test";
import { uniqueEmail } from "./fixtures.js";

test.describe("Authentication", () => {
  test("a new customer can register and lands on the home page", async ({ page }) => {
    const email = uniqueEmail("customer");

    await page.goto("/register", { waitUntil: "domcontentloaded" });
    await page.getByTestId("register-name").fill("E2E Test Customer");
    await page.getByTestId("register-email").fill(email);
    await page.getByTestId("register-password").fill("password123");
    await page.getByTestId("register-role").selectOption("customer");
    await page.getByTestId("register-submit").click();

    // Successful registration redirects off /register
    await expect(page).not.toHaveURL(/\/register/);
  });

  test("shows an error for an unregistered login", async ({ page }) => {
    await page.goto("/login", { waitUntil: "domcontentloaded" });
    await page.getByTestId("login-email").fill(uniqueEmail("nobody"));
    await page.getByTestId("login-password").fill("wrongpassword1");
    await page.getByTestId("login-submit").click();

    await expect(page.getByTestId("login-error")).toBeVisible();
  });

  test("a registered customer can log in and log out", async ({ page }) => {
    const email = uniqueEmail("logincustomer");

    // Register first
    await page.goto("/register", { waitUntil: "domcontentloaded" });
    await page.getByTestId("register-name").fill("E2E Login Customer");
    await page.getByTestId("register-email").fill(email);
    await page.getByTestId("register-password").fill("password123");
    await page.getByTestId("register-role").selectOption("customer");
    await page.getByTestId("register-submit").click();
    await expect(page).not.toHaveURL(/\/register/);

    // Log out by clearing storage and reloading, then log back in
    await page.evaluate(() => localStorage.clear());
    await page.goto("/login", { waitUntil: "domcontentloaded" });
    await page.getByTestId("login-email").fill(email);
    await page.getByTestId("login-password").fill("password123");
    await page.getByTestId("login-submit").click();

    await expect(page).not.toHaveURL(/\/login/);
  });
});
