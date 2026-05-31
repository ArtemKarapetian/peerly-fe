import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import TeacherAnalyticsPage from "./Page";

const { courseRepoMock, assignmentRepoMock, workRepoMock, reviewRepoMock } = vi.hoisted(() => ({
  courseRepoMock: { getAll: vi.fn(), getParticipants: vi.fn() },
  assignmentRepoMock: { getAll: vi.fn() },
  workRepoMock: { getAll: vi.fn() },
  reviewRepoMock: { getAll: vi.fn() },
}));

vi.mock("@/entities/course", () => ({ courseRepo: courseRepoMock }));
vi.mock("@/entities/assignment", () => ({ assignmentRepo: assignmentRepoMock }));
vi.mock("@/entities/work", () => ({ workRepo: workRepoMock }));
vi.mock("@/entities/review", () => ({ reviewRepo: reviewRepoMock }));

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
      scores: [
        { criterionId: "c1", score: 5, comment: null },
        { criterionId: "c2", score: 4, comment: null },
      ],
      comment: "",
      status: "submitted",
    },
    {
      id: "r-2",
      submissionId: "s-1",
      reviewerId: "u-3",
      scores: [
        { criterionId: "c1", score: 2, comment: null },
        { criterionId: "c2", score: 3, comment: null },
      ],
      comment: "",
      status: "submitted",
    },
    {
      id: "r-3",
      submissionId: "s-2",
      reviewerId: "u-1",
      scores: [
        { criterionId: "c1", score: 4, comment: null },
        { criterionId: "c2", score: 4, comment: null },
      ],
      comment: "",
      status: "submitted",
    },
  ]);
  courseRepoMock.getParticipants.mockResolvedValue({
    students: [
      { studentId: "u-1", email: "a@x", name: "Alice" },
      { studentId: "u-2", email: "b@x", name: "Bob" },
      { studentId: "u-3", email: "c@x", name: "Carol" },
    ],
    teachers: [{ teacherId: "u-4", email: "p@x", name: "Prof" }],
  });
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
    courseRepoMock.getParticipants,
    assignmentRepoMock.getAll,
    workRepoMock.getAll,
    reviewRepoMock.getAll,
  ].forEach((m) => m.mockReset());
});

describe("TeacherAnalyticsPage", () => {
  it("renders metric cards with computed values", async () => {
    setupData();
    renderPage();

    await waitFor(() => {
      expect(screen.getByText("3")).toBeInTheDocument();
    });
    expect(screen.getByText("2")).toBeInTheDocument();
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
      const exportBtn = screen.getByRole("button", { name: /teacher\.analytics\.exportCSV/ });
      expect(exportBtn).not.toBeDisabled();
    });
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
    courseRepoMock.getParticipants.mockResolvedValue({
      students: [{ studentId: "u-1", email: "a@x", name: "Alice" }],
      teachers: [],
    });
    renderPage();

    await waitFor(() => {
      const exportBtn = screen.getByRole("button", { name: /teacher\.analytics\.exportCSV/ });
      expect(exportBtn).toBeDisabled();
    });
    expect(screen.getByText(/teacher\.analytics\.noAssignmentsYet/)).toBeInTheDocument();
  });
});
