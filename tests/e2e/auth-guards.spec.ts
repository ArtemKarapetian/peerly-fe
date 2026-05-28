import { expect, test } from "@playwright/test";

const studentSession = {
  userId: "s1",
  userName: "Student",
  email: "s@local",
  role: "Student",
};

async function seedSession(page: import("@playwright/test").Page, session: typeof studentSession) {
  await page.addInitScript(
    (s) => window.localStorage.setItem("peerly_session", JSON.stringify(s)),
    session,
  );
  await page.route("**/api/v1/**", async (route) => {
    const url = route.request().url();

    console.warn(`[e2e seedSession] unhandled API call: ${url} — returning empty stub`);
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({}),
    });
  });

  // Endpoints the bootstrap + dashboard actually need.
  await page.route("**/api/v1/me/role", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ role: session.role }),
    }),
  );
  await page.route(`**/api/v1/${session.role.toLowerCase()}/me`, (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(
        session.role === "Student"
          ? { studentInfo: { studentId: 1, email: session.email, name: session.userName } }
          : { teacherInfo: { teacherId: 1, email: session.email, name: session.userName } },
      ),
    }),
  );
  await page.route(`**/api/v1/${session.role.toLowerCase()}/courses*`, (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ courseInfos: [] }),
    }),
  );
  await page.route(`**/api/v1/${session.role.toLowerCase()}/homeworks*`, (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ homeworkInfos: [] }),
    }),
  );
}

test.describe("Auth and role guards", () => {
  test("anonymous user is redirected from /teacher/courses to /login", async ({ page }) => {
    await page.context().clearCookies();
    await page.addInitScript(() => window.localStorage.clear());
    await page.goto("/teacher/courses");
    await page.waitForURL(/\/login/, { timeout: 5_000 });
    await expect(page).toHaveURL(/\/login/);
  });

  test("anonymous user is redirected from /student/dashboard to /login", async ({ page }) => {
    await page.context().clearCookies();
    await page.addInitScript(() => window.localStorage.clear());
    await page.goto("/student/dashboard");
    await page.waitForURL(/\/login/, { timeout: 5_000 });
    await expect(page).toHaveURL(/\/login/);
  });

  test("authenticated student is not bounced to /login from the root route", async ({ page }) => {
    await seedSession(page, studentSession);
    await page.goto("/");
    await expect(page).not.toHaveURL(/\/login/, { timeout: 5_000 });
  });

  test("student visiting /teacher/courses lands on the student dashboard", async ({ page }) => {
    await seedSession(page, studentSession);
    await page.goto("/teacher/courses");
    await expect(page).toHaveURL(/\/student\/dashboard/, { timeout: 5_000 });
  });
});
