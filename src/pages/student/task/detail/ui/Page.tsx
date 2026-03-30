import { Clock, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { getCrumbs } from "@/shared/config/breadcrumbs.ts";
import { ROUTES } from "@/shared/config/routes.ts";
import { useAsync } from "@/shared/lib/useAsync";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs.tsx";

import type { TaskStatus } from "@/entities/assignment";
import { StatusCard } from "@/entities/assignment";
import { extensionRepo } from "@/entities/extension";
import { useAuth } from "@/entities/user";

import { AppShell } from "@/widgets/app-shell/AppShell.tsx";
import {
  TaskHeader,
  TaskDescription,
  TaskRequirements,
  TaskMaterials,
  TaskQuestionsComments,
} from "@/widgets/task-detail";

interface TaskPageProps {
  taskId?: string | null;
}

export default function TaskPage({ taskId = "1" }: TaskPageProps) {
  const { t } = useTranslation();
  const CRUMBS = getCrumbs();
  const { user } = useAuth();
  const [taskStatus, setTaskStatus] = useState<TaskStatus>("NOT_STARTED");

  // Load extension data asynchronously
  const { data: extension } = useAsync(
    () => extensionRepo.getForStudent(taskId || "1", user?.id || "1"),
    [taskId, user?.id],
  );

  const taskTitle = `${t("widget.gradeTable.assignment")} ${taskId || "1"}`;
  const courseId = "1"; // Mock course ID

  const getStatusColor = () => {
    switch (taskStatus) {
      case "NOT_STARTED":
        return "bg-muted";
      case "SUBMITTED":
        return "bg-brand-primary-lighter";
      case "PEER_REVIEW":
        return "bg-info-light";
      case "TEACHER_REVIEW":
        return "bg-brand-primary-lighter";
      case "GRADING":
        return "bg-brand-primary-lighter";
      case "GRADED":
        return "bg-success-light";
      case "OVERDUE":
        return "bg-error-light";
    }
  };

  const getStatusLabel = () => {
    switch (taskStatus) {
      case "NOT_STARTED":
        return t("student.task.notStarted");
      case "SUBMITTED":
        return t("student.task.workSubmitted");
      case "PEER_REVIEW":
        return t("student.task.peerReview");
      case "TEACHER_REVIEW":
        return t("student.task.teacherReview");
      case "GRADING":
        return t("student.task.grading");
      case "GRADED":
        return t("student.task.graded");
      case "OVERDUE":
        return t("student.task.overdue");
    }
  };

  const formatExtensionDeadline = (deadline?: string) => {
    if (!deadline) return "";
    const date = new Date(deadline);
    return date.toLocaleString(undefined, {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const showExtensionBanner =
    extension && (extension.status === "approved" || extension.status === "manual");
  const showRequestedBanner = extension && extension.status === "requested";
  const canRequestExtension = !extension || extension.status === "denied";

  return (
    <AppShell title={taskTitle}>
      {/* Breadcrumbs - стандартизированная навигация: Курсы → Название курса → Задание */}
      <Breadcrumbs
        items={[
          CRUMBS.courses,
          { label: t("student.task.mockCourseName"), href: ROUTES.course(courseId) },
          { label: taskTitle },
        ]}
      />

      {/* Extension Banner - Approved/Manual */}
      {showExtensionBanner && (
        <div className="bg-success-light border border-success rounded-[12px] p-4 mb-6">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-medium text-foreground mb-1">
                {t("student.task.deadlineExtended")}
              </h3>
              <p className="text-sm text-success">
                {extension.submissionDeadlineOverride && (
                  <>
                    {t("student.task.newSubmissionDeadline")}{" "}
                    <strong>{formatExtensionDeadline(extension.submissionDeadlineOverride)}</strong>
                  </>
                )}
                {extension.type === "both" && extension.reviewDeadlineOverride && <br />}
                {extension.reviewDeadlineOverride && (
                  <>
                    {t("student.task.newReviewDeadline")}{" "}
                    <strong>{formatExtensionDeadline(extension.reviewDeadlineOverride)}</strong>
                  </>
                )}
              </p>
              {extension.reason && (
                <p className="text-xs text-success mt-1">
                  {t("student.task.reason")} {extension.reason}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Extension Banner - Requested */}
      {showRequestedBanner && (
        <div className="bg-warning-light border border-warning rounded-[12px] p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-medium text-foreground mb-1">
                {t("student.task.extensionPending")}
              </h3>
              <p className="text-sm text-warning">{t("student.task.extensionPendingDesc")}</p>
            </div>
          </div>
        </div>
      )}

      {/* Page Header - H1 после breadcrumbs */}
      <TaskHeader
        title={taskTitle}
        courseName={t("student.task.mockCourseName")}
        teacher={t("student.task.mockTeacher")}
        deadline={t("student.task.mockDeadline")}
        points={100}
        type={t("student.task.mockType")}
        status={getStatusLabel()}
        statusColor={getStatusColor()}
        extensionInfo={
          showExtensionBanner
            ? {
                isExtended: true,
                newDeadline: formatExtensionDeadline(
                  extension.submissionDeadlineOverride || extension.reviewDeadlineOverride,
                ),
              }
            : undefined
        }
      />

      {/* Двухколоночный layout для Desktop с фиксированным right rail */}
      {/* 
        RESPONSIVE GRID LAYOUT:
        
        Desktop (≥1200px):
        ┌────────────────────────────────────┬──────────────────┐
        │ Main Content (1fr)                 │ Right Rail       │
        │                                    │ 360-420px fixed  │
        │ • Описание                         │ • Статус (sticky)│
        │ • Требования                       │ • Комментарии    │
        │ • Материалы                        │                  │
        └────────────────────────────────────┴──────────────────┘
        Gap: 32px between columns
        
        Tablet (800-1199px) & Mobile (<800px):
        ┌──────────────────────────────────────────┐
        │ Single Column (1fr)                      │
        │ • Статус                                 │
        │ • Описание                               │
        │ • Требования                             │
        │ • Материалы                              │
        │ • Комментарии                            │
        └──────────────────────────────────────────┘
        Gap: 16px between items
      */}

      {/* StatusCard на Tablet/Mobile - показываем вверху */}
      <div className="hide-on-desktop mb-4">
        <StatusCard
          status={taskStatus}
          deadline={t("student.task.mockDeadlineFull")}
          courseId={courseId}
          taskId={taskId || "1"}
          hasSubmission={false}
          isDraft={false}
          allowResubmissions={true}
          onStatusChange={setTaskStatus}
        />
        {canRequestExtension && (
          <a
            href={`#/courses/${courseId}/tasks/${taskId}/extension-request`}
            className="mt-3 flex items-center justify-center gap-2 px-4 py-2.5 border border-border rounded-lg hover:bg-accent transition-colors font-medium"
          >
            <Clock className="w-4 h-4" />
            {t("student.task.requestExtension")}
          </a>
        )}
      </div>

      <div className="task-layout">
        {/* Левая колонка: основной контент задания */}
        <div className="w-full min-w-0 flex flex-col task-content-spacing">
          <TaskDescription />
          <TaskRequirements />
          <TaskMaterials />
          {/* На Tablet/Mobile (<1200px): Комментарии внизу основного контента */}
          <div className="hide-on-desktop">
            <TaskQuestionsComments />
          </div>
        </div>

        {/* Правая колонка: sidebar со статусом и комментариями (только Desktop) */}
        <div className="w-full min-w-0 flex flex-col task-content-spacing hide-below-desktop">
          {/* Статус и действия - STICKY на Desktop (≥1200px) */}
          <div className="task-sidebar-sticky">
            <StatusCard
              status={taskStatus}
              deadline={t("student.task.mockDeadlineFull")}
              courseId={courseId}
              taskId={taskId || "1"}
              hasSubmission={false}
              isDraft={false}
              allowResubmissions={true}
              onStatusChange={setTaskStatus}
            />
            {canRequestExtension && (
              <a
                href={`#/courses/${courseId}/tasks/${taskId}/extension-request`}
                className="mt-3 flex items-center justify-center gap-2 px-4 py-2.5 border border-border rounded-lg hover:bg-accent transition-colors font-medium"
              >
                <Clock className="w-4 h-4" />
                {t("student.task.requestExtensionShort")}
              </a>
            )}
          </div>
          {/* Комментарии и вопросы - на Desktop (≥1200px) в sidebar */}
          <TaskQuestionsComments />
        </div>
      </div>
    </AppShell>
  );
}
