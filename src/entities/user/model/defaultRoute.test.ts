import { describe, expect, it } from "vitest";

import { defaultRouteForRole } from "./defaultRoute";

describe("defaultRouteForRole", () => {
  it("maps Teacher to /teacher/courses", () => {
    expect(defaultRouteForRole("Teacher")).toBe("/teacher/courses");
  });

  it("maps Admin to /admin/overview", () => {
    expect(defaultRouteForRole("Admin")).toBe("/admin/overview");
  });

  it("maps Student to /student/dashboard", () => {
    expect(defaultRouteForRole("Student")).toBe("/student/dashboard");
  });

  it("falls back to the student route for undefined", () => {
    expect(defaultRouteForRole(undefined)).toBe("/student/dashboard");
  });

  it("falls back to the student route for null", () => {
    expect(defaultRouteForRole(null)).toBe("/student/dashboard");
  });
});
