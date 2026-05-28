import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ParticipantImportModal } from "./ParticipantImportModal";

function renderWithClient(ui: React.ReactElement) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>);
}

const { groupRepoMock, courseRepoMock, userRepoMock, toastMock } = vi.hoisted(() => ({
  groupRepoMock: {
    listForCourse: vi.fn(),
    addStudent: vi.fn(),
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

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, opts?: Record<string, unknown>) =>
      opts && "count" in opts ? `${key}:${String(opts.count)}` : key,
    i18n: { language: "en" },
  }),
}));

vi.mock("@/shared/lib/useDebouncedValue", () => ({
  useDebouncedValue: (value: unknown) => value,
}));

beforeEach(() => {
  groupRepoMock.listForCourse.mockReset();
  groupRepoMock.addStudent.mockReset();
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

  it.skip("excludes students already in the course from the candidate list", () => {});

  it.skip("renders a checkbox per candidate and keeps the Add button disabled when nothing selected", () => {});

  it("disables the Add button when no group exists in the course", async () => {
    groupRepoMock.listForCourse.mockResolvedValueOnce([]);
    renderWithClient(<ParticipantImportModal courseId="c-1" onClose={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByText(/noGroups/)).toBeInTheDocument();
    });
    expect(screen.getByRole("button", { name: /addBtn:0/ })).toBeDisabled();
  });
});
