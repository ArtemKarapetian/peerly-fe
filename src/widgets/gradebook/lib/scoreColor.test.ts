import { describe, expect, it } from "vitest";

import { getScoreColor } from "./scoreColor";

describe("getScoreColor", () => {
  it("returns success for >=75%", () => {
    expect(getScoreColor(75, 100)).toBe("text-success");
    expect(getScoreColor(90, 100)).toBe("text-success");
    expect(getScoreColor(100, 100)).toBe("text-success");
  });

  it("returns warning for 60..74%", () => {
    expect(getScoreColor(60, 100)).toBe("text-warning");
    expect(getScoreColor(74, 100)).toBe("text-warning");
  });

  it("returns error for <60%", () => {
    expect(getScoreColor(0, 100)).toBe("text-error");
    expect(getScoreColor(50, 100)).toBe("text-error");
    expect(getScoreColor(59.9, 100)).toBe("text-error");
  });

  it("scales with arbitrary max", () => {
    expect(getScoreColor(4, 5)).toBe("text-success");
    expect(getScoreColor(3, 5)).toBe("text-warning");
    expect(getScoreColor(2, 5)).toBe("text-error");
  });
});
