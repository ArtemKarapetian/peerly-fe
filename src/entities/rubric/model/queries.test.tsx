import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { createElement, type PropsWithChildren } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  useCreateRubric,
  useDeleteRubric,
  useRubric,
  useRubrics,
  useUpdateRubric,
} from "./queries";

const { repoMock } = vi.hoisted(() => ({
  repoMock: {
    listMine: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock("../api/httpRepo", () => ({ rubricHttpRepo: repoMock }));

function wrapper() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return function Wrapper({ children }: PropsWithChildren) {
    return createElement(QueryClientProvider, { client }, children);
  };
}

beforeEach(() => {
  Object.values(repoMock).forEach((m) => m.mockReset());
});

describe("rubric queries", () => {
  it("useRubrics calls listMine and returns the data", async () => {
    repoMock.listMine.mockResolvedValueOnce([{ id: "r1", teacherId: "t", name: "A" }]);
    const { result } = renderHook(() => useRubrics(), { wrapper: wrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([{ id: "r1", teacherId: "t", name: "A" }]);
    expect(repoMock.listMine).toHaveBeenCalledTimes(1);
  });

  it("useRubric is disabled until rubricId is provided", () => {
    const { result } = renderHook(() => useRubric(undefined), { wrapper: wrapper() });
    expect(result.current.fetchStatus).toBe("idle");
    expect(repoMock.getById).not.toHaveBeenCalled();
  });

  it("useRubric calls getById when an id is passed", async () => {
    repoMock.getById.mockResolvedValueOnce({
      rubric: { id: "r1", teacherId: "t", name: "A" },
      criteria: [],
    });
    const { result } = renderHook(() => useRubric("r1"), { wrapper: wrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(repoMock.getById).toHaveBeenCalledWith("r1");
  });

  it("useCreateRubric calls repo.create with the input", async () => {
    repoMock.create.mockResolvedValueOnce({ rubricId: "new-1" });
    const { result } = renderHook(() => useCreateRubric(), { wrapper: wrapper() });
    await act(async () => {
      await result.current.mutateAsync({
        name: "X",
        criteria: [{ name: "c", maxScore: 5, commentRequired: false, position: 0 }],
      });
    });
    expect(repoMock.create).toHaveBeenCalledTimes(1);
    expect(repoMock.create.mock.calls[0]![0]!.name).toBe("X");
  });

  it("useUpdateRubric calls repo.update with id+input", async () => {
    repoMock.update.mockResolvedValueOnce(undefined);
    const { result } = renderHook(() => useUpdateRubric(), { wrapper: wrapper() });
    await act(async () => {
      await result.current.mutateAsync({
        rubricId: "r1",
        input: {
          name: "Y",
          criteria: [{ name: "c", maxScore: 5, commentRequired: true, position: 0 }],
        },
      });
    });
    expect(repoMock.update).toHaveBeenCalledTimes(1);
    expect(repoMock.update.mock.calls[0]![0]).toBe("r1");
    expect(repoMock.update.mock.calls[0]![1]!.name).toBe("Y");
  });

  it("useDeleteRubric calls repo.delete with the id", async () => {
    repoMock.delete.mockResolvedValueOnce(undefined);
    const { result } = renderHook(() => useDeleteRubric(), { wrapper: wrapper() });
    await act(async () => {
      await result.current.mutateAsync("r1");
    });
    expect(repoMock.delete).toHaveBeenCalledWith("r1");
  });
});
