import { Card, Textarea } from "@/shared/ui";

import type { CriterionScore, RubricCriterion } from "@/features/review/fill-review/model/rubric";

interface CriterionCardProps {
  criterion: RubricCriterion;
  score: CriterionScore;
  readonly: boolean;
  onChange: (next: CriterionScore) => void;
}

const SCORE_VALUES = [1, 2, 3, 4, 5];

export function CriterionCard({ criterion, score, readonly, onChange }: CriterionCardProps) {
  return (
    <Card variant="section">
      <h3 className="text-lg desktop:text-xl tracking-[-0.3px] text-foreground font-medium mb-4">
        {criterion.title}
      </h3>

      <div className="flex gap-2 mb-4">
        {SCORE_VALUES.map((v) => {
          const selected = score.score === v;
          return (
            <button
              key={v}
              type="button"
              disabled={readonly}
              onClick={() => onChange({ ...score, score: v })}
              className={`flex-1 h-11 rounded-2md border-2 text-15 font-medium transition-colors ${
                selected
                  ? "bg-brand-primary border-brand-primary text-primary-foreground"
                  : "bg-card border-border text-foreground hover:border-brand-primary disabled:opacity-50 disabled:cursor-not-allowed"
              }`}
            >
              {v}
            </button>
          );
        })}
      </div>

      <Textarea
        value={score.comment}
        disabled={readonly}
        onChange={(e) => onChange({ ...score, comment: e.target.value })}
        rows={3}
        placeholder="Комментарий по критерию (необязательно)"
        className="px-3 py-2 rounded-2md text-sm"
      />
    </Card>
  );
}
