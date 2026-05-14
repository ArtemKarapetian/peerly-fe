import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.context().clearCookies();
  await page.addInitScript(() => window.localStorage.clear());
  await page.route("**/api/**", (route) =>
    route.fulfill({ status: 401, body: JSON.stringify({ error: "unauthenticated" }) }),
  );
});

test.describe("Error pages", () => {
  test("/404 renders the not-found page", async ({ page }) => {
    await page.goto("/404");
    await expect(page.getByText("404")).toBeVisible({ timeout: 10_000 });
  });

  test("/403 renders the forbidden page", async ({ page }) => {
    await page.goto("/403");
    await expect(page.getByText("403")).toBeVisible({ timeout: 10_000 });
  });

  test("/500 renders the server-error page", async ({ page }) => {
    await page.goto("/500");
    await expect(page.getByText("500")).toBeVisible({ timeout: 10_000 });
  });

  test("unknown route falls through to the 404 page", async ({ page }) => {
    await page.goto("/this-route-does-not-exist");
    await expect(page.getByText("404")).toBeVisible({ timeout: 10_000 });
  });
});
