import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  useAssignment,
  useAssignments,
  useAssignmentsByCourse,
  useTeacherAssignmentDetail,
} from "./queries";

const { repoMock } = vi.hoisted(() => ({
  repoMock: {
    getAll: vi.fn(),
    getByCourse: vi.fn(),
    getById: vi.fn(),
    getTeacherDetail: vi.fn(),
  },
}));

vi.mock("../api/httpRepo", () => ({
  assignmentHttpRepo: repoMock,
}));

function wrapper() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
}

beforeEach(() => {
  repoMock.getAll.mockReset();
  repoMock.getByCourse.mockReset();
  repoMock.getById.mockReset();
  repoMock.getTeacherDetail.mockReset();
});

describe("assignment queries", () => {
  it("useAssignments calls repo.getAll and uses the lists key", async () => {
    repoMock.getAll.mockResolvedValueOnce([]);
    const { result } = renderHook(() => useAssignments(), { wrapper: wrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(repoMock.getAll).toHaveBeenCalled();
    expect(result.current.data).toEqual([]);
  });

  it("useAssignmentsByCourse passes the courseId and stays disabled for empty input", async () => {
    repoMock.getByCourse.mockResolvedValueOnce([{ id: "hw-1" }]);
    const { result } = renderHook(() => useAssignmentsByCourse("c-1"), { wrapper: wrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(repoMock.getByCourse).toHaveBeenCalledWith("c-1");
  });

  it("useAssignmentsByCourse is disabled when courseId is empty", () => {
    const { result } = renderHook(() => useAssignmentsByCourse(""), { wrapper: wrapper() });
    expect(result.current.fetchStatus).toBe("idle");
    expect(repoMock.getByCourse).not.toHaveBeenCalled();
  });

  it("useAssignment calls repo.getById with the homework id", async () => {
    repoMock.getById.mockResolvedValueOnce({ id: "hw-7" });
    const { result } = renderHook(() => useAssignment("hw-7"), { wrapper: wrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(repoMock.getById).toHaveBeenCalledWith("hw-7");
  });

  it("useTeacherAssignmentDetail calls repo.getTeacherDetail", async () => {
    repoMock.getTeacherDetail.mockResolvedValueOnce({
      assignment: { id: "hw-1" },
      submittedCount: 1,
    });
    const { result } = renderHook(() => useTeacherAssignmentDetail("hw-1"), {
      wrapper: wrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(repoMock.getTeacherDetail).toHaveBeenCalledWith("hw-1");
  });
});
