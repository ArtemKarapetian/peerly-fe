import { useTranslation } from "react-i18next";

import type { RubricEditorData } from "../model/types";

interface RubricPreviewProps {
  rubric: RubricEditorData;
}

export function RubricPreview({ rubric }: RubricPreviewProps) {
  const { t } = useTranslation();
  const totalPossible = rubric.criteria.reduce((sum, c) => sum + c.maxScore, 0);

  return (
    <div>
      <div className="bg-info-light border-2 border-brand-primary rounded-lg p-4 mb-6">
        <h3 className="text-base font-medium text-foreground mb-2">
          {t("widget.rubricPreview.previewMode")}
        </h3>
        <p className="text-sm text-muted-foreground">{t("widget.rubricPreview.previewDesc")}</p>
      </div>

      <div className="mb-6 flex items-baseline justify-between gap-4">
        <h2 className="text-2xl font-medium text-foreground tracking-[-0.5px]">{rubric.name}</h2>
        <span className="text-sm text-muted-foreground tabular-nums">
          {t("widget.rubricPreview.maxTotal", { count: totalPossible })}
        </span>
      </div>

      <ol className="space-y-3">
        {rubric.criteria.map((criterion, idx) => (
          <li
            key={criterion.id}
            className="border border-border rounded-md p-4 bg-card flex items-start gap-3"
          >
            <span className="shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-full bg-brand-primary-lighter text-13 font-medium text-brand-primary">
              {idx + 1}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between gap-3 mb-1">
                <h4 className="text-base font-medium text-foreground">{criterion.name}</h4>
                <span className="text-13 text-muted-foreground tabular-nums shrink-0">
                  {t("widget.rubricPreview.maxScore", { count: criterion.maxScore })}
                </span>
              </div>
              {criterion.description && (
                <p className="text-13 text-muted-foreground leading-relaxed mb-2">
                  {criterion.description}
                </p>
              )}
              {criterion.commentRequired && (
                <span className="inline-flex items-center text-xs text-warning font-medium">
                  {t("widget.rubricPreview.commentRequired")}
                </span>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
