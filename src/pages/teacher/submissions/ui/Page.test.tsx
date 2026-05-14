import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import TeacherSubmissionsPage from "./Page";

const { assignmentRepoMock, workRepoMock, userRepoMock, storageApiMock } = vi.hoisted(() => ({
  assignmentRepoMock: { getAll: vi.fn() },
  workRepoMock: { getAll: vi.fn() },
  userRepoMock: { getAll: vi.fn() },
  storageApiMock: { getDownloadUrl: vi.fn(), triggerDownload: vi.fn() },
}));

vi.mock("@/entities/assignment", () => ({ assignmentRepo: assignmentRepoMock }));
vi.mock("@/entities/work", () => ({ workRepo: workRepoMock }));
vi.mock("@/entities/user", () => ({ userRepo: userRepoMock }));
vi.mock("@/entities/storage", () => ({ storageApi: storageApiMock }));

vi.mock("@/widgets/app-shell/AppShell.tsx", () => ({
  AppShell: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

beforeEach(() => {
  [assignmentRepoMock.getAll, workRepoMock.getAll, userRepoMock.getAll].forEach((m) =>
    m.mockReset(),
  );
});

function setupData() {
  userRepoMock.getAll.mockResolvedValue([
    { id: "u-1", name: "Alice", email: "a@x", role: "Student", createdAt: new Date() },
    { id: "u-2", name: "Bob", email: "b@x", role: "Student", createdAt: new Date() },
    { id: "u-3", name: "Carol", email: "c@x", role: "Student", createdAt: new Date() },
  ]);
  assignmentRepoMock.getAll.mockResolvedValue([
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
    {
      id: "a-2",
      courseId: "c-1",
      title: "Quiz",
      description: "",
      dueDate: new Date("2026-07-01T12:00"),
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
      submittedAt: new Date("2026-05-30T10:00"), // before deadline → submitted
      status: "submitted",
    },
    {
      id: "s-2",
      assignmentId: "a-1",
      studentId: "u-2",
      content: "",
      files: [],
      submittedAt: new Date("2026-06-05T10:00"), // after deadline → late
      status: "submitted",
    },
    {
      id: "s-3",
      assignmentId: "a-2",
      studentId: "u-3",
      content: "",
      files: [],
      submittedAt: new Date("2026-06-30T10:00"),
      status: "draft",
    },
  ]);
}

function renderPage() {
  return render(
    <MemoryRouter>
      <TeacherSubmissionsPage />
    </MemoryRouter>,
  );
}

describe("TeacherSubmissionsPage", () => {
  it("renders all three submissions initially with names and statuses", async () => {
    setupData();
    renderPage();

    await waitFor(() => {
      expect(screen.getByText("Alice")).toBeInTheDocument();
    });
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.getByText("Carol")).toBeInTheDocument();
    const lateBadges = screen.getAllByText(/teacher\.submissions\.late/);
    expect(lateBadges.length).toBeGreaterThanOrEqual(1);
  });

  it("filters by status=draft", async () => {
    setupData();
    const user = userEvent.setup();
    renderPage();

    await waitFor(() => {
      expect(screen.getByText("Alice")).toBeInTheDocument();
    });

    const selects = screen.getAllByRole("combobox");
    const statusSelect = selects[1]; // 0 is assignment, 1 is status
    await user.selectOptions(statusSelect, "draft");

    expect(screen.queryByText("Alice")).not.toBeInTheDocument();
    expect(screen.queryByText("Bob")).not.toBeInTheDocument();
    expect(screen.getByText("Carol")).toBeInTheDocument();
  });

  it("filters by status=late", async () => {
    setupData();
    const user = userEvent.setup();
    renderPage();

    await waitFor(() => {
      expect(screen.getByText("Bob")).toBeInTheDocument();
    });

    const selects = screen.getAllByRole("combobox");
    const statusSelect = selects[1];
    await user.selectOptions(statusSelect, "late");

    expect(screen.queryByText("Alice")).not.toBeInTheDocument();
    expect(screen.queryByText("Carol")).not.toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
  });

  it("filters by student name via the search input", async () => {
    setupData();
    const user = userEvent.setup();
    renderPage();

    await waitFor(() => expect(screen.getByText("Alice")).toBeInTheDocument());

    const search = screen.getByPlaceholderText(/studentNamePlaceholder/);
    await user.type(search, "carol");

    expect(screen.queryByText("Alice")).not.toBeInTheDocument();
    expect(screen.queryByText("Bob")).not.toBeInTheDocument();
    expect(screen.getByText("Carol")).toBeInTheDocument();
  });

  it("filters by selected assignment", async () => {
    setupData();
    const user = userEvent.setup();
    renderPage();

    await waitFor(() => expect(screen.getByText("Alice")).toBeInTheDocument());

    const selects = screen.getAllByRole("combobox");
    const assignmentSelect = selects[0];
    await user.selectOptions(assignmentSelect, "a-2");

    expect(screen.queryByText("Alice")).not.toBeInTheDocument();
    expect(screen.queryByText("Bob")).not.toBeInTheDocument();
    expect(screen.getByText("Carol")).toBeInTheDocument();
  });

  it("shows empty state when filters exclude everything", async () => {
    setupData();
    const user = userEvent.setup();
    renderPage();

    await waitFor(() => expect(screen.getByText("Alice")).toBeInTheDocument());

    const search = screen.getByPlaceholderText(/studentNamePlaceholder/);
    await user.type(search, "zzzzz");

    expect(screen.getByText(/teacher\.submissions\.emptyState/)).toBeInTheDocument();
  });
});
