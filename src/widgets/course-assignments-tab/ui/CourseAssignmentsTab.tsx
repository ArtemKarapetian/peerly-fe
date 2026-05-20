import { useQueries } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { useAssignmentsByCourse } from "@/entities/assignment";
import { workRepo } from "@/entities/work";

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
  const [now] = useState(() => Date.now());

  const visibleAssignments = useMemo(
    () => (data ?? []).filter((a) => a.backendStatus !== "draft" && a.backendStatus !== "deleted"),
    [data],
  );

  const submissionQueries = useQueries({
    queries: visibleAssignments.map((a) => ({
      queryKey: ["submissions", "mine-id", a.id] as const,
      queryFn: () => workRepo.getMineSubmissionId(a.id),
    })),
  });

  const tasks: Task[] = useMemo(
    () =>
      visibleAssignments.map((a, idx) => {
        const hasSubmission = !!submissionQueries[idx]?.data;
        const isOverdue = a.dueDate.getTime() < now;
        return {
          id: a.id,
          title: a.title,
          deadline: a.dueDate.toISOString(),
          status: hasSubmission ? "SUBMITTED" : isOverdue ? "OVERDUE" : "NOT_STARTED",
        };
      }),
    [visibleAssignments, submissionQueries, now],
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
