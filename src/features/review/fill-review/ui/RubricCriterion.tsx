import { AlertCircle } from "lucide-react";
import { Criterion } from "@/entities/rubric/model/types.ts";
import { CriterionScore } from "@/entities/review/model/types.ts";

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
          <h4 className="text-[15px] desktop:text-[16px] font-medium text-[#21214f]">
            {criterion.name}
            {criterion.required && <span className="text-[#d4183d] ml-1">*</span>}
          </h4>
          <span className="text-[13px] text-[#767692] shrink-0">
            Макс. {criterion.maxScore} баллов
          </span>
        </div>
        {criterion.description && (
          <p className="text-[13px] text-[#767692] leading-[1.4]">{criterion.description}</p>
        )}
      </div>

      {/* Score Selector */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <label className="block text-[13px] text-[#4b4963]">Оценка</label>
          {!readonly && (
            <span className="text-[11px] text-[#a0a0a0] italic">
              Подсказка: 1–5, 0 очистить, ↑/↓ навигация
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
                    ? "bg-[#5b8def] text-white shadow-sm"
                    : "bg-[#f9f9f9] text-[#21214f] hover:bg-[#e6e8ee]"
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
        <label className="block text-[13px] text-[#4b4963] mb-2">
          Комментарий
          {criterion.commentRequired && <span className="text-[#d4183d] ml-1">*</span>}
          {criterion.minCommentLength && (
            <span className="text-[#767692] ml-1">
              (мин. {criterion.minCommentLength} символов)
            </span>
          )}
        </label>
        <textarea
          value={value.comment}
          onChange={(e) => handleCommentChange(e.target.value)}
          disabled={readonly}
          rows={2}
          placeholder="Оставьте комментарий по этому критерию"
          className={`
            w-full px-3 py-2 border-2 rounded-[8px] text-[14px] text-[#21214f] 
            placeholder:text-[#b4b4b4] transition-colors resize-none
            ${error ? "border-[#d4183d] bg-[#fff5f5]" : "border-[#e6e8ee] focus:border-[#a0b8f1]"}
            ${readonly ? "bg-[#f9f9f9] cursor-not-allowed" : "bg-white"}
          `}
          onFocus={onFocus}
        />
        {criterion.minCommentLength && value.comment && (
          <p
            className={`text-[12px] mt-1 ${
              value.comment.length >= criterion.minCommentLength
                ? "text-[#4caf50]"
                : "text-[#767692]"
            }`}
          >
            {value.comment.length} / {criterion.minCommentLength} символов
          </p>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 bg-[#fff5f5] border border-[#ffcccc] rounded-[8px] p-2 mb-2">
          <AlertCircle className="w-4 h-4 text-[#d4183d] shrink-0 mt-0.5" />
          <p className="text-[13px] text-[#d4183d]">{error}</p>
        </div>
      )}
    </div>
  );
}
