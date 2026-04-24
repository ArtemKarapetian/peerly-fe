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
      className="flex flex-wrap gap-2"
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
              inline-flex items-center px-3.5 py-1.5 rounded-full text-[13px] font-medium
              border transition-colors whitespace-nowrap
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40
              ${
                isActive
                  ? "bg-brand-primary text-primary-foreground border-brand-primary"
                  : "bg-card text-muted-foreground border-border hover:text-foreground hover:border-brand-primary/50"
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
