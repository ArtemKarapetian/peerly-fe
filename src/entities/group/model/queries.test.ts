import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { createElement, type ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useCreateGroup, useGroupParticipants, useGroupsByCourse } from "./queries";

const repo = vi.hoisted(() => ({
  listForCourse: vi.fn(),
  getParticipants: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
}));

vi.mock("../api/httpRepo", () => ({ groupHttpRepo: repo }));

function makeWrapper() {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return ({ children }: { children: ReactNode }) =>
    createElement(QueryClientProvider, { client: qc }, children);
}

beforeEach(() => {
  Object.values(repo).forEach((m) => m.mockReset());
});

describe("group queries", () => {
  it("useGroupsByCourse fetches the course's groups", async () => {
    repo.listForCourse.mockResolvedValue([{ id: "g-1", name: "A", studentCount: 0 }]);
    const { result } = renderHook(() => useGroupsByCourse("c-1"), { wrapper: makeWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(repo.listForCourse).toHaveBeenCalledWith("c-1");
    expect(result.current.data).toHaveLength(1);
  });

  it("useGroupsByCourse stays idle without a courseId", () => {
    const { result } = renderHook(() => useGroupsByCourse(""), { wrapper: makeWrapper() });
    expect(result.current.fetchStatus).toBe("idle");
    expect(repo.listForCourse).not.toHaveBeenCalled();
  });

  it("useGroupParticipants only fetches once enabled", () => {
    const { result } = renderHook(() => useGroupParticipants("g-1", false), {
      wrapper: makeWrapper(),
    });
    expect(result.current.fetchStatus).toBe("idle");
    expect(repo.getParticipants).not.toHaveBeenCalled();
  });

  it("useCreateGroup invalidates the group list so it refetches", async () => {
    repo.listForCourse.mockResolvedValue([]);
    repo.create.mockResolvedValue({ id: "g-new", name: "New", studentCount: 0 });

    const { result } = renderHook(
      () => ({ list: useGroupsByCourse("c-1"), create: useCreateGroup("c-1") }),
      { wrapper: makeWrapper() },
    );

    await waitFor(() => expect(result.current.list.isSuccess).toBe(true));
    expect(repo.listForCourse).toHaveBeenCalledTimes(1);

    await act(async () => {
      await result.current.create.mutateAsync({ courseId: "c-1", name: "New" });
    });

    expect(repo.create).toHaveBeenCalledWith({ courseId: "c-1", name: "New" });
    await waitFor(() => expect(repo.listForCourse).toHaveBeenCalledTimes(2));
  });
});
