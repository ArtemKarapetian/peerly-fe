import { Send } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { serializeReview } from "@/features/review/fill-review/model/markdown";
import {
  aggregateMark,
  MIN_OVERALL_COMMENT_LENGTH,
  type CriterionScore,
  type RubricCriterion,
} from "@/features/review/fill-review/model/rubric";

import { CriterionCard } from "./CriterionCard";

interface SubmissionPreview {
  comment: string;
  files: { id: string; name: string; size: number }[];
  checklist: string;
}

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
  const { t } = useTranslation();
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

        <div className="bg-card border border-border shadow-sm rounded-[16px] p-4 desktop:p-6">
          <h3 className="text-[18px] desktop:text-[20px] tracking-[-0.3px] text-foreground font-medium mb-2">
            {t("page.reviewFill.overallComment")}
            <span className="text-error ml-1">*</span>
          </h3>
          <textarea
            value={overallComment}
            disabled={readonly}
            onChange={(e) => setOverallComment(e.target.value)}
            rows={5}
            placeholder={t("page.reviewFill.overallCommentPlaceholder")}
            className={`w-full px-3 py-2 border-2 border-border rounded-[10px] text-[14px] resize-none transition-colors ${
              readonly
                ? "bg-muted text-muted-foreground cursor-not-allowed"
                : "bg-card text-foreground focus:border-brand-primary focus:outline-none"
            }`}
          />
          <p
            className={`text-[12px] mt-2 ${overallValid ? "text-success" : "text-muted-foreground"}`}
          >
            {overallComment.length} / {MIN_OVERALL_COMMENT_LENGTH}{" "}
            {t("page.reviewFill.characters", { count: overallComment.length })}
          </p>
        </div>

        {!readonly && (
          <div className="desktop:hidden bg-muted border-2 border-border rounded-[16px] p-4">
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-brand-primary hover:bg-brand-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground rounded-[12px] text-[15px] font-medium transition-colors"
            >
              <Send className="w-4 h-4" />
              <span>{t("page.reviewFill.submitReview")}</span>
            </button>
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
          <div className="bg-card border border-border shadow-sm rounded-[16px] p-4">
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-brand-primary hover:bg-brand-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground rounded-[12px] text-[15px] font-medium transition-colors"
            >
              <Send className="w-4 h-4" />
              <span>{t("page.reviewFill.submitReview")}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function SubmissionPreviewCard({ comment, files, checklist }: SubmissionPreview) {
  const { t } = useTranslation();
  return (
    <div className="bg-card border border-border shadow-sm rounded-[16px] p-4 desktop:p-6 space-y-4">
      <h2 className="text-[20px] desktop:text-[22px] tracking-[-0.3px] text-foreground font-medium">
        {t("page.reviewFill.workTitle")}
      </h2>

      {checklist.trim() ? (
        <div className="bg-muted rounded-[10px] p-3">
          <p className="text-[12px] text-muted-foreground uppercase tracking-wide mb-1">
            {t("student.task.checklist")}
          </p>
          <p className="text-[14px] text-foreground whitespace-pre-wrap">{checklist}</p>
        </div>
      ) : null}

      <div>
        <p className="text-[12px] text-muted-foreground uppercase tracking-wide mb-1">
          {t("page.reviewFill.studentComment")}
        </p>
        <p className="text-[14px] text-foreground whitespace-pre-wrap">
          {comment.trim() || t("page.reviewFill.noStudentComment")}
        </p>
      </div>

      {files.length > 0 && (
        <div>
          <p className="text-[12px] text-muted-foreground uppercase tracking-wide mb-2">
            {t("page.reviewFill.files")}
          </p>
          <ul className="space-y-1">
            {files.map((f) => (
              <li
                key={f.id}
                className="text-[14px] text-foreground bg-muted rounded-[8px] px-3 py-2"
              >
                {f.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function ProgressCard({
  filled,
  total,
  commentLength,
  commentMin,
}: {
  filled: number;
  total: number;
  commentLength: number;
  commentMin: number;
}) {
  const { t } = useTranslation();
  const allCriteriaDone = filled === total;
  const commentDone = commentLength >= commentMin;
  return (
    <div className="bg-card border border-border shadow-sm rounded-[16px] p-4">
      <h3 className="text-[16px] font-medium text-foreground mb-3">
        {t("page.reviewFill.progressTitle")}
      </h3>
      <div className="space-y-2 text-[14px]">
        <div className={allCriteriaDone ? "text-success" : "text-muted-foreground"}>
          {allCriteriaDone ? "✓" : "○"} {t("page.reviewFill.progressCriteria")}: {filled} / {total}
        </div>
        <div className={commentDone ? "text-success" : "text-muted-foreground"}>
          {commentDone ? "✓" : "○"} {t("page.reviewFill.progressComment")}: {commentLength} /{" "}
          {commentMin}
        </div>
      </div>
    </div>
  );
}
