import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

import { http, ApiError } from "./httpClient";

const navigateMock = vi.fn();

vi.mock("@/shared/lib/navigate", () => ({
  appNavigate: (to: string) => {
    navigateMock(to);
  },
}));

vi.mock("./authInterceptor", () => ({
  handleUnauthorized: vi.fn(() => Promise.resolve(false)),
}));

vi.mock("@/shared/config/env", () => ({
  env: { apiUrl: "" },
}));

function mockFetchOnce(status: number, body: unknown = null) {
  const response = {
    ok: status >= 200 && status < 300,
    status,
    text: () => Promise.resolve(body === null ? "" : JSON.stringify(body)),
  } as Response;
  (globalThis.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce(response);
}

describe("httpClient onError behaviour", () => {
  beforeEach(() => {
    globalThis.fetch = vi.fn() as unknown as typeof fetch;
    navigateMock.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("defaults to inline mode: throws ApiError on 404 without redirecting", async () => {
    mockFetchOnce(404, { error: "not found" });

    await expect(http.get("/courses/missing")).rejects.toBeInstanceOf(ApiError);
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it("redirect mode: navigates to /403 on 403 response and still throws", async () => {
    mockFetchOnce(403);

    await expect(http.get("/teacher/secret", { onError: "redirect" })).rejects.toBeInstanceOf(
      ApiError,
    );
    expect(navigateMock).toHaveBeenCalledWith("/403");
  });

  it("redirect mode: navigates to /404 on 404 response", async () => {
    mockFetchOnce(404);

    await expect(http.get("/courses/42", { onError: "redirect" })).rejects.toBeInstanceOf(ApiError);
    expect(navigateMock).toHaveBeenCalledWith("/404");
  });

  it("redirect mode: navigates to /500 on server error", async () => {
    mockFetchOnce(500);

    await expect(http.get("/broken", { onError: "redirect" })).rejects.toBeInstanceOf(ApiError);
    expect(navigateMock).toHaveBeenCalledWith("/500");
  });

  it("redirect mode: does NOT redirect on other 4xx", async () => {
    mockFetchOnce(422, { errors: ["bad"] });

    await expect(http.post("/form", { x: 1 }, { onError: "redirect" })).rejects.toBeInstanceOf(
      ApiError,
    );
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it("returns parsed JSON on success", async () => {
    const payload = { id: "c1", name: "Course" };
    mockFetchOnce(200, payload);

    const result = await http.get<typeof payload>("/courses/c1", { onError: "redirect" });

    expect(result).toEqual(payload);
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it("401 is handled by authInterceptor, not by onError redirect", async () => {
    mockFetchOnce(401);

    await expect(http.get("/me", { onError: "redirect" })).rejects.toMatchObject({ status: 401 });
    expect(navigateMock).not.toHaveBeenCalledWith("/401");
  });
});
