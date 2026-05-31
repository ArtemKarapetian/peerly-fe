import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import type { RubricCriterion } from "@/entities/rubric";

import type { UICriterionScore } from "@/features/review/fill-review/model/rubric";

import { ReviewForm } from "./ReviewForm";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (k: string) => k }),
}));

const CRITERIA: RubricCriterion[] = [
  {
    id: "c1",
    name: "Clarity",
    description: null,
    maxScore: 5,
    commentRequired: false,
    position: 0,
  },
  {
    id: "c2",
    name: "Depth",
    description: null,
    maxScore: 5,
    commentRequired: true,
    position: 1,
  },
];

const SUBMISSION = { comment: "see attached", files: [] };

function emptyScores(): UICriterionScore[] {
  return CRITERIA.map((c) => ({ criterionId: c.id, score: null, comment: "" }));
}

describe("ReviewForm", () => {
  it("disables Submit until all criteria scored and overall comment passes the min length", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(
      <ReviewForm
        submission={SUBMISSION}
        criteria={CRITERIA}
        readonly={false}
        initialScores={emptyScores()}
        initialOverallComment=""
        isSubmitting={false}
        onSubmit={onSubmit}
      />,
    );

    const submit = screen.getAllByText(/page\.reviewFill\.submit/i)[0].closest("button")!;
    expect(submit).toBeDisabled();

    await user.click(screen.getAllByRole("button", { name: "5" })[0]);
    await user.click(screen.getAllByRole("button", { name: "5" })[1]);
    expect(submit).toBeDisabled();

    const textareas = screen.getAllByRole("textbox");
    const overall = textareas[textareas.length - 1];
    await user.type(overall, "a".repeat(40));

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("blocks Submit when commentRequired criterion has no comment", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(
      <ReviewForm
        submission={SUBMISSION}
        criteria={CRITERIA}
        readonly={false}
        initialScores={emptyScores()}
        initialOverallComment={"a".repeat(40)}
        isSubmitting={false}
        onSubmit={onSubmit}
      />,
    );

    await user.click(screen.getAllByRole("button", { name: "5" })[0]);
    await user.click(screen.getAllByRole("button", { name: "5" })[1]);

    const submit = screen.getAllByText(/page\.reviewFill\.submit/i)[0].closest("button")!;
    expect(submit).toBeDisabled();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("submits scores array (not mark) when canSubmit is true", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    const initial: UICriterionScore[] = [
      { criterionId: "c1", score: 4, comment: "" },
      { criterionId: "c2", score: 5, comment: "looks good" },
    ];
    render(
      <ReviewForm
        submission={SUBMISSION}
        criteria={CRITERIA}
        readonly={false}
        initialScores={initial}
        initialOverallComment={"a".repeat(40)}
        isSubmitting={false}
        onSubmit={onSubmit}
      />,
    );

    const submit = screen.getAllByText(/page\.reviewFill\.submit/i)[0].closest("button")!;
    expect(submit).not.toBeDisabled();
    await user.click(submit);

    expect(onSubmit).toHaveBeenCalledTimes(1);
    const arg = onSubmit.mock.calls[0][0] as {
      scores: { criterionId: string; score: number; comment: string | null }[];
      comment: string;
    };
    expect(arg.scores).toEqual([
      { criterionId: "c1", score: 4, comment: null },
      { criterionId: "c2", score: 5, comment: "looks good" },
    ]);
    expect(arg.comment).toBe("a".repeat(40));
  });
});
