import { describe, it, expect, beforeEach, vi } from "vitest";

import { redirectForStatus } from "./errorRedirect";

const navigateMock = vi.fn();

vi.mock("@/shared/lib/navigate", () => ({
  appNavigate: (to: string) => {
    navigateMock(to);
  },
}));

describe("redirectForStatus", () => {
  beforeEach(() => {
    navigateMock.mockReset();
  });

  it("403 → navigates to /403 and returns true", () => {
    expect(redirectForStatus(403)).toBe(true);
    expect(navigateMock).toHaveBeenCalledWith("/403");
  });

  it("404 → navigates to /404 and returns true", () => {
    expect(redirectForStatus(404)).toBe(true);
    expect(navigateMock).toHaveBeenCalledWith("/404");
  });

  it("500 → navigates to /500 and returns true", () => {
    expect(redirectForStatus(500)).toBe(true);
    expect(navigateMock).toHaveBeenCalledWith("/500");
  });

  it("401 → does not navigate, returns false", () => {
    expect(redirectForStatus(401)).toBe(false);
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it("non-redirect statuses do not navigate", () => {
    expect(redirectForStatus(200)).toBe(false);
    expect(redirectForStatus(422)).toBe(false);
    expect(redirectForStatus(502)).toBe(false);
    expect(navigateMock).not.toHaveBeenCalled();
  });
});
