import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ApiError } from "@/shared/api/httpClient";

import { useRedirectOnError } from "./useRedirectOnError";

const redirectForStatus = vi.fn();
vi.mock("@/shared/api/errorRedirect", () => ({
  redirectForStatus: (status: number) => redirectForStatus(status),
}));

beforeEach(() => {
  redirectForStatus.mockReset();
});

describe("useRedirectOnError", () => {
  it("redirects with the status of an ApiError", () => {
    renderHook(() => useRedirectOnError(new ApiError(404, null, "missing")));
    expect(redirectForStatus).toHaveBeenCalledWith(404);
  });

  it("does nothing when there is no error", () => {
    renderHook(() => useRedirectOnError(null));
    expect(redirectForStatus).not.toHaveBeenCalled();
  });

  it("ignores non-ApiError errors", () => {
    renderHook(() => useRedirectOnError(new Error("boom")));
    expect(redirectForStatus).not.toHaveBeenCalled();
  });

  it("re-checks only when the error reference changes", () => {
    const error = new ApiError(403, null, "forbidden");
    const { rerender } = renderHook(({ e }) => useRedirectOnError(e), {
      initialProps: { e: error as unknown },
    });
    rerender({ e: error });
    expect(redirectForStatus).toHaveBeenCalledTimes(1);
  });
});
