import { describe, it, expect, vi, beforeEach } from "vitest";

import { appNavigate } from "@/shared/lib/navigate";

import {
  ApiError,
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
  http,
} from "./httpClient";

vi.mock("@/shared/config/env", () => ({
  env: { apiUrl: "http://api.test" },
}));

vi.mock("@/shared/lib/navigate", () => ({
  appNavigate: vi.fn(),
}));

beforeEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
  global.fetch = vi.fn();
});

// ---------------------------------------------------------------------------
// Token helpers
// ---------------------------------------------------------------------------
describe("token helpers", () => {
  it("getAccessToken returns null when nothing is stored", () => {
    expect(getAccessToken()).toBeNull();
  });

  it("getRefreshToken returns null when nothing is stored", () => {
    expect(getRefreshToken()).toBeNull();
  });

  it("setTokens stores access token", () => {
    setTokens("access123");
    expect(getAccessToken()).toBe("access123");
  });

  it("setTokens stores both access and refresh tokens", () => {
    setTokens("access123", "refresh456");
    expect(getAccessToken()).toBe("access123");
    expect(getRefreshToken()).toBe("refresh456");
  });

  it("clearTokens removes both tokens", () => {
    setTokens("a", "r");
    clearTokens();
    expect(getAccessToken()).toBeNull();
    expect(getRefreshToken()).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// ApiError
// ---------------------------------------------------------------------------
describe("ApiError", () => {
  it("stores status, body, and message", () => {
    const err = new ApiError(404, { detail: "not found" }, "Not Found");
    expect(err).toBeInstanceOf(Error);
    expect(err.status).toBe(404);
    expect(err.body).toEqual({ detail: "not found" });
    expect(err.message).toBe("Not Found");
  });
});

// ---------------------------------------------------------------------------
// http methods
// ---------------------------------------------------------------------------
describe("http.get", () => {
  it("calls fetch with correct URL and Authorization header", async () => {
    setTokens("tok123");

    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ id: 1 }),
    });

    const data = await http.get("/users");

    expect(global.fetch).toHaveBeenCalledWith(
      "http://api.test/users",
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer tok123",
        }),
      }),
    );
    expect(data).toEqual({ id: 1 });
  });

  it("throws ApiError on non-ok response", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: () => Promise.resolve({ error: "internal" }),
    });

    await expect(http.get("/fail")).rejects.toThrow(ApiError);
  });
});

describe("http.post", () => {
  it("sends JSON body with POST method", async () => {
    setTokens("tok");

    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ ok: true }),
    });

    await http.post("/items", { name: "test" });

    expect(global.fetch).toHaveBeenCalledWith(
      "http://api.test/items",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ name: "test" }),
      }),
    );
  });
});

// ---------------------------------------------------------------------------
// 401 handling
// ---------------------------------------------------------------------------
describe("401 handling", () => {
  it("clears tokens and navigates to /login when refresh fails", async () => {
    setTokens("expired_access", "expired_refresh");

    // First call returns 401
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: () => Promise.resolve({ detail: "unauthorized" }),
    });

    // Refresh call also fails
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: () => Promise.resolve({ detail: "refresh failed" }),
    });

    await expect(http.get("/protected")).rejects.toThrow();

    expect(getAccessToken()).toBeNull();
    expect(getRefreshToken()).toBeNull();
    expect(appNavigate).toHaveBeenCalledWith("/login");
  });
});
