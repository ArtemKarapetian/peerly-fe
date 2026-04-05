import { describe, it, expect } from "vitest";

import { assignmentRepo } from "./demoRepo";

describe("assignmentRepo", () => {
  it("getAll returns all assignments", async () => {
    const assignments = await assignmentRepo.getAll();
    expect(assignments).toHaveLength(2);
    expect(assignments.map((a) => a.id)).toEqual(["a1", "a2"]);
  });

  it("getByCourse filters correctly", async () => {
    const assignments = await assignmentRepo.getByCourse("c1");
    expect(assignments).toHaveLength(2);
    expect(assignments.every((a) => a.courseId === "c1")).toBe(true);
  });

  it("getByCourse returns empty for unknown course", async () => {
    const assignments = await assignmentRepo.getByCourse("unknown");
    expect(assignments).toHaveLength(0);
  });
});
