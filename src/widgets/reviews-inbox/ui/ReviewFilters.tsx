import { useTranslation } from "react-i18next";

interface ReviewCount {
  all: number;
  notStarted: number;
  submitted: number;
}

type ReviewFilter = "all" | "not_started" | "submitted";

interface ReviewFiltersProps {
  filter: ReviewFilter;
  counts: ReviewCount;
  onFilterChange: (filter: ReviewFilter) => void;
}

export function ReviewFilters({ filter, counts, onFilterChange }: ReviewFiltersProps) {
  const { t } = useTranslation();

  const FILTER_OPTIONS: { value: ReviewFilter; label: string; countKey: keyof ReviewCount }[] = [
    { value: "all", label: t("widget.reviewFilters.all"), countKey: "all" },
    { value: "not_started", label: t("widget.reviewFilters.notStarted"), countKey: "notStarted" },
    { value: "submitted", label: t("widget.reviewFilters.submitted"), countKey: "submitted" },
  ];

  return (
    <div
      className="flex items-center gap-2 flex-wrap"
      role="group"
      aria-label={t("widget.reviewFilters.groupLabel")}
    >
      {FILTER_OPTIONS.map(({ value, label, countKey }) => {
        const isActive = filter === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => onFilterChange(value)}
            aria-pressed={isActive}
            className={`px-4 py-2 rounded-[8px] text-[14px] font-medium transition-colors ${
              isActive
                ? "bg-brand-primary text-text-inverse"
                : "bg-muted text-muted-foreground hover:bg-surface-hover"
            }`}
          >
            {label} ({counts[countKey]})
          </button>
        );
      })}
    </div>
  );
}

export type { ReviewFilter, ReviewCount };
