import { describe, it, expect } from "vitest";

import { ROUTES } from "@/shared/config/routes";

import { routeRegistry } from "./routeRegistry";

describe("routeRegistry", () => {
  const byPath = new Map(routeRegistry.map((r) => [r.path, r]));

  it("registers the teacher create-course route under the Teacher role", () => {
    const route = byPath.get(ROUTES.teacherCreateCourse);
    expect(route).toBeDefined();
    expect(route?.access).toBe("teacher");
    expect(route?.component).toBeDefined();
  });

  it("registers every teacher-only feature page under the Teacher role", () => {
    const teacherPaths = [
      ROUTES.teacherCourses,
      ROUTES.teacherCreateCourse,
      ROUTES.teacherRubrics,
      ROUTES.teacherCreateAssignment,
      ROUTES.teacherAnalytics,
      ROUTES.teacherDistribution,
      ROUTES.teacherSubmissions,
    ];
    for (const path of teacherPaths) {
      expect(byPath.get(path)?.access, `expected ${path} to be teacher-access`).toBe("teacher");
    }
  });

  it("registers every admin page under the Admin role", () => {
    const adminPaths = [ROUTES.adminOverview, ROUTES.adminUsers];
    for (const path of adminPaths) {
      expect(byPath.get(path)?.access, `expected ${path} to be admin-access`).toBe("admin");
    }
  });

  it("gates demo-flag routes with their respective flag", () => {
    expect(byPath.get(ROUTES.resetPassword)?.demoFlag).toBe("enablePasswordReset");
    expect(byPath.get(ROUTES.verifyEmail)?.demoFlag).toBe("enableEmailConfirmation");
  });

  it("demo-flag routes carry a redirectTo target that exists in ROUTES (so DemoFlagRoute does not bounce users to a dead URL)", () => {
    const knownPaths = new Set<string>(
      Object.values(ROUTES).flatMap((v) => (typeof v === "string" ? [v] : [])),
    );
    for (const r of routeRegistry) {
      if (!r.demoFlag) continue;
      expect(r.redirectTo, `${r.path} demo-flag route is missing redirectTo`).toBeDefined();
      expect(
        knownPaths.has(r.redirectTo ?? ""),
        `${r.path} demo-flag fallback ${r.redirectTo ?? "<missing>"} is not a known ROUTES.* value`,
      ).toBe(true);
    }
  });

  it("no demo-flag route silently shares its flag with another — each flag belongs to exactly one route", () => {
    const seen = new Map<string, string>();
    for (const r of routeRegistry) {
      if (!r.demoFlag) continue;
      const prev = seen.get(r.demoFlag);
      if (prev) {
        throw new Error(`Demo flag ${r.demoFlag} is gating both ${prev} and ${r.path}`);
      }
      seen.set(r.demoFlag, r.path);
    }
  });

  it("marks login/register as publicOnly so authenticated users bounce away", () => {
    expect(byPath.get(ROUTES.login)?.access).toBe("publicOnly");
    expect(byPath.get(ROUTES.register)?.access).toBe("publicOnly");
  });

  it("does not register removed legacy paths in the main registry", () => {
    const legacyOnlyPaths = ["/course/:courseId", "/task/:taskId", "/teacher/course/:courseId"];
    for (const path of legacyOnlyPaths) {
      expect(byPath.get(path)).toBeUndefined();
    }
  });

  it("every non-redirect route has a lazy component", () => {
    for (const r of routeRegistry) {
      if (r.access === "redirect") continue;
      expect(r.component, `path ${r.path} is missing a component`).toBeDefined();
    }
  });
});
