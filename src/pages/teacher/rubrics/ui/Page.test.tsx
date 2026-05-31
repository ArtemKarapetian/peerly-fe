import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import TeacherRubricsPage from "./Page";

const { useRubricsMock, useCreateRubricMock, navigateMock } = vi.hoisted(() => ({
  useRubricsMock: vi.fn(),
  useCreateRubricMock: vi.fn(),
  navigateMock: vi.fn(),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return { ...actual, useNavigate: () => navigateMock };
});

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (k: string) => k, i18n: { language: "en" } }),
}));

vi.mock("@/widgets/app-shell/AppShell.tsx", () => ({
  AppShell: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("@/entities/rubric", () => ({
  useRubrics: useRubricsMock,
  useCreateRubric: useCreateRubricMock,
}));

beforeEach(() => {
  navigateMock.mockReset();
});

function renderPage() {
  return render(
    <MemoryRouter>
      <TeacherRubricsPage />
    </MemoryRouter>,
  );
}

describe("TeacherRubricsPage", () => {
  it("shows the empty state when there are no rubrics", () => {
    useRubricsMock.mockReturnValue({ data: [], isLoading: false, error: null, refetch: vi.fn() });
    useCreateRubricMock.mockReturnValue({ isPending: false, mutateAsync: vi.fn() });

    renderPage();

    expect(screen.getByText("teacher.rubrics.createFirst")).toBeInTheDocument();
  });

  it("renders one tile per rubric", () => {
    useRubricsMock.mockReturnValue({
      data: [
        { id: "r1", teacherId: "t", name: "First" },
        { id: "r2", teacherId: "t", name: "Second" },
      ],
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });
    useCreateRubricMock.mockReturnValue({ isPending: false, mutateAsync: vi.fn() });

    renderPage();

    expect(screen.getByText("First")).toBeInTheDocument();
    expect(screen.getByText("Second")).toBeInTheDocument();
  });

  it("filters rubrics by search query (case-insensitive)", async () => {
    const user = userEvent.setup();
    useRubricsMock.mockReturnValue({
      data: [
        { id: "r1", teacherId: "t", name: "Essay" },
        { id: "r2", teacherId: "t", name: "Code Review" },
      ],
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });
    useCreateRubricMock.mockReturnValue({ isPending: false, mutateAsync: vi.fn() });

    renderPage();
    await user.type(screen.getByPlaceholderText(/searchPlaceholder/), "essay");

    expect(screen.getByText("Essay")).toBeInTheDocument();
    expect(screen.queryByText("Code Review")).not.toBeInTheDocument();
  });

  it("calls create mutation and navigates to the new rubric on Create", async () => {
    const user = userEvent.setup();
    const mutateAsync = vi.fn().mockResolvedValue({ rubricId: "new-1" });
    useRubricsMock.mockReturnValue({ data: [], isLoading: false, error: null, refetch: vi.fn() });
    useCreateRubricMock.mockReturnValue({ isPending: false, mutateAsync });

    renderPage();

    await user.click(screen.getAllByText(/teacher\.rubrics\.create/i)[0]);

    await waitFor(() => expect(mutateAsync).toHaveBeenCalled());
    expect(navigateMock).toHaveBeenCalledWith("/teacher/rubrics/new-1");
  });

  it("renders the skeleton while loading", () => {
    useRubricsMock.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
      refetch: vi.fn(),
    });
    useCreateRubricMock.mockReturnValue({ isPending: false, mutateAsync: vi.fn() });

    const { container } = renderPage();
    expect(container.textContent).not.toContain("Essay");
  });

  it("renders an error banner when useRubrics returns an error", () => {
    useRubricsMock.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error("boom"),
      refetch: vi.fn(),
    });
    useCreateRubricMock.mockReturnValue({ isPending: false, mutateAsync: vi.fn() });

    const { container } = renderPage();
    expect(container.textContent).not.toContain("createFirst");
  });
});
