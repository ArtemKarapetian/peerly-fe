import { useTranslation } from "react-i18next";

interface ReviewCount {
  all: number;
  notStarted: number;
  drafts: number;
  submitted: number;
}

type ReviewFilter = "all" | "not_started" | "drafts" | "submitted";

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
    { value: "drafts", label: t("widget.reviewFilters.drafts"), countKey: "drafts" },
    { value: "submitted", label: t("widget.reviewFilters.submitted"), countKey: "submitted" },
  ];

  return (
    <div className="mb-6 flex items-center gap-2 flex-wrap">
      {FILTER_OPTIONS.map(({ value, label, countKey }) => (
        <button
          key={value}
          onClick={() => onFilterChange(value)}
          className={`px-4 py-2 rounded-[8px] text-[14px] font-medium transition-colors ${
            filter === value
              ? "bg-[#5b8def] text-white"
              : "bg-[#f9f9f9] text-[#4b4963] hover:bg-[#e6e8ee]"
          }`}
        >
          {label} ({counts[countKey]})
        </button>
      ))}
    </div>
  );
}

export type { ReviewFilter, ReviewCount };
