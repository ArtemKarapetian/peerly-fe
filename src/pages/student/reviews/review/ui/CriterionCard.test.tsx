import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import type { RubricCriterion } from "@/entities/rubric";

import type { UICriterionScore } from "@/features/review/fill-review/model/rubric";

import { CriterionCard } from "./CriterionCard";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (k: string) => k }),
}));

const CRIT: RubricCriterion = {
  id: "c1",
  name: "Clarity",
  description: "Is it clear?",
  maxScore: 4,
  commentRequired: false,
  position: 0,
};

function makeScore(overrides: Partial<UICriterionScore> = {}): UICriterionScore {
  return { criterionId: "c1", score: null, comment: "", ...overrides };
}

describe("CriterionCard (student review)", () => {
  it("renders one button per point up to maxScore", () => {
    render(
      <CriterionCard criterion={CRIT} score={makeScore()} readonly={false} onChange={vi.fn()} />,
    );
    expect(screen.getByRole("button", { name: "1" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "4" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "5" })).not.toBeInTheDocument();
  });

  it("renders criterion name and description", () => {
    render(
      <CriterionCard criterion={CRIT} score={makeScore()} readonly={false} onChange={vi.fn()} />,
    );
    expect(screen.getByText("Clarity")).toBeInTheDocument();
    expect(screen.getByText("Is it clear?")).toBeInTheDocument();
  });

  it("calls onChange with the picked score when a number button is clicked", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <CriterionCard criterion={CRIT} score={makeScore()} readonly={false} onChange={onChange} />,
    );
    await user.click(screen.getByRole("button", { name: "3" }));
    expect(onChange).toHaveBeenCalledWith({ criterionId: "c1", score: 3, comment: "" });
  });

  it("disables score buttons when readonly", () => {
    render(
      <CriterionCard
        criterion={CRIT}
        score={makeScore({ score: 2 })}
        readonly
        onChange={vi.fn()}
      />,
    );
    expect(screen.getByRole("button", { name: "1" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "2" })).toBeDisabled();
  });

  it("passes comment changes through onChange", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <CriterionCard criterion={CRIT} score={makeScore()} readonly={false} onChange={onChange} />,
    );
    const textarea = screen.getByRole("textbox");
    await user.type(textarea, "a");
    expect(onChange).toHaveBeenLastCalledWith({ criterionId: "c1", score: null, comment: "a" });
  });
});
