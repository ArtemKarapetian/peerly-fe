import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { useAssignmentsByCourse } from "@/entities/assignment";

import { TaskList } from "@/features/assignment/list";
import type { Task } from "@/features/assignment/list";

import { TaskFilterBar } from "@/widgets/task-filter-bar";

interface CourseAssignmentsTabProps {
  courseId: string;
}

export function CourseAssignmentsTab({ courseId }: CourseAssignmentsTabProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data, isLoading } = useAssignmentsByCourse(courseId);

  const tasks: Task[] = useMemo(
    () =>
      (data ?? [])
        .filter((a) => a.backendStatus !== "draft" && a.backendStatus !== "deleted")
        .map((a) => ({
          id: a.id,
          title: a.title,
          deadline: a.dueDate.toISOString(),
          status: "NOT_STARTED",
        })),
    [data],
  );

  const handleTaskClick = (taskId: string) => {
    void navigate(`/student/courses/${courseId}/tasks/${taskId}`);
  };

  if (isLoading) {
    return <p className="text-[14px] text-text-tertiary px-1">{t("common.loading")}</p>;
  }

  return (
    <div className="space-y-3">
      <TaskFilterBar tasks={tasks}>
        {(filteredTasks) => (
          <TaskList tasks={filteredTasks} onTaskClick={handleTaskClick} courseId={courseId} />
        )}
      </TaskFilterBar>
    </div>
  );
}
