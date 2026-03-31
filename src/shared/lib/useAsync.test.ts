import { renderHook, waitFor, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import { useAsync } from "./useAsync";

describe("useAsync", () => {
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

    // Trigger a refetch before the first request resolves
    act(() => {
      result.current.refetch();
    });

    // Resolve the second (newer) request first
    act(() => {
      resolveSecond!("second");
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(result.current.data).toBe("second");

    // Now resolve the first (stale) request — it should be ignored
    act(() => {
      resolveFirst!("first");
    });

    expect(result.current.data).toBe("second");
  });
});
