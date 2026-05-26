import { ArrowDown, ArrowUp } from "lucide-react";
import { useTranslation } from "react-i18next";

type ReviewSortDirection = "asc" | "desc";

interface ReviewSortProps {
  direction: ReviewSortDirection;
  onToggle: () => void;
}

export function ReviewSort({ direction, onToggle }: ReviewSortProps) {
  const { t } = useTranslation();
  const Icon = direction === "asc" ? ArrowUp : ArrowDown;

  return (
    <button
      onClick={onToggle}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-sm text-sm font-medium bg-muted text-muted-foreground hover:bg-surface-hover transition-colors"
      aria-label={t("widget.reviewSort.aria")}
    >
      <span>{t("widget.reviewSort.byDeadline")}</span>
      <Icon className="w-4 h-4" />
    </button>
  );
}

export type { ReviewSortDirection };
