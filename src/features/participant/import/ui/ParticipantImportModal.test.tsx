import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ParticipantImportModal } from "./ParticipantImportModal";

function renderWithClient(ui: React.ReactElement) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>);
}

const { groupRepoMock, courseRepoMock, userRepoMock, toastMock } = vi.hoisted(() => ({
  groupRepoMock: {
    listForCourse: vi.fn(),
  },
  courseRepoMock: {
    getParticipants: vi.fn(),
  },
  userRepoMock: {
    searchStudents: vi.fn(),
  },
  toastMock: { success: vi.fn(), error: vi.fn() },
}));

vi.mock("@/entities/group", () => ({ groupRepo: groupRepoMock }));
vi.mock("@/entities/course", () => ({ courseRepo: courseRepoMock }));
vi.mock("@/entities/user", () => ({ userRepo: userRepoMock }));
vi.mock("sonner", () => ({ toast: toastMock }));

vi.mock("react-i18next", () => {
  const t = (key: string, opts?: Record<string, unknown>) =>
    opts && "count" in opts ? `${key}:${String(opts.count)}` : key;
  const i18n = { language: "en" };
  const value = { t, i18n };
  return { useTranslation: () => value };
});

vi.mock("@/shared/lib/useDebouncedValue", () => ({
  useDebouncedValue: (value: unknown) => value,
}));

beforeEach(() => {
  groupRepoMock.listForCourse.mockReset();
  courseRepoMock.getParticipants.mockReset();
  userRepoMock.searchStudents.mockReset();
  toastMock.success.mockReset();
  toastMock.error.mockReset();

  groupRepoMock.listForCourse.mockResolvedValue([{ id: "g-1", name: "Группа A" }]);
  courseRepoMock.getParticipants.mockResolvedValue({ students: [], teachers: [] });
  userRepoMock.searchStudents.mockResolvedValue([]);
});

describe("ParticipantImportModal", () => {
  it("loads groups and current course participants on mount", async () => {
    renderWithClient(<ParticipantImportModal courseId="c-1" onClose={vi.fn()} />);
    await waitFor(() => {
      expect(groupRepoMock.listForCourse).toHaveBeenCalledWith("c-1");
      expect(courseRepoMock.getParticipants).toHaveBeenCalledWith("c-1");
    });
  });

  it("excludes students already in the course from the candidate list", async () => {
    courseRepoMock.getParticipants.mockResolvedValue({
      students: [{ studentId: 1, name: "Alice", email: "alice@x" }],
      teachers: [],
    });
    userRepoMock.searchStudents.mockResolvedValue([
      { id: "1", name: "Alice", email: "alice@x" },
      { id: "2", name: "Bob", email: "bob@x" },
    ]);
    renderWithClient(<ParticipantImportModal courseId="c-1" onClose={vi.fn()} />);
    await waitFor(() => {
      expect(courseRepoMock.getParticipants).toHaveBeenCalled();
    });
    const search = screen.getByPlaceholderText(/searchPlaceholder/);
    fireEvent.change(search, { target: { value: "alice" } });
    await waitFor(() => {
      expect(screen.getByText("Bob")).toBeInTheDocument();
    });
    expect(screen.queryByText("Alice")).not.toBeInTheDocument();
  });

  it("renders a checkbox per candidate and keeps the Add button disabled when nothing selected", async () => {
    userRepoMock.searchStudents.mockResolvedValue([
      { id: "1", name: "Alice", email: "alice@x" },
      { id: "2", name: "Bob", email: "bob@x" },
    ]);
    renderWithClient(<ParticipantImportModal courseId="c-1" onClose={vi.fn()} />);
    const search = screen.getByPlaceholderText(/searchPlaceholder/);
    fireEvent.change(search, { target: { value: "abc" } });
    await waitFor(() => {
      expect(screen.getByText("Bob")).toBeInTheDocument();
    });
    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes).toHaveLength(2);
    expect(checkboxes.every((c) => !(c as HTMLInputElement).checked)).toBe(true);
    expect(screen.getByRole("button", { name: /addBtn:0/ })).toBeDisabled();
  });

  it("disables the Add button when no group exists in the course", async () => {
    groupRepoMock.listForCourse.mockResolvedValueOnce([]);
    renderWithClient(<ParticipantImportModal courseId="c-1" onClose={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByText(/noGroups/)).toBeInTheDocument();
    });
    expect(screen.getByRole("button", { name: /addBtn:0/ })).toBeDisabled();
  });
});
