import { renderHook, waitFor, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { ApiError } from "@/shared/api/httpClient";

import { useAsync } from "./useAsync";

const navigateMock = vi.fn();

vi.mock("@/shared/lib/navigate", () => ({
  appNavigate: (to: string) => {
    navigateMock(to);
  },
}));

describe("useAsync", () => {
  beforeEach(() => {
    navigateMock.mockReset();
  });

  it("starts in loading state with no data and no error", () => {
    const fn = vi.fn(() => new Promise<string>(() => {})); // never resolves
    const { result } = renderHook(() => useAsync(fn));

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it("returns data after successful fetch", async () => {
    const fn = vi.fn(() => Promise.resolve("hello"));
    const { result } = renderHook(() => useAsync(fn));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toBe("hello");
    expect(result.current.error).toBeNull();
  });

  it("sets error when promise rejects with an Error", async () => {
    const err = new Error("boom");
    const fn = vi.fn(() => Promise.reject(err));
    const { result } = renderHook(() => useAsync(fn));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBe(err);
  });

  it("wraps non-Error rejection values in an Error", async () => {
    // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
    const fn = vi.fn(() => Promise.reject("string error"));
    const { result } = renderHook(() => useAsync(fn));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error!.message).toBe("string error");
  });

  it("refetches data when refetch is called", async () => {
    let callCount = 0;
    const fn = vi.fn(() => Promise.resolve(`result-${++callCount}`));
    const { result } = renderHook(() => useAsync(fn));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(result.current.data).toBe("result-1");

    act(() => {
      result.current.refetch();
    });

    await waitFor(() => {
      expect(result.current.data).toBe("result-2");
    });
    expect(result.current.isLoading).toBe(false);
  });

  it("ignores stale responses (race condition protection)", async () => {
    let resolveFirst: (v: string) => void;
    let resolveSecond: (v: string) => void;

    const firstPromise = new Promise<string>((r) => {
      resolveFirst = r;
    });
    const secondPromise = new Promise<string>((r) => {
      resolveSecond = r;
    });

    const fn = vi.fn().mockReturnValueOnce(firstPromise).mockReturnValueOnce(secondPromise);

    const { result } = renderHook(() => useAsync(fn));

    act(() => {
      result.current.refetch();
    });

    act(() => {
      resolveSecond!("second");
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(result.current.data).toBe("second");

    act(() => {
      resolveFirst!("first");
    });

    expect(result.current.data).toBe("second");
  });

  describe("onError: 'redirect'", () => {
    it("navigates to /404 on ApiError status 404", async () => {
      const fn = vi.fn(() => Promise.reject(new ApiError(404, null, "nope")));

      const { result } = renderHook(() => useAsync(fn, [], { onError: "redirect" }));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(navigateMock).toHaveBeenCalledWith("/404");
      expect(result.current.error).toBeNull();
    });

    it("navigates to /403 on ApiError status 403", async () => {
      const fn = vi.fn(() => Promise.reject(new ApiError(403, null, "forbidden")));

      const { result } = renderHook(() => useAsync(fn, [], { onError: "redirect" }));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(navigateMock).toHaveBeenCalledWith("/403");
    });

    it("navigates to /500 on ApiError status 500", async () => {
      const fn = vi.fn(() => Promise.reject(new ApiError(500, null, "boom")));

      const { result } = renderHook(() => useAsync(fn, [], { onError: "redirect" }));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(navigateMock).toHaveBeenCalledWith("/500");
    });

    it("does NOT redirect on non-redirectable ApiError", async () => {
      const err = new ApiError(422, { errors: ["bad"] }, "unprocessable");
      const fn = vi.fn(() => Promise.reject(err));

      const { result } = renderHook(() => useAsync(fn, [], { onError: "redirect" }));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(navigateMock).not.toHaveBeenCalled();
      expect(result.current.error).toBe(err);
    });

    it("does NOT redirect on non-ApiError rejection", async () => {
      const err = new Error("network down");
      const fn = vi.fn(() => Promise.reject(err));

      const { result } = renderHook(() => useAsync(fn, [], { onError: "redirect" }));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(navigateMock).not.toHaveBeenCalled();
      expect(result.current.error).toBe(err);
    });
  });

  describe("onError: 'inline' (default)", () => {
    it("does NOT redirect on ApiError 404 — exposes via error instead", async () => {
      const err = new ApiError(404, null, "nope");
      const fn = vi.fn(() => Promise.reject(err));

      const { result } = renderHook(() => useAsync(fn));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(navigateMock).not.toHaveBeenCalled();
      expect(result.current.error).toBe(err);
    });
  });
});
