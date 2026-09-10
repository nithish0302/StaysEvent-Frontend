import { test, expect } from "@playwright/test";
import { uniqueEmail, E2E_ADMIN, API_BASE_URL } from "./fixtures.js";

// Covers three things fixed/built this round:
//   1. Event location.pinCode actually persists (it was silently dropped
//      before the schema fix — the form validated it, Mongoose stripped it).
//   2. The vendor dashboard's new earnings chart section renders.
//   3. VendorDetailsPage now shows a toast on a failed submit instead of
//      silently doing nothing.

test.describe("Vendor flows", () => {
  // ── pinCode: API-level, on purpose ──────────────────────────────────────
  // Reaching this through the real Add Event form would also require a
  // real Cloudinary upload (at least one photo is required client-side),
  // which needs credentials this CI environment doesn't have. The bug that
  // was fixed lives entirely between the API and the database, so an
  // API-level check exercises the exact thing that broke without depending
  // on infrastructure this suite doesn't have.
  test("event location.pinCode survives register -> admin approval -> create -> fetch", async ({ request }) => {
    const vendorEmail = uniqueEmail("pincode-vendor");

    const registerRes = await request.post(`${API_BASE_URL}/auth/register`, {
      data: {
        name: "PinCode Test Vendor",
        email: vendorEmail,
        password: "password123",
        role: "vendor",
      },
    });
    expect(registerRes.ok()).toBeTruthy();
    const { accessToken: vendorToken, user: vendor } = await registerRes.json();

    const adminLoginRes = await request.post(`${API_BASE_URL}/auth/login`, {
      data: { email: E2E_ADMIN.email, password: E2E_ADMIN.password },
    });
    expect(
      adminLoginRes.ok(),
      "Admin login failed — has backend/scripts/ensureE2EAdmin.js been run against this database?",
    ).toBeTruthy();
    const { accessToken: adminToken } = await adminLoginRes.json();

    const approveRes = await request.patch(
      `${API_BASE_URL}/admin/vendors/${vendor.id}/status`,
      {
        headers: { Authorization: `Bearer ${adminToken}` },
        data: { status: "approved" },
      },
    );
    expect(approveRes.ok()).toBeTruthy();

    const pinCode = "600001";
    const createRes = await request.post(`${API_BASE_URL}/events`, {
      headers: { Authorization: `Bearer ${vendorToken}` },
      data: {
        name: "PinCode Regression Test Event",
        description: "Created by the E2E suite to check location.pinCode persists.",
        category: "Conference",
        bookingType: "ticket",
        ticketDetails: { price: 500, totalSeats: 100 },
        location: {
          city: "Chennai",
          state: "Tamil Nadu",
          address: "1 Test Street",
          pinCode,
        },
        startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        startTime: "10:00 AM",
        endTime: "06:00 PM",
        amenities: ["WiFi"],
        photos: [],
      },
    });
    expect(createRes.ok(), await createRes.text()).toBeTruthy();
    const { event } = await createRes.json();
    expect(event.location.pinCode).toBe(pinCode);

    // Read it back independently — confirms it round-tripped through Mongo,
    // not just echoed from the request body.
    const fetchRes = await request.get(`${API_BASE_URL}/events/${event._id}`);
    expect(fetchRes.ok()).toBeTruthy();
    const { event: fetchedEvent } = await fetchRes.json();
    expect(fetchedEvent.location.pinCode).toBe(pinCode);
  });

  // ── Earnings chart section renders ──────────────────────────────────────
  test("vendor dashboard renders the earnings chart section", async ({ page }) => {
    const email = uniqueEmail("chart-vendor");

    await page.goto("/register", { waitUntil: "domcontentloaded" });
    await page.getByTestId("register-name").fill("Chart Test Vendor");
    await page.getByTestId("register-email").fill(email);
    await page.getByTestId("register-password").fill("password123");
    await page.getByTestId("register-role").selectOption("vendor");
    await page.getByTestId("register-submit").click();

    // Registration is async — wait for the post-register redirect (proof the
    // token actually landed in the auth store) before navigating away.
    // Without this, page.goto("/vendor") can fire before the user is
    // authenticated, ProtectedRoutes bounces to /login, and the dashboard
    // text never appears.
    await page.waitForURL(/\/vendor\/details/, { timeout: 15000 });

    // New vendors land on /vendor/details (KYC) — the dashboard route only
    // checks role, not approval status, so it's reachable directly.
    await page.goto("/vendor", { waitUntil: "domcontentloaded" });

    await expect(page.getByText("Earnings — Last 6 Months")).toBeVisible({ timeout: 15000 });
    // No bookings yet for a brand-new vendor — the empty state, not the chart.
    await expect(
      page.getByText("No confirmed earnings yet in the last 6 months"),
    ).toBeVisible();
  });

  // ── Toast on VendorDetailsPage failure ──────────────────────────────────
  test("VendorDetailsPage shows a toast when the submit fails", async ({ page }) => {
    const email = uniqueEmail("toast-vendor");

    await page.goto("/register", { waitUntil: "domcontentloaded" });
    await page.getByTestId("register-name").fill("Toast Test Vendor");
    await page.getByTestId("register-email").fill(email);
    await page.getByTestId("register-password").fill("password123");
    await page.getByTestId("register-role").selectOption("vendor");
    await page.getByTestId("register-submit").click();

    // Registering as a vendor redirects straight to the KYC form.
    await page.waitForURL(/\/vendor\/details/, { timeout: 15000 });

    // Force the update-vendor-details call to fail server-side so we're
    // testing "does a failure surface to the user", not fighting client
    // validation parity with the backend's own regex checks.
    await page.route("**/api/auth/update-vendor-details", (route) =>
      route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ success: false, message: "Simulated failure for test" }),
      }),
    );

    await page.fill('input[name="businessName"]', "Test Business");
    await page.selectOption('select[name="businessType"]', "hotel");
    await page.fill('input[name="gstNumber"]', "29ABCDE1234F1Z5");
    await page.fill('input[name="panNumber"]', "ABCDE1234F");
    await page.fill('textarea[name="businessAddress"]', "1 Test Street");
    await page.fill('input[name="city"]', "Chennai");

    await page.getByRole("button", { name: /submit/i }).first().click();

    await expect(page.getByText("Simulated failure for test")).toBeVisible({ timeout: 10000 });
  });
});
