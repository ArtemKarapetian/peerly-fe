import { describe, expect, it } from "vitest";

import { formatFileSize, hasNonEmptyComment } from "./formatters";

const t = (key: string) => key;

describe("formatFileSize", () => {
  it("formats sub-1KB sizes in bytes", () => {
    expect(formatFileSize(500, t)).toBe("500 entity.work.bytes");
  });
  it("formats KB sizes with one decimal", () => {
    expect(formatFileSize(1024, t)).toBe("1.0 entity.work.kb");
  });
  it("formats MB sizes with one decimal", () => {
    expect(formatFileSize(1024 * 1024 * 5, t)).toBe("5.0 entity.work.mb");
  });
});

describe("hasNonEmptyComment", () => {
  it("returns false for null and undefined", () => {
    expect(hasNonEmptyComment(null)).toBe(false);
    expect(hasNonEmptyComment(undefined)).toBe(false);
  });
  it("returns false for empty / whitespace-only string", () => {
    expect(hasNonEmptyComment("")).toBe(false);
    expect(hasNonEmptyComment("   ")).toBe(false);
  });
  it("returns false for the special em-dash sentinel", () => {
    expect(hasNonEmptyComment("—")).toBe(false);
  });
  it("returns true for real text", () => {
    expect(hasNonEmptyComment("hi")).toBe(true);
    expect(hasNonEmptyComment("  hi  ")).toBe(true);
  });
});
