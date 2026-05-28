import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { AssignmentFormData } from "../model/types";

import { StepPublish } from "./StepPublish";

const { courseRepoMock } = vi.hoisted(() => ({
  courseRepoMock: { getAll: vi.fn() },
}));

vi.mock("@/entities/course", () => ({
  courseRepo: courseRepoMock,
}));

function makeData(overrides: Partial<AssignmentFormData> = {}): AssignmentFormData {
  return {
    courseId: "c-1",
    title: "My Essay Assignment",
    description: "Write something",
    submissionDeadline: new Date("2026-06-01T10:00"),
    reviewDeadline: new Date("2026-06-10T10:00"),
    rubricId: "r-1",
    rubricName: "Standard Essay",
    reviewsPerSubmission: 4,
    discrepancyThreshold: 25,
    status: "draft",
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
    ...overrides,
  };
}

beforeEach(() => {
  courseRepoMock.getAll.mockReset();
  courseRepoMock.getAll.mockResolvedValue([
    {
      id: "c-1",
      title: "Algebra",
      description: "",
      code: "",
      teachers: [],
      enrollmentCount: 0,
      homeworkCount: 0,
      status: "active",
      archived: false,
      createdAt: new Date(),
      name: "Algebra",
      backendStatus: "inProgress",
    },
  ]);
});

describe("StepPublish", () => {
  it("renders summary fields from data prop", async () => {
    render(<StepPublish data={makeData()} onPublish={vi.fn()} />);

    expect(screen.getByText("My Essay Assignment")).toBeInTheDocument();
    expect(screen.getByText("Standard Essay")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText(/discrepancyValue/)).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText("Algebra")).toBeInTheDocument();
    });
  });

  it("calls onPublish(true) when 'Save Draft' is clicked", async () => {
    const user = userEvent.setup();
    const onPublish = vi.fn();
    render(<StepPublish data={makeData()} onPublish={onPublish} />);

    await user.click(screen.getByRole("button", { name: /publish\.saveDraft\b/ }));
    expect(onPublish).toHaveBeenCalledWith(true);
  });

  it("calls onPublish(false) when 'Publish' is clicked", async () => {
    const user = userEvent.setup();
    const onPublish = vi.fn();
    render(<StepPublish data={makeData()} onPublish={onPublish} />);

    await user.click(screen.getByRole("button", { name: /publish\.publishAssignment/ }));
    expect(onPublish).toHaveBeenCalledWith(false);
  });

  it("disables buttons while submitting", () => {
    render(<StepPublish data={makeData()} onPublish={vi.fn()} submitting />);
    const buttons = screen.getAllByRole("button");
    buttons.forEach((b) => expect(b).toBeDisabled());
  });

  it("shows error message when provided", () => {
    render(<StepPublish data={makeData()} onPublish={vi.fn()} errorMessage="Backend exploded" />);
    expect(screen.getByText("Backend exploded")).toBeInTheDocument();
  });

  it("shows placeholder for missing rubric name", () => {
    render(
      <StepPublish
        data={makeData({ rubricId: null, rubricName: undefined })}
        onPublish={vi.fn()}
      />,
    );
    expect(
      screen.getByText(/feature\.assignmentCreate\.publish\.rubricNotSelected/),
    ).toBeInTheDocument();
  });
});
