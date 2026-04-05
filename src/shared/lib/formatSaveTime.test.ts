import { describe, it, expect } from "vitest";

import { formatSaveTime } from "./formatSaveTime";

describe("formatSaveTime", () => {
  it("formats hours and minutes with zero-padding", () => {
    // 2025-01-15 09:05:00
    const ts = new Date(2025, 0, 15, 9, 5, 0).getTime();
    expect(formatSaveTime(ts)).toBe("09:05");
  });

  it("formats afternoon time correctly", () => {
    const ts = new Date(2025, 5, 20, 14, 30, 0).getTime();
    expect(formatSaveTime(ts)).toBe("14:30");
  });

  it("formats midnight as 00:00", () => {
    const ts = new Date(2025, 0, 1, 0, 0, 0).getTime();
    expect(formatSaveTime(ts)).toBe("00:00");
  });
});
