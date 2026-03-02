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

const FILTER_OPTIONS: { value: ReviewFilter; label: string; countKey: keyof ReviewCount }[] = [
  { value: "all", label: "Все", countKey: "all" },
  { value: "not_started", label: "Не начато", countKey: "notStarted" },
  { value: "drafts", label: "Черновики", countKey: "drafts" },
  { value: "submitted", label: "Отправлено", countKey: "submitted" },
];

export function ReviewFilters({ filter, counts, onFilterChange }: ReviewFiltersProps) {
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
