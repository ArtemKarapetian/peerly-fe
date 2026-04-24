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
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onFilterChange(filter.id)}
          className={`
            inline-flex items-center px-3.5 py-1.5 rounded-full text-[14px] font-medium
            border transition-colors
            ${
              activeFilter === filter.id
                ? "bg-brand-primary text-primary-foreground border-brand-primary"
                : "bg-card text-muted-foreground border-border hover:text-foreground hover:border-brand-primary/50"
            }
          `}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
