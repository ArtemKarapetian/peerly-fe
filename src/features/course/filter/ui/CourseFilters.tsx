import { useTranslation } from "react-i18next";

/**
 * CourseFilters - Segmented control for filtering courses.
 */

export type CourseFilterType = "all" | "active" | "completed";

interface CourseFiltersProps {
  activeFilter: CourseFilterType;
  onFilterChange: (filter: CourseFilterType) => void;
}

export function CourseFilters({ activeFilter, onFilterChange }: CourseFiltersProps) {
  const { t } = useTranslation();

  const FILTERS: { value: CourseFilterType; label: string }[] = [
    { value: "all", label: t("feature.courseFilters.all") },
    { value: "active", label: t("feature.courseFilters.active") },
    { value: "completed", label: t("feature.courseFilters.completed") },
  ];

  return (
    <div
      role="tablist"
      aria-label={t("feature.courseFilters.ariaLabel")}
      className="flex gap-1 p-1 bg-[#e8eaed] rounded-[var(--radius-md)] w-fit shrink-0"
    >
      {FILTERS.map((filter) => {
        const isActive = activeFilter === filter.value;
        return (
          <button
            key={filter.value}
            role="tab"
            aria-selected={isActive}
            onClick={() => onFilterChange(filter.value)}
            className={`
              px-3.5 py-1.5 rounded-[var(--radius-sm)] text-[13px] font-medium
              transition-all duration-150 whitespace-nowrap
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--brand-primary]/40
              ${
                isActive
                  ? "bg-white text-[--text-primary] shadow-[0_1px_4px_rgba(0,0,0,0.13)]"
                  : "text-[--text-secondary] hover:bg-white/50 hover:text-[--text-primary]"
              }
            `}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}
