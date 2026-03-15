import { Clock, ChevronRight } from "lucide-react";

export type DeadlineStatus =
  | "NOT_STARTED"
  | "DRAFT"
  | "SUBMITTED"
  | "IN_REVIEW"
  | "NEED_YOUR_REVIEW";

export interface DeadlineItem {
  id: string;
  courseId: string;
  courseName: string;
  taskId: string;
  taskTitle: string;
  dueDate: string;
  status: DeadlineStatus;
  isUrgent?: boolean;
}

interface DeadlinesListProps {
  items: DeadlineItem[];
  onTaskClick: (taskId: string) => void;
}

function getStatusBadge(status: DeadlineStatus): string {
  switch (status) {
    case "NOT_STARTED":
      return "badge badge-neutral";
    case "DRAFT":
      return "badge badge-warning";
    case "SUBMITTED":
      // Already done — calm, no action needed
      return "badge badge-neutral";
    case "IN_REVIEW":
      // Someone else reviews it — calm, no action needed
      return "badge badge-neutral";
    case "NEED_YOUR_REVIEW":
      // Requires student's action — loud
      return "badge badge-error";
  }
}

function getStatusLabel(status: DeadlineStatus): string {
  switch (status) {
    case "NOT_STARTED":
      return "Не начато";
    case "DRAFT":
      return "Черновик";
    case "SUBMITTED":
      return "Сдано";
    case "IN_REVIEW":
      return "На проверке";
    case "NEED_YOUR_REVIEW":
      return "Нужна рецензия";
  }
}

export function DeadlinesList({ items, onTaskClick }: DeadlinesListProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center px-5">
        <div className="w-10 h-10 bg-[--surface-hover] rounded-[var(--radius-lg)] flex items-center justify-center mb-3">
          <Clock className="w-5 h-5 text-[--text-tertiary]" />
        </div>
        <p className="text-[14px] font-medium text-[--text-primary] mb-0.5">Нет дедлайнов</p>
        <p className="text-[13px] text-[--text-secondary]">Все задания выполнены</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-[--surface-border]">
      {items.map((item, index) => {
        // First urgent item gets a left-border "next up" treatment
        const isPrimary = index === 0 && item.isUrgent;

        return (
          <button
            key={item.id}
            onClick={() => onTaskClick(item.taskId)}
            className={`w-full text-left py-3.5 pr-5 hover:bg-[#f7f9ff] transition-colors duration-150 group ${
              isPrimary ? "pl-[17px] border-l-[3px] border-[--warning]" : "pl-5"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-[--text-tertiary] mb-0.5">{item.courseName}</p>
                <p
                  className={`tracking-[-0.2px] truncate leading-snug mb-2 ${isPrimary ? "text-[14px] font-bold text-[--text-primary]" : "text-[14px] font-semibold text-[--text-primary]"}`}
                >
                  {item.taskTitle}
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <div
                    className={`flex items-center gap-1 text-[12px] font-medium ${
                      item.isUrgent ? "text-[--error]" : "text-[--text-tertiary]"
                    }`}
                  >
                    <Clock className="w-3 h-3 shrink-0" />
                    <span>{item.dueDate}</span>
                  </div>
                  <span className={getStatusBadge(item.status)}>{getStatusLabel(item.status)}</span>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-[--text-tertiary] opacity-25 group-hover:opacity-60 transition-opacity duration-150 shrink-0" />
            </div>
          </button>
        );
      })}
    </div>
  );
}
