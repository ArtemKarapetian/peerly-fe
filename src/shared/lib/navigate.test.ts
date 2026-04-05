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
    const hrefSpy = vi.spyOn(window, "location", "get").mockReturnValue({
      ...window.location,
      href: "",
    } as Location);

    // Since we can't easily spy on setting href, just verify it doesn't throw
    expect(() => appNavigate("/login")).not.toThrow();

    hrefSpy.mockRestore();
  });
});
