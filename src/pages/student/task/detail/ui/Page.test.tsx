import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ApiError } from "@/shared/api";

import TaskPage from "./Page";

const assignmentHook = vi.fn();
const courseHook = vi.fn();
const submissionHook = vi.fn();

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key, i18n: { language: "ru" } }),
  initReactI18next: { type: "3rdParty", init: vi.fn() },
}));

vi.mock("@/entities/assignment", () => ({ useAssignment: () => assignmentHook() }));
vi.mock("@/entities/course", () => ({ useCourse: () => courseHook() }));
vi.mock("@/entities/work", () => ({ useMySubmission: () => submissionHook() }));

vi.mock("@/widgets/app-shell", () => ({
  AppShell: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("@/widgets/task-detail", () => ({
  TaskHeader: ({ title }: { title: string }) => <h1>{title}</h1>,
  TaskDescription: () => <div data-testid="task-description" />,
  TaskRubric: () => <div data-testid="task-rubric" />,
  TaskSidebar: () => <div data-testid="task-sidebar" />,
}));

function renderPage() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter initialEntries={["/student/courses/c-1/tasks/t-1"]}>
        <Routes>
          <Route path="/student/courses/:courseId/tasks/:taskId" element={<TaskPage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

beforeEach(() => {
  assignmentHook.mockReset();
  courseHook.mockReset();
  submissionHook.mockReset();
  courseHook.mockReturnValue({ data: { id: "c-1", name: "Course" } });
  submissionHook.mockReturnValue({ data: undefined });
});

describe("TaskPage", () => {
  it("shows a skeleton while the assignment is loading", () => {
    assignmentHook.mockReturnValue({ data: undefined, isLoading: true, error: null });
    renderPage();

    expect(screen.getByTestId("page-skeleton")).toBeInTheDocument();
    expect(screen.queryByTestId("task-sidebar")).not.toBeInTheDocument();
  });

  it("shows the not-found view for a 404, not the error banner", () => {
    assignmentHook.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new ApiError(404, null, "missing"),
    });
    renderPage();

    expect(screen.getAllByText(/student\.task\.notFound/).length).toBeGreaterThan(0);
    expect(
      screen.queryByRole("button", { name: /shared\.errorBanner\.retry/ }),
    ).not.toBeInTheDocument();
    expect(screen.queryByTestId("page-skeleton")).not.toBeInTheDocument();
  });

  it("shows a retryable error banner for a non-404 error and refetches on retry", () => {
    const refetch = vi.fn();
    assignmentHook.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new ApiError(500, null, "boom"),
      refetch,
    });
    renderPage();

    const retry = screen.getByRole("button", { name: /shared\.errorBanner\.retry/ });
    expect(retry).toBeInTheDocument();
    expect(screen.queryByText(/student\.task\.notFound/)).not.toBeInTheDocument();

    fireEvent.click(retry);
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("renders the task once the assignment has loaded", () => {
    assignmentHook.mockReturnValue({
      data: { id: "t-1", title: "My Task", description: "desc", rubricId: null, reviewCount: 0 },
      isLoading: false,
      error: null,
    });
    renderPage();

    expect(screen.getByRole("heading", { name: "My Task" })).toBeInTheDocument();
    expect(screen.getByTestId("task-description")).toBeInTheDocument();
    expect(screen.queryByTestId("page-skeleton")).not.toBeInTheDocument();
  });
});
