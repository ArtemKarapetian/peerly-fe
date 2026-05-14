import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import TeacherDistributionPage from "./Page";

const { courseRepoMock, assignmentRepoMock, workRepoMock, reviewRepoMock, userRepoMock } =
  vi.hoisted(() => ({
    courseRepoMock: { getAll: vi.fn() },
    assignmentRepoMock: { getByCourse: vi.fn() },
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

beforeEach(() => {
  [
    courseRepoMock.getAll,
    assignmentRepoMock.getByCourse,
    workRepoMock.getAll,
    reviewRepoMock.getAll,
    userRepoMock.getAll,
  ].forEach((m) => m.mockReset());
});

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
  assignmentRepoMock.getByCourse.mockResolvedValue([
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
  ]);
  workRepoMock.getAll.mockResolvedValue([
    {
      id: "s-1",
      assignmentId: "a-1",
      studentId: "u-1",
      content: "",
      files: [],
      submittedAt: new Date(),
      status: "submitted",
    },
    {
      id: "s-2",
      assignmentId: "a-1",
      studentId: "u-2",
      content: "",
      files: [],
      submittedAt: new Date(),
      status: "submitted",
    },
  ]);
  reviewRepoMock.getAll.mockResolvedValue([
    {
      id: "r-1",
      submissionId: "s-1",
      reviewerId: "u-2",
      scores: {},
      comment: "",
      status: "submitted",
    },
    {
      id: "r-2",
      submissionId: "s-1",
      reviewerId: "u-3",
      scores: {},
      comment: "",
      status: "draft",
    },
  ]);
  userRepoMock.getAll.mockResolvedValue([
    { id: "u-1", name: "Alice", email: "a@x", role: "Student", createdAt: new Date() },
    { id: "u-2", name: "Bob", email: "b@x", role: "Student", createdAt: new Date() },
    { id: "u-3", name: "Carol", email: "c@x", role: "Student", createdAt: new Date() },
  ]);
}

function renderPage() {
  return render(
    <MemoryRouter>
      <TeacherDistributionPage />
    </MemoryRouter>,
  );
}

describe("TeacherDistributionPage", () => {
  it("shows the pick-assignment prompt when no assignment is selected", async () => {
    setupData();
    renderPage();

    await waitFor(() => {
      expect(screen.getByText(/teacher\.distribution\.pickAssignmentPrompt/)).toBeInTheDocument();
    });
  });

  it("populates assignment dropdown after a course is auto-selected", async () => {
    setupData();
    renderPage();

    await waitFor(() => {
      expect(screen.getByRole("option", { name: "Assignment 1" })).toBeInTheDocument();
    });
  });

  it("renders SUB-### anonymous ids and reviewer rows after picking an assignment", async () => {
    setupData();
    const user = userEvent.setup();
    renderPage();

    await waitFor(() => {
      expect(screen.getByRole("option", { name: "Assignment 1" })).toBeInTheDocument();
    });

    const selects = screen.getAllByRole("combobox");
    const assignmentSelect = selects[1];
    await user.selectOptions(assignmentSelect, "a-1");

    expect(screen.getByText("SUB-001")).toBeInTheDocument();
    expect(screen.getByText("SUB-002")).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getAllByText("Bob").length).toBeGreaterThanOrEqual(1);
  });

  it("shows reviewer status labels per row", async () => {
    setupData();
    const user = userEvent.setup();
    renderPage();

    await waitFor(() => {
      expect(screen.getByRole("option", { name: "Assignment 1" })).toBeInTheDocument();
    });

    const selects = screen.getAllByRole("combobox");
    await user.selectOptions(selects[1], "a-1");

    expect(
      screen.getByText(/teacher\.distribution\.reviewerStatus\.submitted/),
    ).toBeInTheDocument();
    expect(screen.getByText(/teacher\.distribution\.reviewerStatus\.draft/)).toBeInTheDocument();
  });

  it("shows no-reviewers message for submissions with no reviewers", async () => {
    setupData();
    reviewRepoMock.getAll.mockResolvedValue([]);
    const user = userEvent.setup();
    renderPage();

    await waitFor(() => {
      expect(screen.getByRole("option", { name: "Assignment 1" })).toBeInTheDocument();
    });

    const selects = screen.getAllByRole("combobox");
    await user.selectOptions(selects[1], "a-1");

    const noReviewers = screen.getAllByText(/teacher\.distribution\.noReviewers/);
    expect(noReviewers.length).toBeGreaterThanOrEqual(2);
  });

  it("shows the empty-state when there are no submissions for the selected assignment", async () => {
    setupData();
    workRepoMock.getAll.mockResolvedValue([]); // no submissions
    const user = userEvent.setup();
    renderPage();

    await waitFor(() => {
      expect(screen.getByRole("option", { name: "Assignment 1" })).toBeInTheDocument();
    });

    const selects = screen.getAllByRole("combobox");
    await user.selectOptions(selects[1], "a-1");

    expect(screen.getByText(/teacher\.distribution\.emptyState/)).toBeInTheDocument();
  });
});
