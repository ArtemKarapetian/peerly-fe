import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useCourseGroups } from "./useCourseGroups";

const {
  useGroupsByCourseMock,
  createMutateAsync,
  updateMutateAsync,
  deleteMutateAsync,
  toastMock,
} = vi.hoisted(() => ({
  useGroupsByCourseMock: vi.fn(),
  createMutateAsync: vi.fn(),
  updateMutateAsync: vi.fn(),
  deleteMutateAsync: vi.fn(),
  toastMock: { success: vi.fn(), error: vi.fn() },
}));

vi.mock("@/entities/group", () => ({
  useGroupsByCourse: () => useGroupsByCourseMock(),
  useCreateGroup: () => ({ mutateAsync: createMutateAsync }),
  useUpdateGroup: () => ({ mutateAsync: updateMutateAsync }),
  useDeleteGroup: () => ({ mutateAsync: deleteMutateAsync }),
}));

vi.mock("sonner", () => ({ toast: toastMock }));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    i18n: { language: "en" },
    t: (key: string) => key,
  }),
}));

const groupB = { id: "g-b", name: "Бета", studentCount: 3 };
const groupA = { id: "g-a", name: "Альфа", studentCount: 5 };

function mockGroups(data: unknown[]) {
  useGroupsByCourseMock.mockReturnValue({
    data,
    isLoading: false,
    error: null,
    refetch: vi.fn(),
  });
}

beforeEach(() => {
  useGroupsByCourseMock.mockReset();
  createMutateAsync.mockReset();
  updateMutateAsync.mockReset();
  deleteMutateAsync.mockReset();
  toastMock.success.mockReset();
  toastMock.error.mockReset();
  mockGroups([]);
});

describe("useCourseGroups", () => {
  it("sorts groups alphabetically (ru)", () => {
    mockGroups([groupB, groupA]);
    const { result } = renderHook(() => useCourseGroups({ courseId: "c-1" }));
    expect(result.current.groups.map((g) => g.name)).toEqual(["Альфа", "Бета"]);
  });

  it("totalStudents sums studentCount across groups", () => {
    mockGroups([groupA, groupB]);
    const { result } = renderHook(() => useCourseGroups({ courseId: "c-1" }));
    expect(result.current.totalStudents).toBe(8);
  });

  describe("createGroup", () => {
    it("trims, calls the create mutation, toasts success, returns true", async () => {
      createMutateAsync.mockResolvedValue(undefined);
      const { result } = renderHook(() => useCourseGroups({ courseId: "c-1" }));

      let ok = false;
      await act(async () => {
        ok = await result.current.createGroup("  New Group  ");
      });

      expect(ok).toBe(true);
      expect(createMutateAsync).toHaveBeenCalledWith({ courseId: "c-1", name: "New Group" });
      expect(toastMock.success).toHaveBeenCalled();
      expect(toastMock.error).not.toHaveBeenCalled();
    });

    it("returns false and does NOT call the mutation when name is blank", async () => {
      const { result } = renderHook(() => useCourseGroups({ courseId: "c-1" }));

      let ok = true;
      await act(async () => {
        ok = await result.current.createGroup("   ");
      });

      expect(ok).toBe(false);
      expect(createMutateAsync).not.toHaveBeenCalled();
    });

    it("returns false and toasts error when the mutation throws", async () => {
      createMutateAsync.mockRejectedValue(new Error("boom"));
      const { result } = renderHook(() => useCourseGroups({ courseId: "c-1" }));

      let ok = true;
      await act(async () => {
        ok = await result.current.createGroup("X");
      });

      expect(ok).toBe(false);
      expect(toastMock.error).toHaveBeenCalled();
      expect(toastMock.success).not.toHaveBeenCalled();
    });
  });

  describe("renameGroup", () => {
    it("trims, calls the update mutation, returns true", async () => {
      updateMutateAsync.mockResolvedValue(undefined);
      const { result } = renderHook(() => useCourseGroups({ courseId: "c-1" }));

      let ok = false;
      await act(async () => {
        ok = await result.current.renameGroup(groupA, "  Альфа+  ");
      });

      expect(ok).toBe(true);
      expect(updateMutateAsync).toHaveBeenCalledWith({
        groupId: "g-a",
        input: { name: "Альфа+" },
      });
      expect(toastMock.success).toHaveBeenCalled();
    });

    it("returns false without calling the mutation when name unchanged after trim", async () => {
      const { result } = renderHook(() => useCourseGroups({ courseId: "c-1" }));

      let ok = true;
      await act(async () => {
        ok = await result.current.renameGroup(groupA, "  Альфа  ");
      });

      expect(ok).toBe(false);
      expect(updateMutateAsync).not.toHaveBeenCalled();
    });

    it("returns false and toasts error when the mutation throws", async () => {
      updateMutateAsync.mockRejectedValue(new Error("nope"));
      const { result } = renderHook(() => useCourseGroups({ courseId: "c-1" }));

      let ok = true;
      await act(async () => {
        ok = await result.current.renameGroup(groupA, "Other");
      });

      expect(ok).toBe(false);
      expect(toastMock.error).toHaveBeenCalled();
    });
  });

  describe("deleteGroup", () => {
    it("calls the delete mutation, toasts success, returns true", async () => {
      deleteMutateAsync.mockResolvedValue(undefined);
      const { result } = renderHook(() => useCourseGroups({ courseId: "c-1" }));

      let ok = false;
      await act(async () => {
        ok = await result.current.deleteGroup(groupA);
      });

      expect(ok).toBe(true);
      expect(deleteMutateAsync).toHaveBeenCalledWith("g-a");
      expect(toastMock.success).toHaveBeenCalled();
    });

    it("returns false and toasts error when the mutation throws", async () => {
      deleteMutateAsync.mockRejectedValue(new Error("forbidden"));
      const { result } = renderHook(() => useCourseGroups({ courseId: "c-1" }));

      let ok = true;
      await act(async () => {
        ok = await result.current.deleteGroup(groupA);
      });

      expect(ok).toBe(false);
      expect(toastMock.error).toHaveBeenCalled();
    });
  });

  describe("pendingDelete state", () => {
    it("setPendingDelete updates and clears the pending group", () => {
      const { result } = renderHook(() => useCourseGroups({ courseId: "c-1" }));

      expect(result.current.pendingDelete).toBeNull();

      act(() => {
        result.current.setPendingDelete(groupA);
      });
      expect(result.current.pendingDelete).toEqual(groupA);

      act(() => {
        result.current.setPendingDelete(null);
      });
      expect(result.current.pendingDelete).toBeNull();
    });
  });
});
