import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { TeacherCourseParticipants } from "./Participants";

function renderWithRouter(ui: ReactNode) {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter>{ui}</MemoryRouter>
    </QueryClientProvider>,
  );
}

const { useCourseParticipantsMock, groupRepoMock, toastMock, confirmMock } = vi.hoisted(() => ({
  useCourseParticipantsMock: vi.fn(),
  groupRepoMock: {
    listForCourse: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    getParticipants: vi.fn(),
  },
  toastMock: { success: vi.fn(), error: vi.fn() },
  confirmMock: vi.fn(),
}));

vi.mock("@/entities/course", () => ({
  useCourseParticipants: () => useCourseParticipantsMock(),
}));

function mockParticipants(data: unknown) {
  useCourseParticipantsMock.mockReturnValue({
    data,
    isLoading: false,
    error: null,
    refetch: vi.fn(),
  });
}

vi.mock("@/entities/group/api/httpRepo", () => ({ groupHttpRepo: groupRepoMock }));

vi.mock("sonner", () => ({ toast: toastMock }));

vi.mock("@/features/participant/import", () => ({
  ParticipantImportModal: ({ onClose }: { onClose: () => void }) => (
    <div data-testid="import-modal">
      <button onClick={onClose}>close</button>
    </div>
  ),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, opts?: Record<string, unknown>) =>
      opts ? `${key}:${JSON.stringify(opts)}` : key,
    i18n: { language: "ru" },
  }),
}));

beforeEach(() => {
  useCourseParticipantsMock.mockReset();
  Object.values(groupRepoMock).forEach((m) => m.mockReset());
  toastMock.success.mockReset();
  toastMock.error.mockReset();
  confirmMock.mockReset();
  vi.stubGlobal("confirm", confirmMock);
});

