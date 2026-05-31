import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import { getCrumbs } from "@/shared/config/breadcrumbs.ts";
import { ROUTES } from "@/shared/config/routes.ts";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs.tsx";

import { useAssignment } from "@/entities/assignment";
import { useCourse } from "@/entities/course";
import { useMySubmission } from "@/entities/work";

import { AppShell } from "@/widgets/app-shell/AppShell.tsx";
import { TaskDescription, TaskHeader, TaskRubric, TaskSidebar } from "@/widgets/task-detail";

export default function TaskPage() {
  const { courseId = "", taskId = "" } = useParams();
  const { t } = useTranslation();
  const CRUMBS = getCrumbs();

  const { data: hw, isLoading: hwLoading } = useAssignment(taskId);
  const { data: course } = useCourse(courseId);
  const { data: submission } = useMySubmission(taskId);
  const [now] = useState(() => Date.now());

  const courseName = course?.title ?? "";
  const title = hw?.title ?? "";
  const description = hw?.description ?? "";
  const rubricId = hw?.rubricId ?? null;

  if (!hwLoading && !hw) {
    return (
      <AppShell title={t("student.task.notFound")}>
        <Breadcrumbs items={[CRUMBS.courses, { label: t("student.task.notFound") }]} />
        <p className="mt-6 text-sm text-text-tertiary">{t("student.task.notFound")}</p>
      </AppShell>
    );
  }

  const hasSubmission = !!submission;
  const isOverdue = hw?.dueDate ? hw.dueDate.getTime() < now : false;
  const { statusLabel, statusColor } = pickStatus({
    hasSubmission,
    isOverdue,
    t,
  });

  return (
    <AppShell title={title || t("common.loading")}>
      <Breadcrumbs
        items={[
          CRUMBS.courses,
          { label: courseName, href: ROUTES.course(courseId) },
          { label: title || t("common.loading") },
        ]}
      />

      <div className="mt-6">
        <TaskHeader
          title={title || t("common.loading")}
          courseName={courseName}
          deadline={hw?.dueDate}
          reviewDeadline={hw?.reviewDeadline}
          reviewCount={hw?.reviewCount}
          statusLabel={statusLabel}
          statusColor={statusColor}
        />

        <div className="task-layout">
          <div className="w-full min-w-0 flex flex-col gap-4 desktop:gap-6">
            <TaskDescription description={description} />
            <TaskRubric rubricId={rubricId} />
          </div>

          <div className="w-full min-w-0 hide-below-desktop">
            <div className="task-sidebar-sticky">
              <TaskSidebar
                courseId={courseId}
                taskId={taskId}
                hasSubmission={hasSubmission}
                isDeadlinePassed={isOverdue}
              />
            </div>
          </div>
        </div>

        <div className="hide-on-desktop mt-4">
          <TaskSidebar
            courseId={courseId}
            taskId={taskId}
            hasSubmission={hasSubmission}
            isDeadlinePassed={isOverdue}
          />
        </div>
      </div>
    </AppShell>
  );
}

function pickStatus({
  hasSubmission,
  isOverdue,
  t,
}: {
  hasSubmission: boolean;
  isOverdue: boolean;
  t: (key: string) => string;
}): { statusLabel: string; statusColor: string } {
  if (hasSubmission) {
    return {
      statusLabel: t("student.task.workSubmitted"),
      statusColor: "bg-brand-primary-lighter",
    };
  }
  if (isOverdue) {
    return { statusLabel: t("student.task.overdue"), statusColor: "bg-error-light" };
  }
  return { statusLabel: t("student.task.notStarted"), statusColor: "bg-muted" };
}
