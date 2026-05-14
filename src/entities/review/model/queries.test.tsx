import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { act, ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useAssignedSubmission, useSubmitReview, useSubmittedReview } from "./queries";

const { repoMock } = vi.hoisted(() => ({
  repoMock: {
    getAssignedSubmission: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
  },
}));

vi.mock("../api/httpRepo", () => ({
  reviewHttpRepo: repoMock,
}));

function wrapper() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
}

beforeEach(() => {
  Object.values(repoMock).forEach((fn) => fn.mockReset());
});

describe("review queries", () => {
  it("useAssignedSubmission calls repo with the id", async () => {
    repoMock.getAssignedSubmission.mockResolvedValueOnce({ id: "sub-1" });
    const { result } = renderHook(() => useAssignedSubmission("sub-1"), { wrapper: wrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(repoMock.getAssignedSubmission).toHaveBeenCalledWith("sub-1");
  });

  it("useAssignedSubmission stays idle when id is empty", () => {
    const { result } = renderHook(() => useAssignedSubmission(""), { wrapper: wrapper() });
    expect(result.current.fetchStatus).toBe("idle");
  });

  it("useSubmittedReview stays idle for null id", () => {
    const { result } = renderHook(() => useSubmittedReview(null), { wrapper: wrapper() });
    expect(result.current.fetchStatus).toBe("idle");
    expect(repoMock.getById).not.toHaveBeenCalled();
  });

  it("useSubmittedReview calls repo.getById with the id", async () => {
    repoMock.getById.mockResolvedValueOnce({ id: "r-1" });
    const { result } = renderHook(() => useSubmittedReview("r-1"), { wrapper: wrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(repoMock.getById).toHaveBeenCalledWith("r-1");
  });

  it("useSubmitReview invokes repo.create with mark+comment", async () => {
    repoMock.create.mockResolvedValueOnce({ reviewId: "r-new" });
    const { result } = renderHook(() => useSubmitReview(), { wrapper: wrapper() });

    await act(async () => {
      await result.current.mutateAsync({ submissionId: "sub-1", mark: 8, comment: "ok" });
    });

    expect(repoMock.create).toHaveBeenCalledWith("sub-1", 8, "ok");
  });
});
