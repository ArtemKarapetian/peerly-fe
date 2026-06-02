import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import TeacherSubmissionsPage from "./Page";

const { assignmentRepoMock, workRepoMock, courseRepoMock, storageApiMock } = vi.hoisted(() => ({
  assignmentRepoMock: { getByCourse: vi.fn(), getById: vi.fn() },
  workRepoMock: { listForHomework: vi.fn() },
  courseRepoMock: { getAll: vi.fn() },
  storageApiMock: { getDownloadUrl: vi.fn(), triggerDownload: vi.fn() },
}));

vi.mock("@/entities/assignment/api/httpRepo", () => ({ assignmentHttpRepo: assignmentRepoMock }));
vi.mock("@/entities/work/api/httpRepo", () => ({ workHttpRepo: workRepoMock }));
vi.mock("@/entities/course/api/httpRepo", () => ({ courseHttpRepo: courseRepoMock }));
vi.mock("@/entities/storage", () => ({ storageApi: storageApiMock }));

vi.mock("@/widgets/app-shell", () => ({
  AppShell: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

beforeEach(() => {
  [
    assignmentRepoMock.getByCourse,
    assignmentRepoMock.getById,
    workRepoMock.listForHomework,
    courseRepoMock.getAll,
  ].forEach((m) => m.mockReset());
});

function setupCourseAndAssignments() {
  courseRepoMock.getAll.mockResolvedValue([
    { id: "c-1", title: "Algebra" },
    { id: "c-2", title: "Geometry" },
  ]);
  assignmentRepoMock.getByCourse.mockResolvedValue([
    {
      id: "a-1",
      courseId: "c-1",
      title: "Essay",
      description: "",
      dueDate: new Date("2026-06-01T12:00"),
      reviewCount: 2,
      status: "published",
      backendStatus: "published",
    },
  ]);
  assignmentRepoMock.getById.mockResolvedValue({
    id: "a-1",
    courseId: "c-1",
    title: "Essay",
    description: "",
    dueDate: new Date("2026-06-01T12:00"),
    reviewCount: 2,
    status: "published",
    backendStatus: "published",
  });
  workRepoMock.listForHomework.mockResolvedValue([
    {
      id: "s-1",
      assignmentId: "a-1",
      studentId: "u-1",
      studentName: "Alice",
      content: "",
      files: [],
      submittedAt: new Date("2026-05-30T10:00"),
      status: "submitted",
    },
    {
      id: "s-2",
      assignmentId: "a-1",
      studentId: "u-2",
      studentName: "Bob",
      content: "",
      files: [],
      submittedAt: new Date("2026-06-05T10:00"),
      status: "submitted",
    },
  ]);
}

function renderAt(url: string) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter initialEntries={[url]}>
        <TeacherSubmissionsPage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("TeacherSubmissionsPage", () => {
  it("shows the pick-course empty state when no courseId is set", async () => {
    setupCourseAndAssignments();
    renderAt("/teacher/submissions");

    expect(await screen.findByText("teacher.submissions.pickCourseTitle")).toBeInTheDocument();
    expect(workRepoMock.listForHomework).not.toHaveBeenCalled();
  });

  it("shows the pick-assignment empty state when course is picked but no assignment yet", async () => {
    setupCourseAndAssignments();
    renderAt("/teacher/submissions?courseId=c-1");

    expect(await screen.findByText("teacher.submissions.pickAssignmentTitle")).toBeInTheDocument();
    expect(workRepoMock.listForHomework).not.toHaveBeenCalled();
  });

  it("loads submissions only after a course AND an assignment are picked", async () => {
    setupCourseAndAssignments();
    renderAt("/teacher/submissions?courseId=c-1&assignmentId=a-1");

    await waitFor(() => {
      expect(workRepoMock.listForHomework).toHaveBeenCalledWith("a-1");
    });
    expect(await screen.findByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
  });

  it("filters submissions by student name", async () => {
    setupCourseAndAssignments();
    const user = userEvent.setup();
    renderAt("/teacher/submissions?courseId=c-1&assignmentId=a-1");

    await screen.findByText("Alice");

    const search = screen.getByPlaceholderText(/studentNamePlaceholder/);
    await user.type(search, "bob");

    expect(screen.queryByText("Alice")).not.toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
  });
});
