import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Card } from "@/shared/ui";

import { useRubric } from "@/entities/rubric";

interface TaskRubricProps {
  rubricId: string | null;
}

export function TaskRubric({ rubricId }: TaskRubricProps) {
  const { t } = useTranslation();
  const { data: detail } = useRubric(rubricId ?? undefined);

  if (!detail || detail.criteria.length === 0) return null;

  return (
    <Card variant="section">
      <h2 className="text-xl desktop:text-2xl tracking-[-0.5px] text-foreground mb-4">
        {detail.rubric.name}
      </h2>
      <div className="space-y-3">
        {detail.criteria.map((c) => (
          <div key={c.id} className="flex items-start gap-3">
            <div className="shrink-0 mt-0.5">
              <div className="size-5 rounded-full bg-brand-primary-light flex items-center justify-center">
                <Check className="size-3.5 text-foreground" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-sm desktop:text-base tracking-[-0.3px] text-foreground leading-[1.5]">
                  {c.name}
                </p>
                <span className="text-13 text-muted-foreground tabular-nums shrink-0">
                  {t("student.task.maxScore", { count: c.maxScore })}
                </span>
              </div>
              {c.description && (
                <p className="text-13 text-muted-foreground leading-relaxed mt-1">
                  {c.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
