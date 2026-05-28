import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useCourseGroups } from "./useCourseGroups";

const { groupRepoMock, toastMock } = vi.hoisted(() => ({
  groupRepoMock: {
    listForCourse: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  toastMock: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("@/entities/group", () => ({ groupRepo: groupRepoMock }));

vi.mock("sonner", () => ({ toast: toastMock }));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    i18n: { language: "en" },
    t: (key: string) => key,
  }),
}));

beforeEach(() => {
  groupRepoMock.listForCourse.mockReset();
  groupRepoMock.create.mockReset();
  groupRepoMock.update.mockReset();
  groupRepoMock.delete.mockReset();
  toastMock.success.mockReset();
  toastMock.error.mockReset();

  groupRepoMock.listForCourse.mockResolvedValue([]);
});

const groupB = { id: "g-b", name: "Бета", studentCount: 3 };
const groupA = { id: "g-a", name: "Альфа", studentCount: 5 };

describe("useCourseGroups", () => {
  it("loads groups for the course and sorts alphabetically (ru)", async () => {
    groupRepoMock.listForCourse.mockResolvedValue([groupB, groupA]);

    const { result } = renderHook(() => useCourseGroups({ courseId: "c-1" }));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(groupRepoMock.listForCourse).toHaveBeenCalledWith("c-1");
    expect(result.current.groups.map((g) => g.name)).toEqual(["Альфа", "Бета"]);
  });

  it("totalStudents sums studentCount across groups", async () => {
    groupRepoMock.listForCourse.mockResolvedValue([groupA, groupB]);

    const { result } = renderHook(() => useCourseGroups({ courseId: "c-1" }));

    await waitFor(() => {
      expect(result.current.totalStudents).toBe(8);
    });
  });

  describe("createGroup", () => {
    it("trims, calls repo, refetches, toasts success, returns true", async () => {
      groupRepoMock.create.mockResolvedValue(undefined);
      const { result } = renderHook(() => useCourseGroups({ courseId: "c-1" }));
      await waitFor(() => expect(result.current.isLoading).toBe(false));
      groupRepoMock.listForCourse.mockClear();

      let ok = false;
      await act(async () => {
        ok = await result.current.createGroup("  New Group  ");
      });

      expect(ok).toBe(true);
      expect(groupRepoMock.create).toHaveBeenCalledWith({ courseId: "c-1", name: "New Group" });
      expect(groupRepoMock.listForCourse).toHaveBeenCalledTimes(1);
      expect(toastMock.success).toHaveBeenCalled();
      expect(toastMock.error).not.toHaveBeenCalled();
    });

    it("returns false and does NOT call repo when name is blank", async () => {
      const { result } = renderHook(() => useCourseGroups({ courseId: "c-1" }));
      await waitFor(() => expect(result.current.isLoading).toBe(false));

      let ok = true;
      await act(async () => {
        ok = await result.current.createGroup("   ");
      });

      expect(ok).toBe(false);
      expect(groupRepoMock.create).not.toHaveBeenCalled();
    });

    it("returns false and toasts error when repo throws", async () => {
      groupRepoMock.create.mockRejectedValue(new Error("boom"));
      const { result } = renderHook(() => useCourseGroups({ courseId: "c-1" }));
      await waitFor(() => expect(result.current.isLoading).toBe(false));

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
    it("trims, calls update, refetches, returns true", async () => {
      groupRepoMock.update.mockResolvedValue(undefined);
      groupRepoMock.listForCourse.mockResolvedValue([groupA]);
      const { result } = renderHook(() => useCourseGroups({ courseId: "c-1" }));
      await waitFor(() => expect(result.current.isLoading).toBe(false));
      groupRepoMock.listForCourse.mockClear();

      let ok = false;
      await act(async () => {
        ok = await result.current.renameGroup(groupA, "  Альфа+  ");
      });

      expect(ok).toBe(true);
      expect(groupRepoMock.update).toHaveBeenCalledWith("g-a", { name: "Альфа+" });
      expect(groupRepoMock.listForCourse).toHaveBeenCalledTimes(1);
      expect(toastMock.success).toHaveBeenCalled();
    });

    it("returns false without calling repo when name unchanged after trim", async () => {
      const { result } = renderHook(() => useCourseGroups({ courseId: "c-1" }));
      await waitFor(() => expect(result.current.isLoading).toBe(false));

      let ok = true;
      await act(async () => {
        ok = await result.current.renameGroup(groupA, "  Альфа  ");
      });

      expect(ok).toBe(false);
      expect(groupRepoMock.update).not.toHaveBeenCalled();
    });

    it("returns false and toasts error when repo throws", async () => {
      groupRepoMock.update.mockRejectedValue(new Error("nope"));
      const { result } = renderHook(() => useCourseGroups({ courseId: "c-1" }));
      await waitFor(() => expect(result.current.isLoading).toBe(false));

      let ok = true;
      await act(async () => {
        ok = await result.current.renameGroup(groupA, "Other");
      });

      expect(ok).toBe(false);
      expect(toastMock.error).toHaveBeenCalled();
    });
  });

  describe("deleteGroup", () => {
    it("calls delete, refetches, toasts success, returns true", async () => {
      groupRepoMock.delete.mockResolvedValue(undefined);
      groupRepoMock.listForCourse.mockResolvedValue([groupA]);
      const { result } = renderHook(() => useCourseGroups({ courseId: "c-1" }));
      await waitFor(() => expect(result.current.isLoading).toBe(false));
      groupRepoMock.listForCourse.mockClear();

      let ok = false;
      await act(async () => {
        ok = await result.current.deleteGroup(groupA);
      });

      expect(ok).toBe(true);
      expect(groupRepoMock.delete).toHaveBeenCalledWith("g-a");
      expect(groupRepoMock.listForCourse).toHaveBeenCalledTimes(1);
      expect(toastMock.success).toHaveBeenCalled();
    });

    it("returns false and toasts error when repo throws", async () => {
      groupRepoMock.delete.mockRejectedValue(new Error("forbidden"));
      const { result } = renderHook(() => useCourseGroups({ courseId: "c-1" }));
      await waitFor(() => expect(result.current.isLoading).toBe(false));

      let ok = true;
      await act(async () => {
        ok = await result.current.deleteGroup(groupA);
      });

      expect(ok).toBe(false);
      expect(toastMock.error).toHaveBeenCalled();
    });
  });

  describe("pendingDelete state", () => {
    it("setPendingDelete updates and clears the pending group", async () => {
      const { result } = renderHook(() => useCourseGroups({ courseId: "c-1" }));
      await waitFor(() => expect(result.current.isLoading).toBe(false));

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
