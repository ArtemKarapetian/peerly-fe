import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Course } from "@/entities/course";

import { TeacherCourseSettings } from "./Settings";

const { courseRepoMock, toastMock } = vi.hoisted(() => ({
  courseRepoMock: { update: vi.fn() },
  toastMock: { success: vi.fn(), error: vi.fn() },
}));

vi.mock("@/entities/course/api/httpRepo", () => ({
  courseHttpRepo: courseRepoMock,
}));

vi.mock("sonner", () => ({ toast: toastMock }));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key, i18n: { language: "en" } }),
}));

function wrap(children: ReactNode) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
}

const course: Course = {
  id: "c-1",
  name: "Algebra",
  description: "Linear algebra basics",
  teachers: [],
  enrollmentCount: 0,
  homeworkCount: 0,
  status: "active",
  backendStatus: "inProgress",
  archived: false,
};

beforeEach(() => {
  courseRepoMock.update.mockReset();
  toastMock.success.mockReset();
  toastMock.error.mockReset();
});

describe("TeacherCourseSettings", () => {
  it("disables Save when nothing has changed", () => {
    render(wrap(<TeacherCourseSettings course={course} />));
    expect(screen.getByRole("button", { name: /saveChanges/ })).toBeDisabled();
  });

  it("enables Save once the name changes and calls update with trimmed values", async () => {
    const user = userEvent.setup();
    courseRepoMock.update.mockResolvedValueOnce(undefined);
    render(wrap(<TeacherCourseSettings course={course} />));

    const nameInput = screen.getByDisplayValue("Algebra");
    await user.clear(nameInput);
    await user.type(nameInput, "  Algebra II  ");

    const saveBtn = screen.getByRole("button", { name: /saveChanges/ });
    expect(saveBtn).not.toBeDisabled();
    await user.click(saveBtn);

    await waitFor(() => {
      expect(courseRepoMock.update).toHaveBeenCalledWith("c-1", {
        name: "Algebra II",
        description: "Linear algebra basics",
      });
      expect(toastMock.success).toHaveBeenCalled();
    });
  });

  it("omits description from the payload when emptied out", async () => {
    const user = userEvent.setup();
    courseRepoMock.update.mockResolvedValueOnce(undefined);
    render(wrap(<TeacherCourseSettings course={course} />));

    const descInput = screen.getByDisplayValue("Linear algebra basics");
    await user.clear(descInput);

    await user.click(screen.getByRole("button", { name: /saveChanges/ }));
    await waitFor(() => {
      expect(courseRepoMock.update).toHaveBeenCalledWith("c-1", {
        name: "Algebra",
        description: undefined,
      });
    });
  });

  it("keeps Save disabled when the name is blanked out", async () => {
    const user = userEvent.setup();
    render(wrap(<TeacherCourseSettings course={course} />));

    await user.clear(screen.getByDisplayValue("Algebra"));
    expect(screen.getByRole("button", { name: /saveChanges/ })).toBeDisabled();
  });

  it("surfaces backend errors via toast", async () => {
    const user = userEvent.setup();
    courseRepoMock.update.mockRejectedValueOnce(new Error("network"));
    render(wrap(<TeacherCourseSettings course={course} />));

    await user.type(screen.getByDisplayValue("Algebra"), "!");
    await user.click(screen.getByRole("button", { name: /saveChanges/ }));

    await waitFor(() => {
      expect(toastMock.error).toHaveBeenCalled();
      expect(toastMock.success).not.toHaveBeenCalled();
    });
  });
});
