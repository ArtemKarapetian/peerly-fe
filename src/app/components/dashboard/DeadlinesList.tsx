import { Clock, ChevronRight } from 'lucide-react';

/**
 * DeadlinesList - Список ближайших дедлайнов
 * 
 * Каждая строка содержит:
 * - Название курса
 * - Название задания
 * - Дата/время дедлайна
 * - Статус чип
 * - Кнопка быстрого действия (зависит от статуса)
 */

export type DeadlineStatus = 
  | 'NOT_STARTED'      // Не начато
  | 'DRAFT'            // Черновик
  | 'SUBMITTED'        // Сдано
  | 'IN_REVIEW'        // На проверке
  | 'NEED_YOUR_REVIEW'; // Нужна ваша рецензия

export interface DeadlineItem {
  id: string;
  courseId: string;
  courseName: string;
  taskId: string;
  taskTitle: string;
  dueDate: string; // e.g., "31 января, 23:59"
  status: DeadlineStatus;
  isUrgent?: boolean; // < 24 hours
}

interface DeadlinesListProps {
  items: DeadlineItem[];
  onTaskClick: (taskId: string) => void;
}

export function DeadlinesList({ items, onTaskClick }: DeadlinesListProps) {
  const getStatusLabel = (status: DeadlineStatus): string => {
    switch (status) {
      case 'NOT_STARTED': return 'Не начато';
      case 'DRAFT': return 'Черновик';
      case 'SUBMITTED': return 'Сдано';
      case 'IN_REVIEW': return 'На проверке';
      case 'NEED_YOUR_REVIEW': return 'Нужна рецензия';
    }
  };

  const getStatusColor = (status: DeadlineStatus): string => {
    switch (status) {
      case 'NOT_STARTED': return 'bg-[#e4e4e4] text-[#767692]';
      case 'DRAFT': return 'bg-[#ffd4a3] text-[#21214f]';
      case 'SUBMITTED': return 'bg-[#b7bdff] text-[#21214f]';
      case 'IN_REVIEW': return 'bg-[#b0e9fb] text-[#21214f]';
      case 'NEED_YOUR_REVIEW': return 'bg-[#ffb8b8] text-[#21214f]';
    }
  };

  const getActionButton = (status: DeadlineStatus) => {
    switch (status) {
      case 'NOT_STARTED':
        return { label: 'Открыть задание', color: 'bg-[#d2def8] hover:bg-[#c5d5f5] text-[#21214f]' };
      case 'DRAFT':
        return { label: 'Продолжить', color: 'bg-[#ffd4a3] hover:bg-[#ffc98a] text-[#21214f]' };
      case 'SUBMITTED':
        return { label: 'Просмотреть', color: 'bg-[#b7bdff] hover:bg-[#a5acf5] text-[#21214f]' };
      case 'IN_REVIEW':
        return { label: 'Отслеживать', color: 'bg-[#b0e9fb] hover:bg-[#9de0f7] text-[#21214f]' };
      case 'NEED_YOUR_REVIEW':
        return { label: 'Начать рецензию', color: 'bg-[#ffb8b8] hover:bg-[#ffa5a5] text-[#21214f]' };
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12 bg-[--surface] rounded-[var(--radius-lg)] border border-[--surface-border]">
        <div className="w-12 h-12 bg-[--brand-primary-lighter] rounded-full mx-auto flex items-center justify-center mb-3">
          <Clock className="w-6 h-6 text-[--brand-primary]" />
        </div>
        <p className="text-sm text-[--text-secondary]">
          Нет ближайших дедлайнов
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const action = getActionButton(item.status);
        
        return (
          <button
            key={item.id}
            onClick={() => onTaskClick(item.taskId)}
            className="w-full text-left p-4 border-b border-[#e6e8ee] last:border-b-0 hover:bg-white hover:shadow-sm hover:rounded-[12px] transition-all cursor-pointer group"
          >
            <div className="flex items-start gap-3">
              {/* Left: Course + Task info */}
              <div className="flex-1 min-w-0">
                {/* Course name */}
                <div className="text-[13px] text-[#767692] mb-1">
                  {item.courseName}
                </div>
                
                {/* Task title */}
                <div className="text-[15px] font-medium text-[#21214f] mb-2 truncate">
                  {item.taskTitle}
                </div>
                
                {/* Due date + Status */}
                <div className="flex items-center gap-2 flex-wrap">
                  <div className={`flex items-center gap-1.5 text-[13px] ${item.isUrgent ? 'text-[#d4183d] font-medium' : 'text-[#767692]'}`}>
                    <Clock className="w-3.5 h-3.5" />
                    <span>{item.dueDate}</span>
                  </div>
                  
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-[6px] text-[12px] font-medium ${getStatusColor(item.status)}`}
                  >
                    {getStatusLabel(item.status)}
                  </span>
                </div>
              </div>
              
              {/* Right: Arrow icon */}
              <div className="shrink-0 flex items-center">
                <ChevronRight className="w-5 h-5 text-[#d7d7d7] group-hover:text-[#2563eb] transition-colors" />
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}