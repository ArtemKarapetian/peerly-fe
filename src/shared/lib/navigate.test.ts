import { describe, it, expect, vi, beforeEach } from "vitest";

import { registerNavigate, appNavigate } from "./navigate";

describe("navigate", () => {
  beforeEach(() => {
    // Reset to no registered navigate
    registerNavigate(null as unknown as (to: string) => void);
  });

  it("calls registered navigate function", () => {
    const mockNavigate = vi.fn();
    registerNavigate(mockNavigate);

    appNavigate("/dashboard");
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });

  it("falls back to window.location.href when no navigate registered", () => {
    const originalLocation = window.location;
    Object.defineProperty(window, "location", {
      configurable: true,
      value: { href: "" },
    });

    appNavigate("/login");
    expect(window.location.href).toBe("/login");

    Object.defineProperty(window, "location", {
      configurable: true,
      value: originalLocation,
    });
  });
});
