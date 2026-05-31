import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { createElement, type PropsWithChildren } from "react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useDeleteAssignment } from "./useDeleteAssignment";

const { assignmentRepoMock, navigateMock } = vi.hoisted(() => ({
  assignmentRepoMock: { delete: vi.fn() },
  navigateMock: vi.fn(),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (k: string) => k }),
}));

vi.mock("@/entities/assignment", () => ({
  assignmentRepo: assignmentRepoMock,
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return { ...actual, useNavigate: () => navigateMock };
});

function makeWrapper() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: PropsWithChildren) =>
    createElement(MemoryRouter, null, createElement(QueryClientProvider, { client }, children));
}

beforeEach(() => {
  assignmentRepoMock.delete.mockReset();
  navigateMock.mockReset();
  vi.stubGlobal("confirm", () => true);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("useDeleteAssignment", () => {
  it("does nothing when confirm is declined", async () => {
    vi.stubGlobal("confirm", () => false);
    const { result } = renderHook(
      () => useDeleteAssignment({ assignmentId: "a1", courseId: "c1" }),
      { wrapper: makeWrapper() },
    );

    await act(async () => {
      await result.current.handleDelete();
    });

    expect(assignmentRepoMock.delete).not.toHaveBeenCalled();
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it("calls delete and navigates back to course on success", async () => {
    assignmentRepoMock.delete.mockResolvedValue(undefined);
    const { result } = renderHook(
      () => useDeleteAssignment({ assignmentId: "a1", courseId: "c1" }),
      { wrapper: makeWrapper() },
    );

    await act(async () => {
      await result.current.handleDelete();
    });

    expect(assignmentRepoMock.delete).toHaveBeenCalledWith("a1");
    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith("/teacher/courses/c1");
    });
  });

  it("navigates to teacher courses list when no courseId", async () => {
    assignmentRepoMock.delete.mockResolvedValue(undefined);
    const { result } = renderHook(() => useDeleteAssignment({ assignmentId: "a1", courseId: "" }), {
      wrapper: makeWrapper(),
    });

    await act(async () => {
      await result.current.handleDelete();
    });

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith("/teacher/courses");
    });
  });

  it("sets deleteError and unsets deleting on failure", async () => {
    assignmentRepoMock.delete.mockRejectedValue(new Error("boom"));
    const { result } = renderHook(
      () => useDeleteAssignment({ assignmentId: "a1", courseId: "c1" }),
      { wrapper: makeWrapper() },
    );

    await act(async () => {
      await result.current.handleDelete();
    });

    expect(result.current.deleteError).toBeTruthy();
    expect(result.current.deleting).toBe(false);
    expect(navigateMock).not.toHaveBeenCalled();
  });
});
