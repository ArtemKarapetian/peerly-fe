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

describe("httpClient", () => {
  beforeEach(() => {
    globalThis.fetch = vi.fn() as unknown as typeof fetch;
    navigateMock.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("throws ApiError on 404 without navigating — transport is side-effect-free", async () => {
    mockFetchOnce(404, { error: "not found" });

    await expect(http.get("/courses/missing")).rejects.toBeInstanceOf(ApiError);
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it.each([403, 500])("throws ApiError on %d without navigating", async (status) => {
    mockFetchOnce(status);

    await expect(http.get("/x")).rejects.toBeInstanceOf(ApiError);
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it("returns parsed JSON on success", async () => {
    const payload = { id: "c1", name: "Course" };
    mockFetchOnce(200, payload);

    const result = await http.get<typeof payload>("/courses/c1");

    expect(result).toEqual(payload);
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it("attaches HTTP status and parsed body to the thrown ApiError", async () => {
    mockFetchOnce(422, { errors: ["bad"] });

    await expect(http.post("/form", { x: 1 })).rejects.toMatchObject({
      status: 422,
      body: { errors: ["bad"] },
    });
  });

  it("401 is escalated by authInterceptor, never navigated by the client", async () => {
    mockFetchOnce(401);

    await expect(http.get("/me")).rejects.toMatchObject({ status: 401 });
    expect(navigateMock).not.toHaveBeenCalled();
  });
});
