import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { DemoAssignment } from "@/entities/assignment/model/types";

import DashboardPage from "./Page";

const useAssignmentsMock = vi.fn();
const useCoursesMock = vi.fn();
const useAssignedReviewsInboxMock = vi.fn();
const getMineSubmissionIdMock = vi.fn();

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key, i18n: { language: "ru" } }),
  initReactI18next: { type: "3rdParty", init: vi.fn() },
}));

vi.mock("@/entities/assignment", () => ({ useAssignments: () => useAssignmentsMock() }));
vi.mock("@/entities/course", () => ({ useCourses: () => useCoursesMock() }));
vi.mock("@/entities/work", () => ({
  workRepo: { getMineSubmissionId: (id: string) => getMineSubmissionIdMock(id) },
}));
vi.mock("@/widgets/reviews-inbox", () => ({
  useAssignedReviewsInbox: () => useAssignedReviewsInboxMock(),
}));

vi.mock("@/widgets/app-shell/AppShell.tsx", () => ({
  AppShell: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

function assignment(
  id: string,
  title: string,
  daysFromNow: number,
  backendStatus: DemoAssignment["backendStatus"] = "published",
): DemoAssignment {
  return {
    id,
    courseId: "c-1",
    title,
    description: "",
    dueDate: new Date(Date.now() + daysFromNow * 24 * 60 * 60 * 1000),
    reviewCount: 0,
    status: "published",
    backendStatus,
  };
}

function renderPage() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

beforeEach(() => {
  useAssignmentsMock.mockReset();
  useCoursesMock.mockReset();
  useAssignedReviewsInboxMock.mockReset();
  getMineSubmissionIdMock.mockReset();
  useCoursesMock.mockReturnValue({ data: [{ id: "c-1", title: "Course A", status: "active" }] });
  useAssignedReviewsInboxMock.mockReturnValue({ data: [], isLoading: false });
});

function inboxReview(id: string, daysFromNow: number, status: "not_started" | "submitted") {
  const ts = Date.now() + daysFromNow * 24 * 60 * 60 * 1000;
  return {
    id,
    taskTitle: `Review ${id}`,
    courseName: "Course A",
    courseId: "c-1",
    taskId: id,
    reviewDeadline: new Date(ts).toISOString(),
    reviewDeadlineTimestamp: ts,
    status,
    submittedReviewId: status === "submitted" ? `sr-${id}` : null,
    isAnonymous: true,
  };
}

describe("DashboardPage to-do list", () => {
  it("hides assignments whose deadline has already passed", async () => {
    useAssignmentsMock.mockReturnValue({
      data: [
        assignment("a-past", "Past assignment", -1),
        assignment("a-future", "Future assignment", 3),
      ],
    });
    getMineSubmissionIdMock.mockResolvedValue(null);
    renderPage();

    await screen.findByText("Future assignment");
    expect(screen.queryByText("Past assignment")).not.toBeInTheDocument();
  });

  it("hides assignments closed by the teacher (finished / confirmed)", async () => {
    useAssignmentsMock.mockReturnValue({
      data: [
        assignment("a-fin", "Finished assignment", 5, "finished"),
        assignment("a-conf", "Confirmed assignment", 5, "confirmed"),
        assignment("a-open", "Open assignment", 5, "published"),
      ],
    });
    getMineSubmissionIdMock.mockResolvedValue(null);
    renderPage();

    await screen.findByText("Open assignment");
    expect(screen.queryByText("Finished assignment")).not.toBeInTheDocument();
    expect(screen.queryByText("Confirmed assignment")).not.toBeInTheDocument();
  });

  it("hides already-submitted reviews and reviews whose deadline passed", async () => {
    useAssignmentsMock.mockReturnValue({ data: [] });
    useAssignedReviewsInboxMock.mockReturnValue({
      data: [
        inboxReview("rev-todo", 3, "not_started"),
        inboxReview("rev-overdue", -1, "not_started"),
        inboxReview("rev-done", 3, "submitted"),
      ],
      isLoading: false,
    });
    renderPage();

    await screen.findByText("Review rev-todo");
    expect(screen.queryByText("Review rev-overdue")).not.toBeInTheDocument();
    expect(screen.queryByText("Review rev-done")).not.toBeInTheDocument();
  });

  it("sorts pending reviews by deadline ascending", async () => {
    useAssignmentsMock.mockReturnValue({ data: [] });
    useAssignedReviewsInboxMock.mockReturnValue({
      data: [
        inboxReview("rev-late", 10, "not_started"),
        inboxReview("rev-early", 1, "not_started"),
        inboxReview("rev-mid", 5, "not_started"),
      ],
      isLoading: false,
    });
    renderPage();

    await screen.findByText("Review rev-early");
    await waitFor(() => {
      const titles = screen
        .getAllByText(/^Review rev-/)
        .map((el) => el.textContent)
        .filter(Boolean);
      expect(titles).toEqual(["Review rev-early", "Review rev-mid", "Review rev-late"]);
    });
  });

  it("sorts not-submitted before submitted, then by date ascending", async () => {
    useAssignmentsMock.mockReturnValue({
      data: [
        assignment("a-sub-early", "Submitted early", 1),
        assignment("a-todo-late", "Todo late", 10),
        assignment("a-todo-mid", "Todo mid", 5),
        assignment("a-sub-late", "Submitted late", 7),
      ],
    });
    getMineSubmissionIdMock.mockImplementation((id: string) =>
      Promise.resolve(id.startsWith("a-sub") ? `sub-${id}` : null),
    );
    renderPage();

    await screen.findByText("Todo mid");

    await waitFor(() => {
      const buttons = screen.getAllByRole("button");
      const titles = buttons
        .map((b) => within(b).queryByText(/Todo|Submitted/)?.textContent)
        .filter(Boolean);
      expect(titles).toEqual(["Todo mid", "Todo late", "Submitted early", "Submitted late"]);
    });
  });
});
