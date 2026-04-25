import { useState } from "react";
import { useTranslation } from "react-i18next";

import { CriterionScore } from "@/entities/review/model/types.ts";
import { RubricSectionData } from "@/entities/rubric/model/types.ts";

import { RubricSection } from "@/features/review/fill-review/ui/RubricSection.tsx";

import type { RubricData } from "../model/types";

/**
 * RubricPreview - Предпросмотр рубрики
 *
 * Отображает рубрику в том виде, как она будет выглядеть
 * для студентов в форме рецензирования
 */

interface RubricPreviewProps {
  rubric: RubricData;
}

export function RubricPreview({ rubric }: RubricPreviewProps) {
  const { t } = useTranslation();
  const [scores, setScores] = useState<CriterionScore[]>([]);

  // Convert RubricData to RubricSectionData format
  const section: RubricSectionData = {
    id: rubric.id,
    name: rubric.name,
    description: rubric.description,
    criteria: rubric.criteria.map((c) => ({
      id: c.id,
      name: c.name,
      description: c.description,
      maxScore: c.maxScore,
      required: c.required,
      commentRequired: c.commentRequired,
      minCommentLength: c.minCommentLength,
    })),
  };

  const handleScoreChange = (criterionId: string, score: CriterionScore) => {
    setScores((prev) => {
      const existing = prev.find((s) => s.criterionId === criterionId);
      if (existing) {
        return prev.map((s) => (s.criterionId === criterionId ? score : s));
      }
      return [...prev, score];
    });
  };

  // Calculate stats
  const totalPossible = rubric.criteria.reduce((sum, c) => sum + c.maxScore, 0);
  const totalScored = scores.reduce((sum, s) => sum + (s.score || 0), 0);
  const completedCount = scores.filter((s) => s.score !== null).length;
  const totalCriteria = rubric.criteria.length;
  const requiredCount = rubric.criteria.filter((c) => c.required).length;
  const completedRequiredCount = scores.filter(
    (s) => s.score !== null && rubric.criteria.find((c) => c.id === s.criterionId)?.required,
  ).length;

  return (
    <div>
      <div className="bg-info-light border-2 border-brand-primary rounded-[16px] p-4 mb-6">
        <h3 className="text-[16px] font-medium text-foreground mb-2">
          {t("widget.rubricPreview.previewMode")}
        </h3>
        <p className="text-[14px] text-muted-foreground">{t("widget.rubricPreview.previewDesc")}</p>
      </div>

      <div className="mb-6">
        <h2 className="text-[24px] font-medium text-foreground tracking-[-0.5px] mb-2">
          {rubric.name}
        </h2>
        <p className="text-[15px] text-muted-foreground leading-[1.5]">{rubric.description}</p>
      </div>

      <div className="border border-border rounded-[12px] p-4 mb-6">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-[24px] font-medium text-foreground">
              {completedCount}/{totalCriteria}
            </p>
            <p className="text-[12px] text-muted-foreground">
              {t("widget.rubricPreview.criteriaRated")}
            </p>
          </div>
          <div>
            <p className="text-[24px] font-medium text-foreground">
              {completedRequiredCount}/{requiredCount}
            </p>
            <p className="text-[12px] text-muted-foreground">
              {t("widget.rubricPreview.requiredLabel")}
            </p>
          </div>
          <div>
            <p className="text-[24px] font-medium text-brand-primary">
              {totalScored}/{totalPossible}
            </p>
            <p className="text-[12px] text-muted-foreground">
              {t("widget.rubricPreview.pointsScored")}
            </p>
          </div>
          <div>
            <p className="text-[24px] font-medium text-success">
              {totalPossible > 0 ? Math.round((totalScored / totalPossible) * 100) : 0}%
            </p>
            <p className="text-[12px] text-muted-foreground">{t("widget.rubricPreview.percent")}</p>
          </div>
        </div>
      </div>

      <RubricSection
        section={section}
        scores={scores}
        onScoreChange={handleScoreChange}
        readonly={false}
      />

      {rubric.criteria.some((c) => c.weight) && (
        <div className="mt-6 border-2 border-border rounded-[12px] p-4">
          <h4 className="text-[14px] font-medium text-foreground mb-3">
            {t("widget.rubricPreview.weightCoefficients")}
          </h4>
          <div className="space-y-2">
            {rubric.criteria.map((criterion) => (
              <div key={criterion.id} className="flex items-center justify-between">
                <span className="text-[13px] text-muted-foreground">{criterion.name}</span>
                <span className="text-[13px] font-medium text-foreground">
                  {criterion.weight
                    ? `${criterion.weight}%`
                    : t("widget.rubricPreview.notSpecified")}
                </span>
              </div>
            ))}
          </div>
          {rubric.criteria.reduce((sum, c) => sum + (c.weight || 0), 0) !== 100 && (
            <p className="text-[12px] text-warning mt-3 flex items-center gap-1">
              <span>⚠️</span>
              {t("widget.rubricPreview.weightsWarning")}
            </p>
          )}
        </div>
      )}

      <div className="mt-6 flex justify-end">
        <button
          onClick={() => setScores([])}
          className="px-4 py-2 border-2 border-border text-muted-foreground rounded-[12px] hover:border-brand-primary hover:text-foreground transition-colors text-[14px]"
        >
          {t("widget.rubricPreview.resetScores")}
        </button>
      </div>
    </div>
  );
}
