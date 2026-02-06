import { Calendar, CheckSquare, MessageSquare } from 'lucide-react';

/**
 * TodaySummary - Сводка "Сегодня"
 * 
 * Показывает количество:
 * - Заданий сегодня
 * - Рецензий на проверке
 */

export interface TodaySummaryData {
  tasksToday: number;       // Заданий сегодня
  reviewsPending: number; // Рецензий ожидает
}

interface TodaySummaryProps {
  data: TodaySummaryData;
}

export function TodaySummary({ data }: TodaySummaryProps) {
  const items = [
    {
      icon: CheckSquare,
      label: 'Задания сегодня',
      count: data.tasksToday,
      color: '#5b8def',
    },
    {
      icon: MessageSquare,
      label: 'Рецензии на проверке',
      count: data.reviewsPending,
      color: '#10b981',
    },
  ];

  return (
    <div className="space-y-4">
      {items.map((item, index) => {
        const Icon = item.icon;
        
        return (
          <div key={index} className="flex items-center gap-3">
            {/* Icon */}
            <div 
              className="w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${item.color}15` }}
            >
              <Icon className="w-5 h-5" style={{ color: item.color }} />
            </div>

            {/* Label + Count */}
            <div className="flex-1 min-w-0">
              <div className="text-[12px] text-[#767692] mb-0.5">
                {item.label}
              </div>
              <div className="text-[22px] font-semibold text-[#21214f]">
                {item.count}
              </div>
            </div>
          </div>
        );
      })}

      {/* Today's date */}
      <div className="pt-4 border-t border-[#e6e8ee]">
        <div className="flex items-center gap-2 text-[12px] text-[#767692]">
          <Calendar className="w-4 h-4" />
          <span>
            {new Date().toLocaleDateString('ru-RU', { 
              weekday: 'long', 
              day: 'numeric', 
              month: 'long' 
            })}
          </span>
        </div>
      </div>
    </div>
  );
}