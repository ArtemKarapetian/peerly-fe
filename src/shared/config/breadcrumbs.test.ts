import { describe, it, expect } from "vitest";

import { getCrumbs } from "./breadcrumbs";
import { ROUTES } from "./routes";

describe("getCrumbs", () => {
  it("returns the expected top-level keys", () => {
    const crumbs = getCrumbs();
    expect(Object.keys(crumbs)).toEqual(
      expect.arrayContaining([
        "courses",
        "studentDashboard",
        "gradebook",
        "settings",
        "teacherCourses",
        "adminOverview",
      ]),
    );
  });

  it("each crumb has a non-empty label and a href", () => {
    const crumbs = getCrumbs();
    for (const value of Object.values(crumbs)) {
      expect(typeof value.label).toBe("string");
      expect(value.label.length).toBeGreaterThan(0);
      expect(typeof value.href).toBe("string");
      expect(value.href.length).toBeGreaterThan(0);
    }
  });

  it("student crumbs point to the routes table", () => {
    const crumbs = getCrumbs();
    expect(crumbs.courses.href).toBe(ROUTES.courses);
    expect(crumbs.studentDashboard.href).toBe(ROUTES.dashboard);
    expect(crumbs.gradebook.href).toBe(ROUTES.gradebook);
    expect(crumbs.settings.href).toBe(ROUTES.settings);
  });

  it("teacher and admin crumbs use the right routes", () => {
    const crumbs = getCrumbs();
    expect(crumbs.teacherCourses.href).toBe(ROUTES.teacherCourses);
    expect(crumbs.adminOverview.href).toBe(ROUTES.adminOverview);
  });
});
