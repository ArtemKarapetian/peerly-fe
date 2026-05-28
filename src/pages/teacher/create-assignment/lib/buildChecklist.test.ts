import { describe, expect, it } from "vitest";

import { buildChecklist } from "./buildChecklist";

const RUBRICS = [
  {
    id: "r1",
    criteria: [
      { name: "Clarity", description: "How clear is the writing", maxScore: 5 },
      { name: "Depth", description: "", maxScore: 10 },
    ],
  },
  {
    id: "r2",
    criteria: [{ name: "Lone", description: "Single criterion", maxScore: 3 }],
  },
];

describe("buildChecklist", () => {
  it("returns empty string when rubricId is null", () => {
    expect(buildChecklist(RUBRICS, null)).toBe("");
  });

  it("returns empty string when rubricId is unknown", () => {
    expect(buildChecklist(RUBRICS, "r-unknown")).toBe("");
  });

  it("renders single criterion without description", () => {
    expect(buildChecklist(RUBRICS, "r1").split("\n")[1]).toBe("Depth (10)");
  });

  it("renders criterion with description on same line", () => {
    expect(buildChecklist(RUBRICS, "r1").split("\n")[0]).toBe(
      "Clarity (5): How clear is the writing",
    );
  });

  it("joins multiple criteria with newlines", () => {
    const result = buildChecklist(RUBRICS, "r1");
    expect(result.split("\n")).toHaveLength(2);
  });

  it("handles single-criterion rubric", () => {
    expect(buildChecklist(RUBRICS, "r2")).toBe("Lone (3): Single criterion");
  });
});
