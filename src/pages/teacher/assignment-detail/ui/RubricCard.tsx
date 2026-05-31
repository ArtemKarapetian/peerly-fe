import { ClipboardList } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useRubric } from "@/entities/rubric";

interface RubricCardProps {
  rubricId: string | null;
}

export function RubricCard({ rubricId }: RubricCardProps) {
  const { t } = useTranslation();
  const { data: detail } = useRubric(rubricId ?? undefined);

  if (!detail) return null;

  return (
    <div className="mt-6 bg-card border border-border shadow-sm rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <ClipboardList className="w-5 h-5 text-brand-primary" />
        <h2 className="text-xl font-medium text-foreground tracking-[-0.5px]">
          {detail.rubric.name}
        </h2>
      </div>
      <ol className="space-y-3">
        {detail.criteria.map((c, idx) => (
          <li key={c.id} className="flex items-start gap-3">
            <span className="shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full bg-brand-primary-lighter text-13 font-medium text-brand-primary">
              {idx + 1}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-sm font-medium text-foreground">{c.name}</p>
                <span className="text-13 text-muted-foreground tabular-nums shrink-0">
                  {t("teacher.assignmentDetail.maxScore", { count: c.maxScore })}
                </span>
              </div>
              {c.description && (
                <p className="text-13 text-muted-foreground leading-relaxed mt-1">
                  {c.description}
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
