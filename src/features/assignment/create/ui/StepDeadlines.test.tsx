import { render, screen } from "@testing-library/react";
import { fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import type { AssignmentFormData } from "../model/types";

import { StepDeadlines } from "./StepDeadlines";

function makeData(overrides: Partial<AssignmentFormData> = {}): AssignmentFormData {
  return {
    courseId: "c-1",
    groupId: null,
    title: "T",
    description: "",
    submissionDeadline: null,
    reviewDeadline: null,
    rubricId: null,
    reviewsPerSubmission: 3,
    discrepancyThreshold: 30,
    status: "draft",
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
    ...overrides,
  };
}

describe("StepDeadlines", () => {
  it("fires onUpdate with a Date when submission deadline changes", () => {
    const onUpdate = vi.fn();
    const { container } = render(<StepDeadlines data={makeData()} onUpdate={onUpdate} />);

    const submissionInput = container.querySelectorAll("input[type='datetime-local']")[0]!;
    fireEvent.change(submissionInput, { target: { value: "2026-06-01T10:00" } });

    expect(onUpdate).toHaveBeenCalledTimes(1);
    const call = onUpdate.mock.calls[0]![0]! as { submissionDeadline: Date };
    expect(call.submissionDeadline).toBeInstanceOf(Date);
    expect(call.submissionDeadline.getFullYear()).toBe(2026);
    expect(call.submissionDeadline.getMonth()).toBe(5); // June
  });

  it("fires onUpdate with null when input is cleared", () => {
    const onUpdate = vi.fn();
    const { container } = render(
      <StepDeadlines
        data={makeData({ submissionDeadline: new Date("2026-06-01T10:00") })}
        onUpdate={onUpdate}
      />,
    );

    const submissionInput = container.querySelectorAll("input[type='datetime-local']")[0]!;
    fireEvent.change(submissionInput, { target: { value: "" } });

    expect(onUpdate).toHaveBeenCalledWith({ submissionDeadline: null });
  });

  it("renders a warning when review window is less than 2 days", () => {
    const submission = new Date("2026-06-01T10:00");
    const review = new Date("2026-06-02T10:00"); // 1 day later
    render(
      <StepDeadlines
        data={makeData({ submissionDeadline: submission, reviewDeadline: review })}
        onUpdate={vi.fn()}
      />,
    );

    expect(
      screen.getByText(/feature\.assignmentCreate\.deadlines\.reviewTimeWarning/),
    ).toBeInTheDocument();
  });

  it("does not render warning when review window is at least 2 days", () => {
    const submission = new Date("2026-06-01T10:00");
    const review = new Date("2026-06-05T10:00"); // 4 days
    render(
      <StepDeadlines
        data={makeData({ submissionDeadline: submission, reviewDeadline: review })}
        onUpdate={vi.fn()}
      />,
    );

    expect(
      screen.queryByText(/feature\.assignmentCreate\.deadlines\.reviewTimeWarning/),
    ).not.toBeInTheDocument();
  });

  it("renders the static warning section regardless of deadlines", () => {
    render(<StepDeadlines data={makeData()} onUpdate={vi.fn()} />);
    expect(
      screen.getByText(/feature\.assignmentCreate\.deadlines\.warningTitle/),
    ).toBeInTheDocument();
  });
});
