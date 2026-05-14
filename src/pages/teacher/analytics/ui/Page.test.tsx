import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import TeacherAnalyticsPage from "./Page";

const { courseRepoMock, assignmentRepoMock, workRepoMock, reviewRepoMock, userRepoMock } =
  vi.hoisted(() => ({
    courseRepoMock: { getAll: vi.fn() },
    assignmentRepoMock: { getAll: vi.fn() },
    workRepoMock: { getAll: vi.fn() },
    reviewRepoMock: { getAll: vi.fn() },
    userRepoMock: { getAll: vi.fn() },
  }));

vi.mock("@/entities/course", () => ({ courseRepo: courseRepoMock }));
vi.mock("@/entities/assignment", () => ({ assignmentRepo: assignmentRepoMock }));
vi.mock("@/entities/work", () => ({ workRepo: workRepoMock }));
vi.mock("@/entities/review", () => ({ reviewRepo: reviewRepoMock }));
vi.mock("@/entities/user", () => ({ userRepo: userRepoMock }));

vi.mock("@/widgets/app-shell/AppShell.tsx", () => ({
  AppShell: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  BarChart: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Bar: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  Cell: () => null,
}));

function setupData() {
  courseRepoMock.getAll.mockResolvedValue([
    {
      id: "c-1",
      title: "Course A",
      description: "",
      code: "",
      teachers: [],
      enrollmentCount: 0,
      homeworkCount: 0,
      status: "active",
      backendStatus: "inProgress",
      archived: false,
      createdAt: new Date(),
      name: "Course A",
    },
  ]);
  assignmentRepoMock.getAll.mockResolvedValue([
    {
      id: "a-1",
      courseId: "c-1",
      title: "Assignment 1",
      description: "",
      dueDate: new Date("2026-06-01"),
      reviewCount: 2,
      status: "published",
      backendStatus: "published",
    },
    {
      id: "a-2",
      courseId: "c-1",
      title: "Assignment 2",
      description: "",
      dueDate: new Date("2026-06-10"),
      reviewCount: 2,
      status: "published",
      backendStatus: "published",
    },
  ]);
  workRepoMock.getAll.mockResolvedValue([
    {
      id: "s-1",
      assignmentId: "a-1",
      studentId: "u-1",
      content: "",
      files: [],
      submittedAt: new Date("2026-05-30"),
      status: "submitted",
    },
    {
      id: "s-2",
      assignmentId: "a-1",
      studentId: "u-2",
      content: "",
      files: [],
      submittedAt: new Date("2026-05-30"),
      status: "submitted",
    },
  ]);
  reviewRepoMock.getAll.mockResolvedValue([
    {
      id: "r-1",
      submissionId: "s-1",
      reviewerId: "u-2",
      scores: { c1: 5, c2: 4 },
      comment: "",
      status: "submitted",
    },
    {
      id: "r-2",
      submissionId: "s-1",
      reviewerId: "u-3",
      scores: { c1: 2, c2: 3 },
      comment: "",
      status: "submitted",
    },
    {
      id: "r-3",
      submissionId: "s-2",
      reviewerId: "u-1",
      scores: { c1: 4, c2: 4 },
      comment: "",
      status: "submitted",
    },
  ]);
  userRepoMock.getAll.mockResolvedValue([
    { id: "u-1", name: "Alice", email: "a@x", role: "Student", createdAt: new Date() },
    { id: "u-2", name: "Bob", email: "b@x", role: "Student", createdAt: new Date() },
    { id: "u-3", name: "Carol", email: "c@x", role: "Student", createdAt: new Date() },
    { id: "u-4", name: "Prof", email: "p@x", role: "Teacher", createdAt: new Date() },
  ]);
}

function renderPage() {
  return render(
    <MemoryRouter>
      <TeacherAnalyticsPage />
    </MemoryRouter>,
  );
}

beforeEach(() => {
  [
    courseRepoMock.getAll,
    assignmentRepoMock.getAll,
    workRepoMock.getAll,
    reviewRepoMock.getAll,
    userRepoMock.getAll,
  ].forEach((m) => m.mockReset());
});

describe("TeacherAnalyticsPage", () => {
  it("renders metric cards with computed values", async () => {
    setupData();
    renderPage();

    await waitFor(() => {
      expect(screen.getByText(/teacher\.analytics\.studentsCount/)).toBeInTheDocument();
    });
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("renders one row per assignment in the per-assignment table", async () => {
    setupData();
    renderPage();

    await waitFor(() => {
      expect(screen.getAllByText("Assignment 1").length).toBeGreaterThanOrEqual(1);
    });
    expect(screen.getAllByText("Assignment 2").length).toBeGreaterThanOrEqual(1);
  });

  it("computes a discrepancy badge for submissions with >=2 reviews", async () => {
    setupData();
    renderPage();

    await waitFor(() => {
      expect(screen.getAllByText("±2.00").length).toBeGreaterThanOrEqual(1);
    });
  });

  it("renders the CSV export button enabled when there is data", async () => {
    setupData();
    renderPage();

    await waitFor(() => {
      expect(screen.getAllByText("Assignment 1").length).toBeGreaterThanOrEqual(1);
    });
    const exportBtn = screen.getByRole("button", { name: /teacher\.analytics\.exportCSV/ });
    expect(exportBtn).not.toBeDisabled();
  });

  it("disables CSV export and shows empty state when there are no assignments", async () => {
    courseRepoMock.getAll.mockResolvedValue([
      {
        id: "c-1",
        title: "Course A",
        description: "",
        code: "",
        teachers: [],
        enrollmentCount: 0,
        homeworkCount: 0,
        status: "active",
        backendStatus: "inProgress",
        archived: false,
        createdAt: new Date(),
        name: "Course A",
      },
    ]);
    assignmentRepoMock.getAll.mockResolvedValue([]);
    workRepoMock.getAll.mockResolvedValue([]);
    reviewRepoMock.getAll.mockResolvedValue([]);
    userRepoMock.getAll.mockResolvedValue([
      { id: "u-1", name: "Alice", email: "a@x", role: "Student", createdAt: new Date() },
    ]);
    renderPage();

    await waitFor(() => {
      const exportBtn = screen.getByRole("button", { name: /teacher\.analytics\.exportCSV/ });
      expect(exportBtn).toBeDisabled();
    });
    expect(screen.getByText(/teacher\.analytics\.noAssignmentsYet/)).toBeInTheDocument();
  });
});
