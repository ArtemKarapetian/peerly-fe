import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import SubmitWorkPage from "./Page";

const hwHook = vi.fn();
const courseHook = vi.fn();
const mySubmissionHook = vi.fn();

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: "ru" },
  }),
  initReactI18next: { type: "3rdParty", init: vi.fn() },
}));

vi.mock("@/entities/assignment", () => ({ useAssignment: () => hwHook() }));
vi.mock("@/entities/course", () => ({ useCourse: () => courseHook() }));
vi.mock("@/entities/work", () => ({
  useMySubmission: () => mySubmissionHook(),
  workRepo: { create: vi.fn(), update: vi.fn(), delete: vi.fn() },
}));
vi.mock("@/entities/storage", () => ({
  storageApi: { upload: vi.fn(), deleteSubmissionFile: vi.fn(), getDownloadUrl: vi.fn() },
}));

vi.mock("@/widgets/app-shell/AppShell.tsx", () => ({
  AppShell: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("@/features/submission/submit-work/ui/FileUploadArea", () => ({
  FileUploadArea: () => <div data-testid="upload-area" />,
}));
vi.mock("@/features/submission/submit-work/ui/TaskRulesCard", () => ({
  TaskRulesCard: () => <div data-testid="task-rules" />,
}));

function renderPage() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter initialEntries={["/student/courses/c-1/tasks/t-1/submit"]}>
        <Routes>
          <Route
            path="/student/courses/:courseId/tasks/:taskId/submit"
            element={<SubmitWorkPage />}
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
  mySubmissionHook.mockReturnValue({ data: null, isLoading: false });
});

describe("SubmitWorkPage", () => {
  it("shows the deadline-passed banner and no upload area when the deadline is in the past", () => {
    hwHook.mockReturnValue({ data: { id: "t-1", title: "Task", dueDate: new Date("2020-01-01") } });
    renderPage();
    expect(screen.getByText(/page\.submitWork\.deadlinePassedTitle/)).toBeInTheDocument();
    expect(screen.getByText(/page\.submitWork\.deadlinePassedDesc/)).toBeInTheDocument();
    expect(screen.queryByTestId("upload-area")).not.toBeInTheDocument();
  });

  it("shows the upload form when the deadline is still in the future", () => {
    hwHook.mockReturnValue({ data: { id: "t-1", title: "Task", dueDate: new Date("2099-01-01") } });
    renderPage();
    expect(screen.getByTestId("upload-area")).toBeInTheDocument();
    expect(screen.queryByText(/page\.submitWork\.deadlinePassedTitle/)).not.toBeInTheDocument();
  });
});
