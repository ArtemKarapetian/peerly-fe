import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { act, ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  useCourse,
  useCourseParticipants,
  useCourses,
  useCreateCourse,
  useUpdateCourse,
} from "./queries";

const { repoMock } = vi.hoisted(() => ({
  repoMock: {
    getAll: vi.fn(),
    getById: vi.fn(),
    getParticipants: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
}));

vi.mock("..", () => ({
  courseRepo: repoMock,
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

describe("course queries", () => {
  it("useCourses calls repo.getAll", async () => {
    repoMock.getAll.mockResolvedValueOnce([]);
    const { result } = renderHook(() => useCourses(), { wrapper: wrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(repoMock.getAll).toHaveBeenCalled();
  });

  it("useCourse passes the id to the repo", async () => {
    repoMock.getById.mockResolvedValueOnce({ id: "c-1" });
    const { result } = renderHook(() => useCourse("c-1"), { wrapper: wrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(repoMock.getById).toHaveBeenCalledWith("c-1");
  });

  it("useCourse stays idle when id is empty", () => {
    const { result } = renderHook(() => useCourse(""), { wrapper: wrapper() });
    expect(result.current.fetchStatus).toBe("idle");
    expect(repoMock.getById).not.toHaveBeenCalled();
  });

  it("useCourseParticipants calls repo.getParticipants", async () => {
    repoMock.getParticipants.mockResolvedValueOnce({ students: [], teachers: [] });
    const { result } = renderHook(() => useCourseParticipants("c-2"), { wrapper: wrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(repoMock.getParticipants).toHaveBeenCalledWith("c-2");
  });

  it("useCreateCourse triggers repo.create on mutate", async () => {
    repoMock.create.mockResolvedValueOnce({ id: "c-new" });
    const { result } = renderHook(() => useCreateCourse(), { wrapper: wrapper() });

    await act(async () => {
      await result.current.mutateAsync({ title: "New" });
    });

    expect(repoMock.create).toHaveBeenCalledWith({ title: "New" });
  });

  it("useUpdateCourse triggers repo.update with name + description", async () => {
    repoMock.update.mockResolvedValueOnce(undefined);
    const { result } = renderHook(() => useUpdateCourse("c-5"), { wrapper: wrapper() });

    await act(async () => {
      await result.current.mutateAsync({ name: "New", description: "Desc" });
    });

    expect(repoMock.update).toHaveBeenCalledWith("c-5", { name: "New", description: "Desc" });
  });
});
