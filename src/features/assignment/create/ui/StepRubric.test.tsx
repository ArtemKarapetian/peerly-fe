import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import type { AssignmentFormData, RubricOption } from "../model/types";

import { StepRubric } from "./StepRubric";

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

const sampleRubrics: RubricOption[] = [
  { id: "r-1", name: "Standard Essay" },
  { id: "r-2", name: "Code Review" },
];

describe("StepRubric", () => {
  it("shows empty state when rubrics list is empty", () => {
    render(<StepRubric data={makeData()} onUpdate={vi.fn()} rubrics={[]} />);
    expect(screen.getByText(/feature\.assignmentCreate\.rubric\.noRubrics/)).toBeInTheDocument();
  });

  it("renders rubric cards when rubrics are provided", () => {
    render(<StepRubric data={makeData()} onUpdate={vi.fn()} rubrics={sampleRubrics} />);
    expect(screen.getByText("Standard Essay")).toBeInTheDocument();
    expect(screen.getByText("Code Review")).toBeInTheDocument();
  });

  it("fires onUpdate with rubricId and rubricName when a card is clicked", async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn();
    render(<StepRubric data={makeData()} onUpdate={onUpdate} rubrics={sampleRubrics} />);

    await user.click(screen.getByText("Code Review"));

    expect(onUpdate).toHaveBeenCalledWith({ rubricId: "r-2", rubricName: "Code Review" });
  });

  it("renders selected rubric summary card when a rubric is selected", () => {
    render(
      <StepRubric
        data={makeData({ rubricId: "r-1", rubricName: "Standard Essay" })}
        onUpdate={vi.fn()}
        rubrics={sampleRubrics}
      />,
    );

    expect(
      screen.getByText(/feature\.assignmentCreate\.rubric\.selectedRubric/),
    ).toBeInTheDocument();
  });

  it("fires onUpdate with null when deselect button is clicked", async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn();
    render(
      <StepRubric
        data={makeData({ rubricId: "r-1", rubricName: "Standard Essay" })}
        onUpdate={onUpdate}
        rubrics={sampleRubrics}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: /feature\.assignmentCreate\.rubric\.deselect/ }),
    );
    expect(onUpdate).toHaveBeenCalledWith({ rubricId: null, rubricName: undefined });
  });

  it("filters rubrics by search query", async () => {
    const user = userEvent.setup();
    render(<StepRubric data={makeData()} onUpdate={vi.fn()} rubrics={sampleRubrics} />);

    const search = screen.getByPlaceholderText(/searchPlaceholder/);
    await user.type(search, "code");

    expect(screen.queryByText("Standard Essay")).not.toBeInTheDocument();
    expect(screen.getByText("Code Review")).toBeInTheDocument();
  });
});
