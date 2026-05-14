import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useMySubmission } from "./queries";

const { repoMock } = vi.hoisted(() => ({
  repoMock: {
    getMineForHomework: vi.fn(),
  },
}));

vi.mock("..", () => ({
  workRepo: repoMock,
}));

function wrapper() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
}

beforeEach(() => {
  repoMock.getMineForHomework.mockReset();
});

describe("useMySubmission", () => {
  it("calls repo.getMineForHomework with the homework id", async () => {
    repoMock.getMineForHomework.mockResolvedValueOnce({ id: "sub-1" });
    const { result } = renderHook(() => useMySubmission("hw-1"), { wrapper: wrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(repoMock.getMineForHomework).toHaveBeenCalledWith("hw-1");
  });

  it("stays idle when homeworkId is empty", () => {
    const { result } = renderHook(() => useMySubmission(""), { wrapper: wrapper() });
    expect(result.current.fetchStatus).toBe("idle");
    expect(repoMock.getMineForHomework).not.toHaveBeenCalled();
  });

  it("returns null payload when the repo resolves null", async () => {
    repoMock.getMineForHomework.mockResolvedValueOnce(null);
    const { result } = renderHook(() => useMySubmission("hw-2"), { wrapper: wrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeNull();
  });

  it("exposes the resolved payload", async () => {
    repoMock.getMineForHomework.mockResolvedValueOnce({ id: "sub-7", content: "x" });
    const { result } = renderHook(() => useMySubmission("hw-3"), { wrapper: wrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toMatchObject({ id: "sub-7", content: "x" });
  });
});
