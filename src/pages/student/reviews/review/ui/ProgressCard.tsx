import { useTranslation } from "react-i18next";

import { Card } from "@/shared/ui";

interface ProgressCardProps {
  filled: number;
  total: number;
  commentLength: number;
  commentMin: number;
}

export function ProgressCard({ filled, total, commentLength, commentMin }: ProgressCardProps) {
  const { t } = useTranslation();
  const allCriteriaDone = filled === total;
  const commentDone = commentLength >= commentMin;
  return (
    <Card variant="section">
      <h3 className="text-base font-medium text-foreground mb-3">
        {t("page.reviewFill.progressTitle")}
      </h3>
      <div className="space-y-2 text-sm">
        <ProgressLine
          done={allCriteriaDone}
          label={`${t("page.reviewFill.progressCriteria")}: ${filled} / ${total}`}
        />
        <ProgressLine
          done={commentDone}
          label={`${t("page.reviewFill.progressComment")}: ${commentLength} / ${commentMin}`}
        />
      </div>
    </Card>
  );
}

function ProgressLine({ done, label }: { done: boolean; label: string }) {
  return (
    <div className={done ? "text-success" : "text-muted-foreground"}>
      {done ? "✓" : "○"} {label}
    </div>
  );
}
