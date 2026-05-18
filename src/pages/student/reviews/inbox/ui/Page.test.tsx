import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { InboxReview } from "@/widgets/reviews-inbox";

import ReviewsInboxPage from "./Page";

const { useAssignedReviewsInboxMock, navigateMock } = vi.hoisted(() => ({
  useAssignedReviewsInboxMock: vi.fn(),
  navigateMock: vi.fn(),
}));

vi.mock("@/widgets/reviews-inbox", async () => {
  const actual =
    await vi.importActual<typeof import("@/widgets/reviews-inbox")>("@/widgets/reviews-inbox");
  return { ...actual, useAssignedReviewsInbox: useAssignedReviewsInboxMock };
});

vi.mock("@/widgets/app-shell/AppShell.tsx", () => ({
  AppShell: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return { ...actual, useNavigate: () => navigateMock };
});

function makeReview(i: number, ts: number): InboxReview {
  return {
    id: `s-${i}`,
    taskTitle: `Task ${i}`,
    courseName: `Course ${i}`,
    courseId: `c-${i}`,
    taskId: `a-${i}`,
    reviewDeadline: new Date(ts).toISOString(),
    reviewDeadlineTimestamp: ts,
    status: "not_started",
    submittedReviewId: null,
    isAnonymous: true,
  };
}

function renderPage() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter>
        <ReviewsInboxPage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

beforeEach(() => {
  useAssignedReviewsInboxMock.mockReset();
  navigateMock.mockReset();
});

describe("ReviewsInboxPage", () => {
  it("sorts cards by deadline ascending by default", async () => {
    const base = Date.now() + 10 * 24 * 60 * 60 * 1000;
    useAssignedReviewsInboxMock.mockReturnValue({
      data: [
        makeReview(1, base + 3 * 86400000),
        makeReview(2, base + 1 * 86400000),
        makeReview(3, base + 2 * 86400000),
      ],
      isLoading: false,
    });
    renderPage();
    const titles = await screen.findAllByRole("heading", { level: 3 });
    expect(titles.map((h) => h.textContent)).toEqual(["Task 2", "Task 3", "Task 1"]);
  });

  it("reverses order when toggling the sort direction", async () => {
    const base = Date.now() + 10 * 24 * 60 * 60 * 1000;
    useAssignedReviewsInboxMock.mockReturnValue({
      data: [makeReview(1, base + 1 * 86400000), makeReview(2, base + 2 * 86400000)],
      isLoading: false,
    });
    renderPage();
    const sortButton = await screen.findByRole("button", { name: /reviewSort\.aria/ });
    await userEvent.click(sortButton);
    await waitFor(() => {
      const titles = screen.getAllByRole("heading", { level: 3 });
      expect(titles.map((h) => h.textContent)).toEqual(["Task 2", "Task 1"]);
    });
  });

  it("paginates when more than 9 items", async () => {
    const base = Date.now() + 10 * 24 * 60 * 60 * 1000;
    const reviews = Array.from({ length: 12 }, (_, i) => makeReview(i + 1, base + i * 86400000));
    useAssignedReviewsInboxMock.mockReturnValue({ data: reviews, isLoading: false });
    renderPage();
    const titles = await screen.findAllByRole("heading", { level: 3 });
    expect(titles).toHaveLength(9);
  });

  it("renders empty state when there are no assigned reviews", () => {
    useAssignedReviewsInboxMock.mockReturnValue({ data: [], isLoading: false });
    renderPage();
    expect(screen.getByText(/student\.reviews\.noAssigned/)).toBeInTheDocument();
  });

  it("shows loading state", () => {
    useAssignedReviewsInboxMock.mockReturnValue({ data: undefined, isLoading: true });
    renderPage();
    expect(screen.getByText(/common\.loading/)).toBeInTheDocument();
  });
});
