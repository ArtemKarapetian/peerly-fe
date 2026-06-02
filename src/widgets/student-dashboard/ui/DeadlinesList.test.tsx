import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { DeadlinesList, type DeadlineItem } from "./DeadlinesList";

vi.mock("@/shared/lib/formatDate", () => ({
  formatDateTime: (iso: string) => iso,
}));

const items: DeadlineItem[] = [
  {
    id: "d-1",
    courseId: "c-1",
    courseName: "Course A",
    taskId: "t-1",
    taskTitle: "Essay",
    dueDate: new Date("2026-06-01").toISOString(),
    status: "NOT_STARTED",
    isUrgent: true,
  },
  {
    id: "d-2",
    courseId: "c-2",
    courseName: "Course B",
    taskId: "t-2",
    taskTitle: "Quiz",
    dueDate: new Date("2026-06-10").toISOString(),
    status: "SUBMITTED",
  },
];

describe("DeadlinesList", () => {
  it("renders the empty state when there are no deadlines", () => {
    render(<DeadlinesList items={[]} onTaskClick={vi.fn()} />);
    expect(screen.getByText(/widget\.deadlinesList\.noDeadlines/)).toBeInTheDocument();
  });

  it("renders titles and course names for items", () => {
    render(<DeadlinesList items={items} onTaskClick={vi.fn()} />);
    expect(screen.getByText("Essay")).toBeInTheDocument();
    expect(screen.getByText("Quiz")).toBeInTheDocument();
    expect(screen.getByText("Course A")).toBeInTheDocument();
    expect(screen.getByText("Course B")).toBeInTheDocument();
  });

  it("calls onTaskClick with courseId and taskId", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<DeadlinesList items={items} onTaskClick={onClick} />);
    await user.click(screen.getByText("Essay"));
    expect(onClick).toHaveBeenCalledWith("c-1", "t-1");
  });
});