describe("TeacherCourseParticipants", () => {
  it("renders teacher section above groups section", async () => {
    mockParticipants({
      students: [],
      teachers: [{ teacherId: 9, email: "prof@x", name: "Prof X" }],
    });
    groupRepoMock.listForCourse.mockResolvedValueOnce([]);

    renderWithRouter(<TeacherCourseParticipants courseId="c-1" />);

    await waitFor(() => {
      expect(screen.getByText("Prof X")).toBeInTheDocument();
    });
    expect(screen.getByText(/widget\.participants\.teachersSection/)).toBeInTheDocument();
    expect(screen.getByText(/widget\.participants\.groupsSection/)).toBeInTheDocument();
  });

  it("lists groups sorted alphabetically with student counts", async () => {
    mockParticipants({ students: [], teachers: [] });
    groupRepoMock.listForCourse.mockResolvedValueOnce([
      { id: "g-b", name: "Бета", studentCount: 5 },
      { id: "g-a", name: "Альфа", studentCount: 3 },
      { id: "g-g", name: "Гамма", studentCount: 0 },
    ]);

    renderWithRouter(<TeacherCourseParticipants courseId="c-1" />);

    await waitFor(() => {
      expect(screen.getByText("Альфа")).toBeInTheDocument();
    });

    const headings = screen
      .getAllByRole("button", { expanded: false })
      .map((btn) => btn.textContent ?? "");
    expect(headings.findIndex((h) => h.includes("Альфа"))).toBeLessThan(
      headings.findIndex((h) => h.includes("Бета")),
    );
    expect(headings.findIndex((h) => h.includes("Бета"))).toBeLessThan(
      headings.findIndex((h) => h.includes("Гамма")),
    );
  });

  it("creates a new group via inline form", async () => {
    const user = userEvent.setup();
    mockParticipants({ students: [], teachers: [] });
    groupRepoMock.listForCourse.mockResolvedValue([]);
    groupRepoMock.create.mockResolvedValueOnce({ id: "g-new", name: "G", studentCount: 0 });

    renderWithRouter(<TeacherCourseParticipants courseId="c-1" />);

    await waitFor(() => expect(screen.getByText("widget.groups.empty")).toBeInTheDocument());

    await user.click(screen.getAllByRole("button", { name: /widget\.groups\.createGroup/ })[0]!);
    await user.type(
      screen.getByPlaceholderText(/widget\.groups\.groupNamePlaceholder/),
      "New Group",
    );
    await user.click(screen.getByRole("button", { name: /common\.create/ }));

    await waitFor(() => {
      expect(groupRepoMock.create).toHaveBeenCalledWith({ courseId: "c-1", name: "New Group" });
      expect(toastMock.success).toHaveBeenCalled();
    });
  });

  it("expands a group to show members", async () => {
    const user = userEvent.setup();
    mockParticipants({ students: [], teachers: [] });
    groupRepoMock.listForCourse.mockResolvedValueOnce([
      { id: "g-1", name: "Group A", studentCount: 1 },
    ]);
    groupRepoMock.getParticipants.mockResolvedValueOnce({
      students: [{ id: "u-1", name: "Alice", email: "a@x" }],
      teachers: [],
    });

    renderWithRouter(<TeacherCourseParticipants courseId="c-1" />);

    await waitFor(() => expect(screen.getByText("Group A")).toBeInTheDocument());

    await user.click(screen.getByRole("button", { name: /Group A/ }));

    await waitFor(() => {
      expect(screen.getByText("Alice")).toBeInTheDocument();
    });
  });

  it("opens the import modal preselected for a specific group", async () => {
    const user = userEvent.setup();
    mockParticipants({ students: [], teachers: [] });
    groupRepoMock.listForCourse.mockResolvedValueOnce([
      { id: "g-1", name: "Group A", studentCount: 0 },
    ]);

    renderWithRouter(<TeacherCourseParticipants courseId="c-1" />);

    await waitFor(() => expect(screen.getByText("Group A")).toBeInTheDocument());

    await user.click(screen.getByRole("button", { name: /widget\.groups\.addStudents/ }));
    expect(screen.getByTestId("import-modal")).toBeInTheDocument();
  });

  it("deletes a group after confirmation via ConfirmDialog", async () => {
    const user = userEvent.setup();
    mockParticipants({ students: [], teachers: [] });
    groupRepoMock.listForCourse.mockResolvedValue([
      { id: "g-1", name: "Group A", studentCount: 0 },
    ]);
    groupRepoMock.delete.mockResolvedValueOnce(undefined);

    renderWithRouter(<TeacherCourseParticipants courseId="c-1" />);

    await waitFor(() => expect(screen.getByText("Group A")).toBeInTheDocument());

    await user.click(screen.getByRole("button", { name: /widget\.groups\.deleteGroup/ }));
    const dialog = await screen.findByRole("dialog");
    await user.click(within(dialog).getByRole("button", { name: /common\.delete/ }));

    await waitFor(() => {
      expect(groupRepoMock.delete).toHaveBeenCalledWith("g-1");
      expect(toastMock.success).toHaveBeenCalled();
    });
  });

  it("shows empty state when course has no groups", async () => {
    mockParticipants({ students: [], teachers: [] });
    groupRepoMock.listForCourse.mockResolvedValueOnce([]);

    renderWithRouter(<TeacherCourseParticipants courseId="c-1" />);

    await waitFor(() => {
      expect(screen.getByText("widget.groups.empty")).toBeInTheDocument();
    });
  });

  it("renames a group via inline pencil edit", async () => {
    const user = userEvent.setup();
    mockParticipants({ students: [], teachers: [] });
    groupRepoMock.listForCourse.mockResolvedValue([
      { id: "g-1", name: "Group A", studentCount: 0 },
    ]);
    groupRepoMock.update.mockResolvedValueOnce(undefined);

    renderWithRouter(<TeacherCourseParticipants courseId="c-1" />);

    await waitFor(() => expect(screen.getByText("Group A")).toBeInTheDocument());

    await user.click(screen.getByRole("button", { name: /widget\.groups\.rename/ }));
    const input = await screen.findByDisplayValue("Group A");
    await user.clear(input);
    await user.type(input, "Group Renamed{Enter}");

    await waitFor(() => {
      expect(groupRepoMock.update).toHaveBeenCalledWith("g-1", { name: "Group Renamed" });
      expect(toastMock.success).toHaveBeenCalled();
    });
  });
});
