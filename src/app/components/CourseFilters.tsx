/**
 * CourseFilters - Фильтры для списка курсов
 */

export type CourseFilterType = 'all' | 'active' | 'completed';

interface CourseFiltersProps {
  activeFilter: CourseFilterType;
  onFilterChange: (filter: CourseFilterType) => void;
}

export function CourseFilters({ activeFilter, onFilterChange }: CourseFiltersProps) {
  const filters: { value: CourseFilterType; label: string }[] = [
    { value: 'all', label: 'Все курсы' },
    { value: 'active', label: 'Активные' },
    { value: 'completed', label: 'Завершенные' },
  ];

  return (
    <div className="flex gap-2">
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onFilterChange(filter.value)}
          className={`
            px-4 py-2 rounded-[12px] text-[14px] font-medium
            transition-all duration-200
            ${
              activeFilter === filter.value
                ? 'bg-[#2563eb] text-white shadow-[0_2px_8px_rgba(37,99,235,0.3)]'
                : 'bg-white text-[#21214f] border border-[#e6e8ee] hover:border-[#2563eb] hover:bg-[#f0f6ff]'
            }
          `}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
