import { Clock, BookOpen, FileText } from 'lucide-react';

/**
 * RecentActivity - Недавно открытые курсы и задания
 */

export type RecentItemType = 'course' | 'task';

export interface RecentItem {
  id: string;
  type: RecentItemType;
  title: string;
  subtitle?: string; // Для task - название курса, для course - преподаватель
  timestamp: string; // e.g., "2 часа назад"
  coverColor?: string; // Для курсов
}

interface RecentActivityProps {
  items: RecentItem[];
  onItemClick: (id: string, type: RecentItemType) => void;
}

export function RecentActivity({ items, onItemClick }: RecentActivityProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-12 h-12 bg-[#d2e1f8] rounded-full mx-auto flex items-center justify-center mb-3">
          <Clock className="w-6 h-6 text-[#5b8def]" />
        </div>
        <p className="text-[15px] text-[#767692]">
          Нет недавней активности
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {items.map((item, index) => {
        const Icon = item.type === 'course' ? BookOpen : FileText;
        
        return (
          <button
            key={item.id}
            onClick={() => onItemClick(item.id, item.type)}
            className={`w-full text-left p-4 hover:bg-white hover:shadow-sm hover:rounded-[12px] transition-all group ${
              index !== items.length - 1 ? 'border-b border-[#e6e8ee]' : ''
            }`}
          >
            <div className="flex items-center gap-3">
              {/* Icon or color indicator */}
              {item.type === 'course' && item.coverColor ? (
                <div
                  className="w-10 h-10 rounded-[8px] flex items-center justify-center shrink-0"
                  style={{ backgroundColor: item.coverColor }}
                >
                  <BookOpen className="w-5 h-5 text-[#21214f]" />
                </div>
              ) : (
                <div className="w-10 h-10 bg-[#d2def8] rounded-[8px] flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-[#21214f]" />
                </div>
              )}

              {/* Content */}
              <div className="flex-1 min-w-0">
                {/* Title */}
                <div className="text-[15px] font-medium text-[#21214f] mb-0.5 tracking-[-0.3px] truncate">
                  {item.title}
                </div>
                
                {/* Subtitle + timestamp */}
                <div className="flex items-center gap-2 text-[13px] text-[#767692]">
                  {item.subtitle && (
                    <>
                      <span className="truncate">{item.subtitle}</span>
                      <span>•</span>
                    </>
                  )}
                  <span className="shrink-0">{item.timestamp}</span>
                </div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}