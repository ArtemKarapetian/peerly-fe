import { expect, test } from "@playwright/test";

test.describe("Landing and public pages", () => {
  test("landing renders without runtime errors", async ({ page }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (err) => pageErrors.push(err.message));
    await page.goto("/");
    await expect(page).toHaveTitle(/peerly/i);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    expect(pageErrors).toEqual([]);
  });

  test("hero CTA navigates to /register", async ({ page }) => {
    await page.context().clearCookies();
    await page.addInitScript(() => window.localStorage.clear());
    await page.goto("/");
    const heroSection = page.locator("section", {
      has: page.getByRole("heading", { level: 1 }),
    });
    await heroSection.getByRole("button", { name: /начать|get\s*started/i }).click();
    await expect(page).toHaveURL(/\/register$/);
  });

  test("login page exposes email and password inputs by label", async ({ page }) => {
    await page.goto("/login");
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole("textbox", { name: /email|почт/i })).toBeVisible();
    await expect(page.getByLabel(/^пароль$|^password$/i)).toBeVisible();
  });

  test("register page shows the registration form and submit button", async ({ page }) => {
    await page.goto("/register");
    await expect(page).toHaveURL(/\/register$/);
    await expect(page.getByRole("heading", { name: /регистр|register/i })).toBeVisible();
    await expect(
      page.getByRole("button", { name: /создать|create.*account|зарегистр|sign\s*up/i }),
    ).toBeVisible();
  });
});
