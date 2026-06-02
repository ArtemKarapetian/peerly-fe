import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import TeacherCoursesPage from "./Page";

const { useCoursesMock } = vi.hoisted(() => ({
  useCoursesMock: vi.fn(),
}));

vi.mock("@/entities/course", () => ({ useCourses: () => useCoursesMock() }));

function mockCourses(courses: unknown[]) {
  useCoursesMock.mockReturnValue({
    data: courses,
    isLoading: false,
    error: null,
    refetch: vi.fn(),
  });
}

vi.mock("@/widgets/app-shell", () => ({
  AppShell: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, opts?: Record<string, unknown>) =>
      opts ? `${key}:${JSON.stringify(opts)}` : key,
    i18n: { language: "en" },
  }),
}));

beforeEach(() => {
  useCoursesMock.mockReset();
});

function fakeCourse(
  over: Partial<{ id: string; title: string; status: "active" | "draft" | "archived" }>,
) {
  return {
    id: over.id ?? "c-x",
    title: over.title ?? "Course",
    name: over.title ?? "Course",
    description: "",
    teachers: [],
    enrollmentCount: 0,
    homeworkCount: 0,
    status: over.status ?? "active",
    backendStatus: "inProgress",
    archived: over.status === "archived",
    createdAt: new Date(),
  };
}

function renderPage() {
  return render(
    <MemoryRouter>
      <TeacherCoursesPage />
    </MemoryRouter>,
  );
}

describe("TeacherCoursesPage", () => {
  it("lists all courses by default so fresh drafts are visible", async () => {
    mockCourses([
      fakeCourse({ id: "c-1", title: "Active One" }),
      fakeCourse({ id: "c-2", title: "Draft One", status: "draft" }),
      fakeCourse({ id: "c-3", title: "Archived One", status: "archived" }),
    ]);
    renderPage();

    await waitFor(() => {
      expect(screen.getByText("Active One")).toBeInTheDocument();
    });
    expect(screen.getByText("Draft One")).toBeInTheDocument();
    expect(screen.getByText("Archived One")).toBeInTheDocument();
  });

  it("filters by status when the user picks draft", async () => {
    mockCourses([
      fakeCourse({ id: "c-1", title: "Active One" }),
      fakeCourse({ id: "c-2", title: "Draft One", status: "draft" }),
    ]);
    const user = userEvent.setup();
    renderPage();

    await waitFor(() => expect(screen.getByText("Active One")).toBeInTheDocument());

    await user.selectOptions(screen.getAllByRole("combobox")[0]!, "draft");

    expect(screen.queryByText("Active One")).not.toBeInTheDocument();
    expect(screen.getByText("Draft One")).toBeInTheDocument();
  });

  it("hides drafts/archived when the user picks active", async () => {
    mockCourses([
      fakeCourse({ id: "c-1", title: "Active One" }),
      fakeCourse({ id: "c-2", title: "Draft One", status: "draft" }),
      fakeCourse({ id: "c-3", title: "Archived One", status: "archived" }),
    ]);
    const user = userEvent.setup();
    renderPage();

    await waitFor(() => expect(screen.getByText("Active One")).toBeInTheDocument());

    await user.selectOptions(screen.getAllByRole("combobox")[0]!, "active");

    expect(screen.getByText("Active One")).toBeInTheDocument();
    expect(screen.queryByText("Draft One")).not.toBeInTheDocument();
    expect(screen.queryByText("Archived One")).not.toBeInTheDocument();
  });

  it("filters by search query against course names", async () => {
    mockCourses([
      fakeCourse({ id: "c-1", title: "Algebra" }),
      fakeCourse({ id: "c-2", title: "Biology" }),
    ]);
    const user = userEvent.setup();
    renderPage();

    await waitFor(() => expect(screen.getByText("Algebra")).toBeInTheDocument());

    await user.type(screen.getByPlaceholderText(/searchPlaceholder/), "bio");

    expect(screen.queryByText("Algebra")).not.toBeInTheDocument();
    expect(screen.getByText("Biology")).toBeInTheDocument();
  });

  it("renders the empty state when no courses exist", async () => {
    mockCourses([]);
    renderPage();

    await waitFor(() => {
      expect(screen.getByText(/teacher\.courses\.noCourses/)).toBeInTheDocument();
    });
  });
});
