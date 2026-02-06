/**
 * TaskFilters - Чипы фильтров для списка заданий
 */

export type TaskFilter = 'all' | 'due-soon' | 'completed';

interface TaskFiltersProps {
  activeFilter: TaskFilter;
  onFilterChange: (filter: TaskFilter) => void;
}

export function TaskFilters({ activeFilter, onFilterChange }: TaskFiltersProps) {
  const filters: { id: TaskFilter; label: string }[] = [
    { id: 'all', label: 'Все' },
    { id: 'due-soon', label: 'Истекает срок сдачи' },
    { id: 'completed', label: 'Завершенные' },
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
                ? 'bg-[#d2def8] text-[#21214f]'
                : 'bg-[#e4e4e4] text-[#4b4963] hover:bg-[#d7d7d7]'
            }
          `}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
