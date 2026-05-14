import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AssignmentPickerModal } from "./AssignmentPickerModal";

const { courseRepoMock, assignmentRepoMock } = vi.hoisted(() => ({
  courseRepoMock: { getAll: vi.fn() },
  assignmentRepoMock: { getAll: vi.fn() },
}));

vi.mock("@/entities/course", () => ({
  courseRepo: courseRepoMock,
}));

vi.mock("@/entities/assignment", () => ({
  assignmentRepo: assignmentRepoMock,
}));

beforeEach(() => {
  courseRepoMock.getAll.mockReset();
  assignmentRepoMock.getAll.mockReset();
  courseRepoMock.getAll.mockResolvedValue([
    {
      id: "c-1",
      name: "Algebra",
      code: "ALG",
    },
  ]);
  assignmentRepoMock.getAll.mockResolvedValue([
    {
      id: "a-1",
      courseId: "c-1",
      title: "Linear Equations",
      description: "Solve them",
      dueDate: new Date("2026-06-01"),
      reviewCount: 3,
      status: "published",
      backendStatus: "inProgress",
    },
  ]);
});

describe("AssignmentPickerModal", () => {
  it("renders the rubric name in the header", () => {
    render(<AssignmentPickerModal rubricId="r-1" rubricName="Standard Essay" onClose={vi.fn()} />);
    expect(screen.getByText("Standard Essay")).toBeInTheDocument();
    expect(screen.getByText(/feature\.assignmentPicker\.title/)).toBeInTheDocument();
  });

  it("renders fetched assignments after the async load", async () => {
    render(<AssignmentPickerModal rubricId="r-1" rubricName="Standard Essay" onClose={vi.fn()} />);
    await waitFor(() => {
      expect(screen.getByText("Linear Equations")).toBeInTheDocument();
    });
  });

  it("calls onClose when the close (X) button is clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<AssignmentPickerModal rubricId="r-1" rubricName="Standard Essay" onClose={onClose} />);
    const cancelBtn = screen.getByText(/common\.cancel/);
    await user.click(cancelBtn);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
