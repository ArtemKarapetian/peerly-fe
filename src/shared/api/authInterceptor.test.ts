import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

const clearSessionMock = vi.fn();

vi.mock("./session", () => ({
  clearSession: () => {
    clearSessionMock();
  },
}));

vi.mock("@/shared/config/env", () => ({
  env: { apiUrl: "" },
}));

interface LocationStub {
  replace: ReturnType<typeof vi.fn>;
}

function stubLocation(): LocationStub {
  const replace = vi.fn();
  Object.defineProperty(window, "location", {
    configurable: true,
    value: { replace, href: "" },
  });
  return { replace };
}

describe("authInterceptor", () => {
  let originalLocation: Location;

  beforeEach(() => {
    originalLocation = window.location;
    vi.resetModules();
    clearSessionMock.mockReset();
    globalThis.fetch = vi.fn() as unknown as typeof fetch;
  });

  afterEach(() => {
    Object.defineProperty(window, "location", {
      configurable: true,
      value: originalLocation,
    });
    vi.restoreAllMocks();
  });

  it("handleUnauthorized: returns true when refresh succeeds", async () => {
    stubLocation();
    (globalThis.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      status: 200,
    } as Response);

    const mod = await import("./authInterceptor");
    const result = await mod.handleUnauthorized();

    expect(result).toBe(true);
    expect(clearSessionMock).not.toHaveBeenCalled();
  });

  it("handleUnauthorized: calls forceLogout (clearSession + location.replace) when refresh fails", async () => {
    const loc = stubLocation();
    (globalThis.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      status: 401,
    } as Response);

    const mod = await import("./authInterceptor");
    const result = await mod.handleUnauthorized();

    expect(result).toBe(false);
    expect(clearSessionMock).toHaveBeenCalledTimes(1);
    expect(loc.replace).toHaveBeenCalledWith("/login");
  });

  it("handleUnauthorized: returns false when fetch throws (network error)", async () => {
    const loc = stubLocation();
    (globalThis.fetch as unknown as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      new Error("network"),
    );

    const mod = await import("./authInterceptor");
    const result = await mod.handleUnauthorized();

    expect(result).toBe(false);
    expect(clearSessionMock).toHaveBeenCalledTimes(1);
    expect(loc.replace).toHaveBeenCalledWith("/login");
  });

  it("concurrent calls share the same refreshPromise (single fetch)", async () => {
    stubLocation();
    let resolveFetch: (v: Response) => void = () => {};
    const pending = new Promise<Response>((r) => {
      resolveFetch = r;
    });
    (globalThis.fetch as unknown as ReturnType<typeof vi.fn>).mockReturnValueOnce(pending);

    const mod = await import("./authInterceptor");
    const a = mod.handleUnauthorized();
    const b = mod.handleUnauthorized();

    resolveFetch({ ok: true, status: 200 } as Response);
    const [resA, resB] = await Promise.all([a, b]);

    expect(resA).toBe(true);
    expect(resB).toBe(true);
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
  });

  it("forceLogout is idempotent: second call does not clearSession or replace again", async () => {
    const loc = stubLocation();
    const mod = await import("./authInterceptor");

    mod.forceLogout();
    mod.forceLogout();

    expect(clearSessionMock).toHaveBeenCalledTimes(1);
    expect(loc.replace).toHaveBeenCalledTimes(1);
  });
});
