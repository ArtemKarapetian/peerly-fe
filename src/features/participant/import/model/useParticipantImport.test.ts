import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { createElement, type PropsWithChildren } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useParticipantImport } from "./useParticipantImport";

function makeWrapper() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return function Wrapper({ children }: PropsWithChildren) {
    return createElement(QueryClientProvider, { client }, children);
  };
}

const { groupRepoMock, courseRepoMock, userRepoMock } = vi.hoisted(() => ({
  groupRepoMock: {
    listForCourse: vi.fn(),
    addStudents: vi.fn(),
  },
  courseRepoMock: { getParticipants: vi.fn() },
  userRepoMock: { searchStudents: vi.fn() },
}));

vi.mock("@/entities/group", () => ({ groupRepo: groupRepoMock }));
vi.mock("@/entities/course", () => ({ courseRepo: courseRepoMock }));
vi.mock("@/entities/user", () => ({ userRepo: userRepoMock }));

vi.mock("@/shared/lib/useDebouncedValue", () => ({
  useDebouncedValue: (value: unknown) => value,
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    i18n: { language: "en" },
    t: (key: string, opts?: Record<string, unknown>) =>
      opts && "count" in opts ? `${key}:${String(opts.count)}` : key,
  }),
}));

beforeEach(() => {
  groupRepoMock.listForCourse.mockReset();
  groupRepoMock.addStudents.mockReset();
  courseRepoMock.getParticipants.mockReset();
  userRepoMock.searchStudents.mockReset();

  groupRepoMock.listForCourse.mockResolvedValue([{ id: "g-1", name: "Group A" }]);
  courseRepoMock.getParticipants.mockResolvedValue({ students: [], teachers: [] });
  userRepoMock.searchStudents.mockResolvedValue([]);
});

describe("useParticipantImport", () => {
  it("loads groups for the course and picks the first group as default", async () => {
    const { result } = renderHook(() => useParticipantImport("c-1"), { wrapper: makeWrapper() });

    await waitFor(() => {
      expect(result.current.selectedGroupId).toBe("g-1");
    });
    expect(groupRepoMock.listForCourse).toHaveBeenCalledWith("c-1");
    expect(result.current.groups).toEqual([{ id: "g-1", name: "Group A" }]);
  });

  it("excludes participants already in the course from the candidate list", async () => {
    courseRepoMock.getParticipants.mockResolvedValue({
      students: [{ studentId: "u-2", name: "Bob", email: "b@x" }],
      teachers: [],
    });
    userRepoMock.searchStudents.mockResolvedValue([
      { id: "u-1", name: "Alice", email: "a@x" },
      { id: "u-2", name: "Bob", email: "b@x" },
    ]);

    const { result } = renderHook(() => useParticipantImport("c-1"), { wrapper: makeWrapper() });
    act(() => result.current.setQuery("abc"));

    await waitFor(() => {
      expect(result.current.candidates).toEqual([{ id: "u-1", name: "Alice", email: "a@x" }]);
    });
  });

  it("toggles selection on and off without losing other selections", async () => {
    userRepoMock.searchStudents.mockResolvedValue([
      { id: "u-1", name: "Alice", email: "a@x" },
      { id: "u-3", name: "Carol", email: "c@x" },
    ]);

    const { result } = renderHook(() => useParticipantImport("c-1"), { wrapper: makeWrapper() });
    act(() => result.current.setQuery("abc"));
    await waitFor(() => expect(result.current.candidates).toHaveLength(2));

    act(() => result.current.toggleSelected("u-1"));
    act(() => result.current.toggleSelected("u-3"));
    expect(result.current.selectedIds.has("u-1")).toBe(true);
    expect(result.current.selectedIds.has("u-3")).toBe(true);

    act(() => result.current.toggleSelected("u-1"));
    expect(result.current.selectedIds.has("u-1")).toBe(false);
    expect(result.current.selectedIds.has("u-3")).toBe(true);
  });

  it("canSubmit is false until a student is picked and a group exists", async () => {
    userRepoMock.searchStudents.mockResolvedValue([{ id: "u-1", name: "Alice", email: "a@x" }]);
    const { result } = renderHook(() => useParticipantImport("c-1"), { wrapper: makeWrapper() });
    act(() => result.current.setQuery("abc"));
    await waitFor(() => expect(result.current.candidates).toHaveLength(1));

    expect(result.current.canSubmit).toBe(false);
    act(() => result.current.toggleSelected("u-1"));
    expect(result.current.canSubmit).toBe(true);
  });
});
