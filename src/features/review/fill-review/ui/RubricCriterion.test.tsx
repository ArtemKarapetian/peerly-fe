import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import type { Criterion } from "@/entities/rubric/model/types.ts";

import { RubricCriterion } from "./RubricCriterion";

const baseCriterion: Criterion = {
  id: "c-1",
  name: "Clarity",
  description: "Is the writing clear",
  maxScore: 3,
  required: true,
};

describe("RubricCriterion", () => {
  it("renders the criterion name and score buttons", () => {
    render(
      <RubricCriterion
        criterion={baseCriterion}
        value={{ criterionId: "c-1", score: null, comment: "" }}
        onChange={vi.fn()}
      />,
    );
    expect(screen.getByText("Clarity")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "0" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "3" })).toBeInTheDocument();
  });

  it("calls onChange with the selected score", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(
      <RubricCriterion
        criterion={baseCriterion}
        value={{ criterionId: "c-1", score: null, comment: "" }}
        onChange={onChange}
      />,
    );
    await user.click(screen.getByRole("button", { name: "2" }));
    expect(onChange).toHaveBeenCalledWith({ criterionId: "c-1", score: 2, comment: "" });
  });

  it("renders the error block when error is provided", () => {
    render(
      <RubricCriterion
        criterion={baseCriterion}
        value={{ criterionId: "c-1", score: null, comment: "" }}
        onChange={vi.fn()}
        error="Required"
      />,
    );
    expect(screen.getByText("Required")).toBeInTheDocument();
  });
});
