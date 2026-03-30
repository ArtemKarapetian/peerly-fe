import { CheckCircle, AlertCircle, Info } from "lucide-react";
import { useTranslation } from "react-i18next";

/**
 * ReviewProgress - Индикатор прогресса рецензии и подсказки
 *
 * Displays:
 * - Progress: filled criteria count
 * - Validation tips
 * - Constraints (min comment length, etc.)
 */

interface ReviewProgressProps {
  filledCriteria: number;
  totalCriteria: number;
  overallCommentLength: number;
  minOverallCommentLength?: number;
  tips?: string[];
}

export function ReviewProgress({
  filledCriteria,
  totalCriteria,
  overallCommentLength,
  minOverallCommentLength = 0,
  tips = [],
}: ReviewProgressProps) {
  const { t } = useTranslation();
  const progress = totalCriteria > 0 ? (filledCriteria / totalCriteria) * 100 : 0;
  const isComplete = filledCriteria === totalCriteria;
  const isCommentValid =
    minOverallCommentLength === 0 || overallCommentLength >= minOverallCommentLength;

  return (
    <div className="bg-card border-2 border-border rounded-[16px] p-4 desktop:p-5">
      {/* Header */}
      <h3 className="text-[16px] desktop:text-[18px] font-medium text-foreground tracking-[-0.5px] mb-4">
        {t("feature.reviewProgress.title")}
      </h3>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[13px] text-muted-foreground">
            {t("feature.reviewProgress.criteriaFilled")}
          </span>
          <span className="text-[14px] font-medium text-foreground">
            {filledCriteria} / {totalCriteria}
          </span>
        </div>
        <div className="w-full h-2 bg-border rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              isComplete ? "bg-success" : "bg-brand-primary"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Overall Comment Progress */}
      {minOverallCommentLength > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            {isCommentValid ? (
              <CheckCircle className="w-4 h-4 text-success" />
            ) : (
              <AlertCircle className="w-4 h-4 text-warning" />
            )}
            <span className="text-[13px] text-muted-foreground">
              {t("feature.reviewProgress.overallComment")}
            </span>
          </div>
          <p className={`text-[13px] ${isCommentValid ? "text-success" : "text-muted-foreground"}`}>
            {overallCommentLength} / {minOverallCommentLength}{" "}
            {t("feature.reviewProgress.characters")}
          </p>
        </div>
      )}

      {/* Checklist */}
      <div className="mb-4 pt-4 border-t border-border">
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            {isComplete ? (
              <CheckCircle className="w-4 h-4 text-success shrink-0 mt-0.5" />
            ) : (
              <div className="w-4 h-4 rounded-full border-2 border-border shrink-0 mt-0.5" />
            )}
            <span
              className={`text-[13px] ${isComplete ? "text-success" : "text-muted-foreground"}`}
            >
              {t("feature.reviewProgress.allCriteriaRated")}
            </span>
          </div>

          <div className="flex items-start gap-2">
            {isCommentValid ? (
              <CheckCircle className="w-4 h-4 text-success shrink-0 mt-0.5" />
            ) : (
              <div className="w-4 h-4 rounded-full border-2 border-border shrink-0 mt-0.5" />
            )}
            <span
              className={`text-[13px] ${isCommentValid ? "text-success" : "text-muted-foreground"}`}
            >
              {minOverallCommentLength > 0
                ? t("feature.reviewProgress.commentLongEnough")
                : t("feature.reviewProgress.commentWritten")}
            </span>
          </div>
        </div>
      </div>

      {/* Tips */}
      {tips.length > 0 && (
        <div className="pt-4 border-t border-border">
          <div className="flex items-center gap-2 mb-2">
            <Info className="w-4 h-4 text-brand-primary" />
            <span className="text-[13px] font-medium text-foreground">
              {t("feature.reviewProgress.tips")}
            </span>
          </div>
          <ul className="space-y-1.5">
            {tips.map((tip, index) => (
              <li key={index} className="text-[13px] text-muted-foreground leading-[1.4] pl-3">
                • {tip}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
