import { Card, Textarea } from "@/shared/ui";

import type { RubricCriterion } from "@/entities/rubric";

import type { UICriterionScore } from "@/features/review/fill-review/model/rubric";

interface CriterionCardProps {
  criterion: RubricCriterion;
  score: UICriterionScore;
  readonly: boolean;
  onChange: (next: UICriterionScore) => void;
}

export function CriterionCard({ criterion, score, readonly, onChange }: CriterionCardProps) {
  const max = Math.max(1, criterion.maxScore);
  const scoreValues = Array.from({ length: max }, (_, i) => i + 1);
  const commentRequired = criterion.commentRequired && score.score !== null;

  return (
    <Card variant="section">
      <div className="flex items-baseline justify-between gap-3 mb-2">
        <h3 className="text-lg desktop:text-xl tracking-[-0.3px] text-foreground font-medium">
          {criterion.name}
        </h3>
        <span className="text-13 text-muted-foreground tabular-nums shrink-0">
          {`/ ${criterion.maxScore}`}
        </span>
      </div>
      {criterion.description && (
        <p className="text-13 text-muted-foreground leading-relaxed mb-4">
          {criterion.description}
        </p>
      )}

      <div className="flex gap-2 mb-4 flex-wrap">
        {scoreValues.map((v) => {
          const selected = score.score === v;
          return (
            <button
              key={v}
              type="button"
              disabled={readonly}
              onClick={() => onChange({ ...score, score: v })}
              className={`min-w-[44px] h-11 px-3 rounded-2md border-2 text-15 font-medium transition-colors ${
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
        placeholder={
          commentRequired ? "Комментарий обязателен" : "Комментарий по критерию (необязательно)"
        }
        className="px-3 py-2 rounded-2md text-sm"
      />
    </Card>
  );
}
