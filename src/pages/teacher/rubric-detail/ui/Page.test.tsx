import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import TeacherRubricDetailPage from "./Page";

const { useRubricMock, useUpdateMock, useDeleteMock, navigateMock, confirmSpy } = vi.hoisted(
  () => ({
    useRubricMock: vi.fn(),
    useUpdateMock: vi.fn(),
    useDeleteMock: vi.fn(),
    navigateMock: vi.fn(),
    confirmSpy: vi.fn(),
  }),
);

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return { ...actual, useNavigate: () => navigateMock };
});

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (k: string) => k }),
}));

vi.mock("@/widgets/app-shell/AppShell.tsx", () => ({
  AppShell: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("@/widgets/rubric-editor", () => ({
  RubricEditor: ({
    rubric,
    onSave,
  }: {
    rubric: { id: string; teacherId: string; name: string; criteria: unknown[] };
    onSave: (r: unknown) => void;
  }) => (
    <div data-testid="editor">
      {rubric.name}
      <button
        data-testid="trigger-save"
        type="button"
        onClick={() =>
          onSave({
            id: rubric.id,
            teacherId: rubric.teacherId,
            name: "Updated",
            criteria: [
              {
                id: "c1",
                name: "A",
                description: "",
                maxScore: 5,
                commentRequired: false,
                position: 0,
              },
            ],
          })
        }
      >
        save
      </button>
    </div>
  ),
  RubricPreview: ({ rubric }: { rubric: { name: string } }) => (
    <div data-testid="preview">{rubric.name}</div>
  ),
}));

vi.mock("@/entities/rubric", () => ({
  useRubric: useRubricMock,
  useUpdateRubric: useUpdateMock,
  useDeleteRubric: useDeleteMock,
}));

beforeEach(() => {
  navigateMock.mockReset();
  confirmSpy.mockReset();
  vi.spyOn(window, "confirm").mockImplementation((...args) => confirmSpy(...args));
});

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/teacher/rubrics/:rubricId" element={<TeacherRubricDetailPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("TeacherRubricDetailPage", () => {
  it("shows not-found card when the rubric is missing", () => {
    useRubricMock.mockReturnValue({ data: null, isLoading: false, error: null, refetch: vi.fn() });
    useUpdateMock.mockReturnValue({ mutateAsync: vi.fn(), isPending: false });
    useDeleteMock.mockReturnValue({ mutateAsync: vi.fn(), isPending: false });

    renderAt("/teacher/rubrics/missing");

    expect(screen.getByRole("heading", { name: "teacher.rubrics.notFound" })).toBeInTheDocument();
  });

  it("renders editor by default with the rubric name", () => {
    useRubricMock.mockReturnValue({
      data: {
        rubric: { id: "r1", teacherId: "t", name: "Essay" },
        criteria: [
          {
            id: "c1",
            name: "A",
            description: null,
            maxScore: 5,
            commentRequired: false,
            position: 0,
          },
        ],
      },
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });
    useUpdateMock.mockReturnValue({ mutateAsync: vi.fn(), isPending: false });
    useDeleteMock.mockReturnValue({ mutateAsync: vi.fn(), isPending: false });

    renderAt("/teacher/rubrics/r1");

    expect(screen.getByTestId("editor")).toHaveTextContent("Essay");
    expect(screen.queryByTestId("preview")).not.toBeInTheDocument();
  });

  it("switches to preview mode on tab click", async () => {
    const user = userEvent.setup();
    useRubricMock.mockReturnValue({
      data: {
        rubric: { id: "r1", teacherId: "t", name: "Essay" },
        criteria: [
          {
            id: "c1",
            name: "A",
            description: null,
            maxScore: 5,
            commentRequired: false,
            position: 0,
          },
        ],
      },
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });
    useUpdateMock.mockReturnValue({ mutateAsync: vi.fn(), isPending: false });
    useDeleteMock.mockReturnValue({ mutateAsync: vi.fn(), isPending: false });

    renderAt("/teacher/rubrics/r1");
    await user.click(screen.getByRole("button", { name: /previewTab/ }));

    expect(screen.getByTestId("preview")).toBeInTheDocument();
  });

  it("calls delete mutation and navigates back when confirmed", async () => {
    const user = userEvent.setup();
    confirmSpy.mockReturnValue(true);
    const mutateAsync = vi.fn().mockResolvedValue(undefined);
    useRubricMock.mockReturnValue({
      data: {
        rubric: { id: "r1", teacherId: "t", name: "Essay" },
        criteria: [
          {
            id: "c1",
            name: "A",
            description: null,
            maxScore: 5,
            commentRequired: false,
            position: 0,
          },
        ],
      },
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });
    useUpdateMock.mockReturnValue({ mutateAsync: vi.fn(), isPending: false });
    useDeleteMock.mockReturnValue({ mutateAsync, isPending: false });

    renderAt("/teacher/rubrics/r1");
    await user.click(screen.getByRole("button", { name: /deleteBtn/ }));

    await waitFor(() => expect(mutateAsync).toHaveBeenCalledWith("r1"));
    expect(navigateMock).toHaveBeenCalledWith("/teacher/rubrics");
  });

  it("update mutation receives mapped input with positional criteria + omits empty description", async () => {
    const user = userEvent.setup();
    const mutateAsync = vi.fn().mockResolvedValue(undefined);
    useRubricMock.mockReturnValue({
      data: {
        rubric: { id: "r1", teacherId: "t", name: "Essay" },
        criteria: [
          {
            id: "c1",
            name: "A",
            description: null,
            maxScore: 5,
            commentRequired: false,
            position: 0,
          },
        ],
      },
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });
    useUpdateMock.mockReturnValue({ mutateAsync, isPending: false });
    useDeleteMock.mockReturnValue({ mutateAsync: vi.fn(), isPending: false });

    renderAt("/teacher/rubrics/r1");
    await user.click(screen.getByTestId("trigger-save"));

    await waitFor(() => expect(mutateAsync).toHaveBeenCalled());
    const arg = mutateAsync.mock.calls[0][0] as {
      rubricId: string;
      input: { name: string; criteria: { description?: string; position: number }[] };
    };
    expect(arg.rubricId).toBe("r1");
    expect(arg.input.name).toBe("Updated");
    expect(arg.input.criteria[0].description).toBeUndefined();
    expect(arg.input.criteria[0].position).toBe(0);
    expect(navigateMock).toHaveBeenCalledWith("/teacher/rubrics");
  });

  it("renders the error banner when useRubric reports an error", () => {
    useRubricMock.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error("boom"),
      refetch: vi.fn(),
    });
    useUpdateMock.mockReturnValue({ mutateAsync: vi.fn(), isPending: false });
    useDeleteMock.mockReturnValue({ mutateAsync: vi.fn(), isPending: false });

    renderAt("/teacher/rubrics/r1");
    expect(screen.queryByTestId("editor")).not.toBeInTheDocument();
  });

  it("does not call delete mutation when user cancels confirm", async () => {
    const user = userEvent.setup();
    confirmSpy.mockReturnValue(false);
    const mutateAsync = vi.fn();
    useRubricMock.mockReturnValue({
      data: {
        rubric: { id: "r1", teacherId: "t", name: "Essay" },
        criteria: [
          {
            id: "c1",
            name: "A",
            description: null,
            maxScore: 5,
            commentRequired: false,
            position: 0,
          },
        ],
      },
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });
    useUpdateMock.mockReturnValue({ mutateAsync: vi.fn(), isPending: false });
    useDeleteMock.mockReturnValue({ mutateAsync, isPending: false });

    renderAt("/teacher/rubrics/r1");
    await user.click(screen.getByRole("button", { name: /deleteBtn/ }));

    expect(mutateAsync).not.toHaveBeenCalled();
  });
});
