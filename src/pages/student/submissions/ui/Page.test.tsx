import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import SubmissionsPage from "./Page";

const hwHook = vi.fn();
const courseHook = vi.fn();
const mySubmissionHook = vi.fn();

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
  initReactI18next: { type: "3rdParty", init: vi.fn() },
}));

vi.mock("@/entities/assignment", () => ({ useAssignment: () => hwHook() }));
vi.mock("@/entities/course", () => ({ useCourse: () => courseHook() }));
vi.mock("@/entities/work", () => ({ useMySubmission: () => mySubmissionHook() }));
vi.mock("@/entities/storage", () => ({
  storageApi: { getDownloadUrl: vi.fn(), triggerDownload: vi.fn() },
}));

vi.mock("@/widgets/app-shell/AppShell.tsx", () => ({
  AppShell: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("@/shared/api", () => ({ http: { get: vi.fn() } }));

function renderPage() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter initialEntries={["/student/courses/c-1/tasks/t-1/submissions"]}>
        <Routes>
          <Route
            path="/student/courses/:courseId/tasks/:taskId/submissions"
            element={<SubmissionsPage />}
          />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

beforeEach(() => {
  hwHook.mockReset();
  courseHook.mockReset();
  mySubmissionHook.mockReset();
  courseHook.mockReturnValue({ data: { id: "c-1", title: "Course" } });
});

describe("SubmissionsPage", () => {
  it("shows the deadline-passed empty state without a submit button when the deadline is in the past and no submission exists", () => {
    hwHook.mockReturnValue({ data: { id: "t-1", title: "Task", dueDate: new Date("2020-01-01") } });
    mySubmissionHook.mockReturnValue({ data: null, isLoading: false, isError: false });
    renderPage();

    expect(screen.getByText(/student\.submissions\.deadlinePassedTitle/)).toBeInTheDocument();
    expect(screen.getByText(/student\.submissions\.deadlinePassedDesc/)).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /student\.submissions\.submitWork/ }),
    ).not.toBeInTheDocument();
  });

  it("shows the submit-work button when the deadline is still open and no submission exists", () => {
    hwHook.mockReturnValue({ data: { id: "t-1", title: "Task", dueDate: new Date("2099-01-01") } });
    mySubmissionHook.mockReturnValue({ data: null, isLoading: false, isError: false });
    renderPage();

    expect(
      screen.getByRole("button", { name: /student\.submissions\.submitWork/ }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/student\.submissions\.deadlinePassedTitle/)).not.toBeInTheDocument();
  });

  it("hides the edit-work button when a submission exists but the deadline has passed", () => {
    hwHook.mockReturnValue({ data: { id: "t-1", title: "Task", dueDate: new Date("2020-01-01") } });
    mySubmissionHook.mockReturnValue({
      data: { id: "sub-1", content: "", files: [] },
      isLoading: false,
      isError: false,
    });
    renderPage();

    expect(
      screen.queryByRole("button", { name: /student\.submissions\.editWork/ }),
    ).not.toBeInTheDocument();
  });
});
