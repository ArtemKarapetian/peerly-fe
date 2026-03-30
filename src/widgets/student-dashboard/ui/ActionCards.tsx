import { CheckSquare, MessageSquare, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

export interface ActionCardData {
  reviewsPending: number;
  newFeedback: number;
}

interface ActionCardsProps {
  data: ActionCardData;
  onReviewsClick: () => void;
  onFeedbackClick: () => void;
}

export function ActionCards({ data, onReviewsClick, onFeedbackClick }: ActionCardsProps) {
  const { t } = useTranslation();

  const items = [
    {
      id: "reviews",
      icon: CheckSquare,
      label: t("widget.actionCards.needToReview"),
      count: data.reviewsPending,
      accent: "var(--chart-3)",
      onClick: onReviewsClick,
    },
    {
      id: "feedback",
      icon: MessageSquare,
      label: t("widget.actionCards.newFeedback"),
      count: data.newFeedback,
      accent: "var(--success)",
      onClick: onFeedbackClick,
    },
  ];

  return (
    <div className="divide-y divide-[--surface-border]">
      {items.map((item) => {
        const Icon = item.icon;
        const hasItems = item.count > 0;

        return (
          <button
            key={item.id}
            onClick={hasItems ? item.onClick : undefined}
            disabled={!hasItems}
            className={`w-full text-left px-5 py-3.5 transition-colors duration-150 group ${
              hasItems ? "hover:bg-surface-hover cursor-pointer" : "cursor-default"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-[var(--radius-sm)] flex items-center justify-center shrink-0"
                style={{ backgroundColor: item.accent + "15" }}
              >
                <Icon
                  className="w-4 h-4"
                  style={{ color: hasItems ? item.accent : "var(--text-tertiary)" }}
                />
              </div>

              <p
                className={`flex-1 text-[14px] ${hasItems ? "text-[--text-primary] font-medium" : "text-[--text-tertiary]"}`}
              >
                {item.label}
              </p>

              {hasItems ? (
                <div className="flex items-center gap-1 shrink-0">
                  <span className="text-[16px] font-semibold text-[--text-primary] tabular-nums">
                    {item.count}
                  </span>
                  <ChevronRight className="w-4 h-4 text-[--text-tertiary] opacity-25 group-hover:opacity-60 transition-opacity duration-150" />
                </div>
              ) : (
                <span className="text-[13px] text-[--text-tertiary] shrink-0">—</span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
