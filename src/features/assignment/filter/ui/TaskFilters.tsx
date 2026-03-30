import { useTranslation } from "react-i18next";

/**
 * TaskFilters - Filter chips for the assignment list
 */

export type TaskFilter = "all" | "due-soon" | "completed";

interface TaskFiltersProps {
  activeFilter: TaskFilter;
  onFilterChange: (filter: TaskFilter) => void;
}

export function TaskFilters({ activeFilter, onFilterChange }: TaskFiltersProps) {
  const { t } = useTranslation();

  const filters: { id: TaskFilter; label: string }[] = [
    { id: "all", label: t("feature.taskFilters.all") },
    { id: "due-soon", label: t("feature.taskFilters.dueSoon") },
    { id: "completed", label: t("feature.taskFilters.completed") },
  ];

  return (
    <div className="flex flex-wrap gap-3">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onFilterChange(filter.id)}
          className={`
            px-2 py-2 rounded-[8px] text-[16px] leading-[1.1] tracking-[-0.72px]
            transition-colors
            ${
              activeFilter === filter.id
                ? "bg-accent text-foreground"
                : "bg-muted text-muted-foreground hover:bg-surface-hover"
            }
          `}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
