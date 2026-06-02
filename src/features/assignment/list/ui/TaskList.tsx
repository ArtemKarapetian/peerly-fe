import { useTranslation } from "react-i18next";

import { EmptyState } from "@/shared/ui";

import { TaskListItem } from "@/entities/assignment";
import type { TaskStatus } from "@/entities/assignment";

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
    return <EmptyState message={t("feature.taskList.notFound")} />;
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
          {index < tasks.length - 1 && <div className="border-b border-border" />}
        </div>
      ))}
    </div>
  );
}
