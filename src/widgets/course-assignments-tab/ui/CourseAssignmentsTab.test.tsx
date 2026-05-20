import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { DemoAssignment } from "@/entities/assignment/model/types";

import { CourseAssignmentsTab } from "./CourseAssignmentsTab";

const useAssignmentsByCourseMock = vi.fn();
const getMineSubmissionIdMock = vi.fn();

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key, i18n: { language: "ru" } }),
  initReactI18next: { type: "3rdParty", init: vi.fn() },
}));

vi.mock("@/entities/assignment", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/entities/assignment")>();
  return { ...actual, useAssignmentsByCourse: () => useAssignmentsByCourseMock() };
});

vi.mock("@/entities/work", () => ({
  workRepo: { getMineSubmissionId: (id: string) => getMineSubmissionIdMock(id) },
}));

function assignment(
  id: string,
  title: string,
  daysFromNow: number,
  backendStatus: DemoAssignment["backendStatus"] = "published",
): DemoAssignment {
  return {
    id,
    courseId: "c-1",
    title,
    description: "",
    dueDate: new Date(Date.now() + daysFromNow * 24 * 60 * 60 * 1000),
    reviewCount: 0,
    status: "published",
    backendStatus,
  };
}

function renderTab() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter>
        <CourseAssignmentsTab courseId="c-1" />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

beforeEach(() => {
  useAssignmentsByCourseMock.mockReset();
  getMineSubmissionIdMock.mockReset();
});

describe("CourseAssignmentsTab", () => {
  it("marks an assignment as SUBMITTED when the student has a submission", async () => {
    useAssignmentsByCourseMock.mockReturnValue({
      data: [assignment("a-1", "Future task", 5)],
      isLoading: false,
    });
    getMineSubmissionIdMock.mockResolvedValue("sub-1");
    renderTab();

    await waitFor(() => {
      expect(screen.getByText(/entity\.assignment\.statusSubmitted/)).toBeInTheDocument();
    });
  });

  it("marks an open assignment without a submission as NOT_STARTED", async () => {
    useAssignmentsByCourseMock.mockReturnValue({
      data: [assignment("a-1", "Future task", 5)],
      isLoading: false,
    });
    getMineSubmissionIdMock.mockResolvedValue(null);
    renderTab();

    await waitFor(() => {
      expect(screen.getByText(/entity\.assignment\.statusNotStarted/)).toBeInTheDocument();
    });
  });

  it("marks a past-deadline assignment without a submission as OVERDUE", async () => {
    useAssignmentsByCourseMock.mockReturnValue({
      data: [assignment("a-1", "Past task", -1)],
      isLoading: false,
    });
    getMineSubmissionIdMock.mockResolvedValue(null);
    renderTab();

    await waitFor(() => {
      expect(screen.getByText(/entity\.assignment\.statusOverdue/)).toBeInTheDocument();
    });
  });
});
