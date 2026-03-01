import { CriterionScore } from "@/entities/review/model/types.ts";
import { RubricSectionData } from "@/entities/rubric/model/types.ts";

import { RubricCriterion } from "./RubricCriterion.tsx";

/**
 * RubricSection - Секция рубрики с несколькими критериями
 *
 * Features:
 * - Section header with description
 * - List of criteria
 * - Pass errors to criteria
 */

interface RubricSectionProps {
  section: RubricSectionData;
  scores: CriterionScore[];
  onScoreChange: (criterionId: string, score: CriterionScore) => void;
  errors?: Record<string, string>; // criterionId -> error message
  readonly?: boolean;
  onCriterionFocus?: (criterionId: string) => void;
}

export function RubricSection({
  section,
  scores,
  onScoreChange,
  errors = {},
  readonly = false,
  onCriterionFocus,
}: RubricSectionProps) {
  return (
    <div className="bg-white border-2 border-[#e6e8ee] rounded-[16px] p-4 desktop:p-6">
      {/* Section Header */}
      <div className="mb-6 pb-4 border-b border-[#e6e8ee]">
        <h3 className="text-[18px] desktop:text-[20px] font-medium text-[#21214f] tracking-[-0.5px] mb-1">
          {section.name}
        </h3>
        {section.description && (
          <p className="text-[14px] text-[#767692] leading-[1.5]">{section.description}</p>
        )}
      </div>

      {/* Criteria */}
      <div className="space-y-6">
        {section.criteria.map((criterion) => {
          const criterionScore = scores.find((s) => s.criterionId === criterion.id) || {
            criterionId: criterion.id,
            score: null,
            comment: "",
          };

          return (
            <RubricCriterion
              key={criterion.id}
              criterion={criterion}
              value={criterionScore}
              onChange={(value) => onScoreChange(criterion.id, value)}
              error={errors[criterion.id]}
              readonly={readonly}
              onFocus={() => onCriterionFocus?.(criterion.id)}
            />
          );
        })}
      </div>
    </div>
  );
}
