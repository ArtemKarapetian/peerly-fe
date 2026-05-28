import { describe, expect, it } from "vitest";

import { getNavItemsForRole, isItemActive, type NavItem } from "./navItems";

describe("getNavItemsForRole", () => {
  it("returns student menu", () => {
    const items = getNavItemsForRole("Student");
    expect(items.map((i) => i.hash)).toEqual([
      "/student/dashboard",
      "/student/courses",
      "/student/reviews",
      "/student/reviews/received",
      "/student/gradebook",
    ]);
  });

  it("returns teacher menu", () => {
    const items = getNavItemsForRole("Teacher");
    expect(items.map((i) => i.hash)).toContain("/teacher/courses");
    expect(items.map((i) => i.hash)).toContain("/teacher/analytics");
  });

  it("returns admin menu", () => {
    const items = getNavItemsForRole("Admin");
    expect(items.map((i) => i.hash)).toEqual(["/admin/overview", "/admin/users"]);
  });

  it("returns empty list for null role", () => {
    expect(getNavItemsForRole(null)).toEqual([]);
  });
});

describe("isItemActive", () => {
  const studentItems: NavItem[] = [
    {
      icon: () => null,
      labelKey: "nav.reviews",
      hash: "/student/reviews",
    } as unknown as NavItem,
    {
      icon: () => null,
      labelKey: "nav.receivedReviews",
      hash: "/student/reviews/received",
    } as unknown as NavItem,
  ];

  it("matches exact path", () => {
    expect(isItemActive("/student/reviews", "/student/reviews", studentItems)).toBe(true);
  });

  it("matches deep child of parent", () => {
    expect(isItemActive("/student/reviews/some-id", "/student/reviews", studentItems)).toBe(true);
  });

  it("does NOT match parent when more-specific sibling matches", () => {
    expect(isItemActive("/student/reviews/received", "/student/reviews", studentItems)).toBe(false);
  });

  it("matches the more-specific child route exactly", () => {
    expect(
      isItemActive("/student/reviews/received", "/student/reviews/received", studentItems),
    ).toBe(true);
  });

  it("returns false for unrelated path", () => {
    expect(isItemActive("/teacher/courses", "/student/reviews", studentItems)).toBe(false);
  });
});
