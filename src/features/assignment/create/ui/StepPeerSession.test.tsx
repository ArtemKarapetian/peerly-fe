import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import type { AssignmentFormData } from "../model/types";

import { StepPeerSession } from "./StepPeerSession";

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
    discrepancyThreshold: 2,
    status: "draft",
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
    ...overrides,
  };
}

describe("StepPeerSession", () => {
  it("updates reviewsPerSubmission when range input changes", () => {
    const onUpdate = vi.fn();
    const { container } = render(<StepPeerSession data={makeData()} onUpdate={onUpdate} />);

    const ranges = container.querySelectorAll("input[type='range']");
    fireEvent.change(ranges[0]!, { target: { value: "5" } });

    expect(onUpdate).toHaveBeenCalledWith({ reviewsPerSubmission: 5 });
  });

  it("updates reviewsPerSubmission when number input changes within bounds", () => {
    const onUpdate = vi.fn();
    const { container } = render(<StepPeerSession data={makeData()} onUpdate={onUpdate} />);

    const numbers = container.querySelectorAll("input[type='number']");
    fireEvent.change(numbers[0]!, { target: { value: "7" } });

    expect(onUpdate).toHaveBeenCalledWith({ reviewsPerSubmission: 7 });
  });

  it("clamps reviewsPerSubmission above max=10", () => {
    const onUpdate = vi.fn();
    const { container } = render(<StepPeerSession data={makeData()} onUpdate={onUpdate} />);

    const numbers = container.querySelectorAll("input[type='number']");
    fireEvent.change(numbers[0]!, { target: { value: "999" } });

    expect(onUpdate).toHaveBeenCalledWith({ reviewsPerSubmission: 10 });
  });

  it("updates discrepancyThreshold via the second range input", () => {
    const onUpdate = vi.fn();
    const { container } = render(<StepPeerSession data={makeData()} onUpdate={onUpdate} />);

    const ranges = container.querySelectorAll("input[type='range']");
    fireEvent.change(ranges[1]!, { target: { value: "5" } });

    expect(onUpdate).toHaveBeenCalledWith({ discrepancyThreshold: 5 });
  });

  it("clamps discrepancyThreshold above max=10 (points scale)", () => {
    const onUpdate = vi.fn();
    const { container } = render(<StepPeerSession data={makeData()} onUpdate={onUpdate} />);

    const numbers = container.querySelectorAll("input[type='number']");
    fireEvent.change(numbers[1]!, { target: { value: "500" } });

    expect(onUpdate).toHaveBeenCalledWith({ discrepancyThreshold: 10 });
  });

  it("clamps discrepancyThreshold below min=1", () => {
    const onUpdate = vi.fn();
    const { container } = render(<StepPeerSession data={makeData()} onUpdate={onUpdate} />);

    const numbers = container.querySelectorAll("input[type='number']");
    fireEvent.change(numbers[1]!, { target: { value: "0" } });

    expect(onUpdate).toHaveBeenCalledWith({ discrepancyThreshold: 2 });
  });
});
