import { describe, expect, it } from "vitest";

import type { CourseRow } from "../model/types";

import { filterCourses } from "./filterCourses";

const ROWS: CourseRow[] = [
  { id: "1", name: "Algebra Basics", status: "active" },
  { id: "2", name: "Geometry", status: "draft" },
  { id: "3", name: "Calculus", status: "archived" },
  { id: "4", name: "Algebra Advanced", status: "active" },
];

describe("filterCourses", () => {
  it("returns all when status=all and no query", () => {
    expect(filterCourses(ROWS, "all", "")).toHaveLength(4);
  });

  it("filters by status", () => {
    expect(filterCourses(ROWS, "draft", "")).toEqual([
      { id: "2", name: "Geometry", status: "draft" },
    ]);
  });

  it("searches case-insensitively", () => {
    const result = filterCourses(ROWS, "all", "algebra");
    expect(result.map((r) => r.id)).toEqual(["1", "4"]);
  });

  it("combines status and search", () => {
    const result = filterCourses(ROWS, "active", "advanced");
    expect(result).toEqual([{ id: "4", name: "Algebra Advanced", status: "active" }]);
  });

  it("trims search query whitespace", () => {
    expect(filterCourses(ROWS, "all", "   Geometry  ")).toHaveLength(1);
  });

  it("returns empty when nothing matches", () => {
    expect(filterCourses(ROWS, "all", "nope")).toEqual([]);
  });
});
