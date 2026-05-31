import { describe, expect, it } from "vitest";

import { commentForBe, formatDeadline, formatFileSize, normalizeSavedComment } from "./formatters";

const t = (key: string) => key;

describe("formatFileSize", () => {
  it("formats B / KB / MB", () => {
    expect(formatFileSize(0, t)).toBe("0 entity.work.bytes");
    expect(formatFileSize(2048, t)).toBe("2.0 entity.work.kb");
    expect(formatFileSize(3 * 1024 * 1024, t)).toBe("3.0 entity.work.mb");
  });
});

describe("formatDeadline", () => {
  it("returns em-dash for undefined date", () => {
    expect(formatDeadline(undefined, "ru-RU")).toBe("—");
  });
  it("returns a localized string for a real date", () => {
    const result = formatDeadline(new Date("2026-07-01T12:00:00Z"), "ru-RU");
    expect(result).toMatch(/2026|июл/i);
  });
});

describe("commentForBe", () => {
  it("returns em-dash for empty / whitespace-only", () => {
    expect(commentForBe("")).toBe("—");
    expect(commentForBe("   ")).toBe("—");
  });
  it("returns original text otherwise", () => {
    expect(commentForBe("hi")).toBe("hi");
    expect(commentForBe("  hi  ")).toBe("  hi  ");
  });
});

describe("normalizeSavedComment", () => {
  it("returns empty for null / undefined / empty / em-dash", () => {
    expect(normalizeSavedComment(null)).toBe("");
    expect(normalizeSavedComment(undefined)).toBe("");
    expect(normalizeSavedComment("")).toBe("");
    expect(normalizeSavedComment("—")).toBe("");
  });
  it("returns original text when meaningful", () => {
    expect(normalizeSavedComment("hello")).toBe("hello");
    expect(normalizeSavedComment("  hello  ")).toBe("  hello  ");
  });
});
