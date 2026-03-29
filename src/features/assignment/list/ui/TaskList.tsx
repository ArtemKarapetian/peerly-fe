import { useTranslation } from "react-i18next";

import { TaskListItem } from "@/entities/assignment";
import type { TaskStatus } from "@/entities/assignment";

/**
 * TaskList - Список заданий с разделителями
 */

export interface Task {
  id: string;
  title: string;
  deadline: string;
  status: TaskStatus;
}

interface TaskListProps {
  tasks: Task[];
  onTaskClick: (taskId: string) => void;
  courseId: string | null;
}

export function TaskList({ tasks, onTaskClick }: TaskListProps) {
  const { t } = useTranslation();

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-[14px] text-[#767692]">{t("feature.taskList.notFound")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {tasks.map((task, index) => (
        <div key={task.id}>
          <TaskListItem
            title={task.title}
            deadline={task.deadline}
            status={task.status}
            onClick={() => onTaskClick?.(task.id)}
          />
          {/* Divider - не показываем после последнего элемента */}
          {index < tasks.length - 1 && <div className="border-b border-[#e6e8ee]" />}
        </div>
      ))}
    </div>
  );
}
