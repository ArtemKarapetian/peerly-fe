import { useMemo, useState } from "react";

import { serializeReview } from "@/features/review/fill-review/model/markdown";
import {
  MIN_OVERALL_COMMENT_LENGTH,
  aggregateMark,
  type CriterionScore,
  type RubricCriterion,
} from "@/features/review/fill-review/model/rubric";

import { CriterionCard } from "./CriterionCard";
import { OverallCommentCard } from "./OverallCommentCard";
import { ProgressCard } from "./ProgressCard";
import { SubmissionPreviewCard, type SubmissionPreview } from "./SubmissionPreviewCard";
import { SubmitReviewButton } from "./SubmitReviewButton";

interface ReviewFormProps {
  submission: SubmissionPreview;
  criteria: RubricCriterion[];
  readonly: boolean;
  initialScores: CriterionScore[];
  initialOverallComment: string;
  isSubmitting: boolean;
  onSubmit: (payload: { mark: number; comment: string }) => void;
}

export function ReviewForm({
  submission,
  criteria,
  readonly,
  initialScores,
  initialOverallComment,
  isSubmitting,
  onSubmit,
}: ReviewFormProps) {
  const [scores, setScores] = useState<CriterionScore[]>(initialScores);
  const [overallComment, setOverallComment] = useState(initialOverallComment);

  const filledCount = useMemo(() => scores.filter((s) => s.score !== null).length, [scores]);
  const overallValid = overallComment.trim().length >= MIN_OVERALL_COMMENT_LENGTH;
  const canSubmit = filledCount === criteria.length && overallValid && !isSubmitting && !readonly;

  const handleScoreChange = (criterionId: string, next: CriterionScore) => {
    setScores((prev) => prev.map((s) => (s.criterionId === criterionId ? next : s)));
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit({
      mark: aggregateMark(scores),
      comment: serializeReview({ scores, overallComment }, criteria),
    });
  };

  return (
    <div className="mt-6 desktop:grid desktop:grid-cols-[1fr_320px] desktop:gap-6 desktop:items-start">
      <div className="space-y-6">
        <SubmissionPreviewCard {...submission} />

        {criteria.map((criterion) => {
          const score = scores.find((s) => s.criterionId === criterion.id);
          if (!score) return null;
          return (
            <CriterionCard
              key={criterion.id}
              criterion={criterion}
              score={score}
              readonly={readonly}
              onChange={(next) => handleScoreChange(criterion.id, next)}
            />
          );
        })}

        <OverallCommentCard
          value={overallComment}
          minLength={MIN_OVERALL_COMMENT_LENGTH}
          readonly={readonly}
          onChange={setOverallComment}
        />

        {!readonly && (
          <div className="desktop:hidden bg-muted border-2 border-border rounded-lg p-4">
            <SubmitReviewButton canSubmit={canSubmit} onSubmit={handleSubmit} />
          </div>
        )}
      </div>

      <div className="hidden desktop:block desktop:sticky desktop:top-6 space-y-4">
        <ProgressCard
          filled={filledCount}
          total={criteria.length}
          commentLength={overallComment.length}
          commentMin={MIN_OVERALL_COMMENT_LENGTH}
        />

        {!readonly && (
          <div className="bg-card border border-border shadow-sm rounded-lg p-4">
            <SubmitReviewButton canSubmit={canSubmit} onSubmit={handleSubmit} />
          </div>
        )}
      </div>
    </div>
  );
}
