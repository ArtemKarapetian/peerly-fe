import { AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

import { CriterionScore } from "@/entities/review/model/types.ts";
import { Criterion } from "@/entities/rubric/model/types.ts";

interface RubricCriterionProps {
  criterion: Criterion;
  value: CriterionScore;
  onChange: (value: CriterionScore) => void;
  error?: string;
  readonly?: boolean;
  onFocus?: () => void;
}

/**
 * RubricCriterion - Критерий рубрики с выбором оценки и комментарием
 *
 * Features:
 * - Score selector (0-5 or custom scale)
 * - Comment field
 * - Validation error display
 * - Required indicator
 */

export function RubricCriterion({
  criterion,
  value,
  onChange,
  error,
  readonly = false,
  onFocus,
}: RubricCriterionProps) {
  const { t } = useTranslation();

  const handleScoreChange = (score: number) => {
    if (readonly) return;
    onChange({ ...value, score });
  };

  const handleCommentChange = (comment: string) => {
    if (readonly) return;
    onChange({ ...value, comment });
  };

  // Generate score options (0 to maxScore)
  const scoreOptions = Array.from({ length: criterion.maxScore + 1 }, (_, i) => i);

  return (
    <div
      className={`${readonly ? "opacity-75" : ""}`}
      data-criterion-id={criterion.id}
      tabIndex={readonly ? -1 : 0}
      onFocus={onFocus}
    >
      {/* Criterion Header */}
      <div className="mb-3">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h4 className="text-[15px] desktop:text-[16px] font-medium text-foreground">
            {criterion.name}
            {criterion.required && <span className="text-destructive ml-1">*</span>}
          </h4>
          <span className="text-[13px] text-muted-foreground shrink-0">
            {t("feature.rubricCriterion.maxPoints", { count: criterion.maxScore })}
          </span>
        </div>
        {criterion.description && (
          <p className="text-[13px] text-muted-foreground leading-[1.4]">{criterion.description}</p>
        )}
      </div>

      {/* Score Selector */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <label className="block text-[13px] text-muted-foreground">
            {t("feature.rubricCriterion.score")}
          </label>
          {!readonly && (
            <span className="text-[11px] text-text-tertiary italic">
              {t("feature.rubricCriterion.scoreHint")}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {scoreOptions.map((score) => (
            <button
              key={score}
              type="button"
              onClick={() => handleScoreChange(score)}
              disabled={readonly}
              className={`
                w-10 h-10 rounded-[8px] text-[14px] font-medium transition-all
                ${
                  value.score === score
                    ? "bg-brand-primary text-primary-foreground shadow-sm"
                    : "bg-muted text-foreground hover:bg-surface-hover"
                }
                ${readonly ? "cursor-not-allowed" : "cursor-pointer"}
              `}
            >
              {score}
            </button>
          ))}
        </div>
      </div>

      {/* Comment Field */}
      <div className="mb-2">
        <label className="block text-[13px] text-muted-foreground mb-2">
          {t("feature.rubricCriterion.comment")}
          {criterion.commentRequired && <span className="text-destructive ml-1">*</span>}
          {criterion.minCommentLength && (
            <span className="text-muted-foreground ml-1">
              ({t("feature.rubricCriterion.minChars", { count: criterion.minCommentLength })})
            </span>
          )}
        </label>
        <textarea
          value={value.comment}
          onChange={(e) => handleCommentChange(e.target.value)}
          disabled={readonly}
          rows={2}
          placeholder={t("feature.rubricCriterion.commentPlaceholder")}
          className={`
            w-full px-3 py-2 border-2 rounded-[8px] text-[14px] text-foreground 
            placeholder:text-text-tertiary transition-colors resize-none
            ${error ? "border-destructive bg-error-light" : "border-border focus:border-brand-primary"}
            ${readonly ? "bg-muted cursor-not-allowed" : "bg-card"}
          `}
          onFocus={onFocus}
        />
        {criterion.minCommentLength && value.comment && (
          <p
            className={`text-[12px] mt-1 ${
              value.comment.length >= criterion.minCommentLength
                ? "text-success"
                : "text-muted-foreground"
            }`}
          >
            {value.comment.length} / {criterion.minCommentLength}{" "}
            {t("feature.rubricCriterion.characters")}
          </p>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 bg-error-light border border-error rounded-[8px] p-2 mb-2">
          <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
          <p className="text-[13px] text-destructive">{error}</p>
        </div>
      )}
    </div>
  );
}
