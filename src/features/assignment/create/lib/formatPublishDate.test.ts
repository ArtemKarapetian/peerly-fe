import { describe, expect, it } from "vitest";

import { formatPublishDate } from "./formatPublishDate";

describe("formatPublishDate", () => {
  it("returns notSpecified for null", () => {
    expect(formatPublishDate(null, "не указано")).toBe("не указано");
  });

  it("returns a formatted ru-RU date for a real Date", () => {
    const result = formatPublishDate(new Date("2026-07-01T12:00:00Z"), "fallback");
    expect(result).toContain("2026");
    expect(result).toContain("июля");
  });
});
