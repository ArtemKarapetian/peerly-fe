import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, it, expect } from "vitest";

const pagePath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "Page.tsx");
const source = readFileSync(pagePath, "utf8");

describe("TeacherCourseDetailsPage — tabs", () => {
  it("defines exactly three tab keys", () => {
    const match = source.match(/type TabKey =\s*([^;]+);/);
    expect(match).not.toBeNull();
    const keys = match![1]
      .split("|")
      .map((s) => s.trim().replace(/^"|"$/g, ""))
      .filter(Boolean);
    expect(keys).toEqual(["assignments", "participants", "settings"]);
  });

  it("does not render the announcements widget", () => {
    expect(source).not.toMatch(/TeacherCourseAnnouncements/);
  });
});
