import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import { getCrumbs } from "@/shared/config/breadcrumbs.ts";
import { ROUTES } from "@/shared/config/routes.ts";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs.tsx";

import type { TaskStatus } from "@/entities/assignment";
import { StatusCard } from "@/entities/assignment";

import { AppShell } from "@/widgets/app-shell/AppShell.tsx";
import {
  TaskHeader,
  TaskDescription,
  TaskRequirements,
  TaskMaterials,
  TaskQuestionsComments,
} from "@/widgets/task-detail";

export default function TaskPage() {
  const { taskId: taskIdParam } = useParams();
  const taskId = taskIdParam ?? "1";
  const { t } = useTranslation();
  const CRUMBS = getCrumbs();
  const [taskStatus, setTaskStatus] = useState<TaskStatus>("NOT_STARTED");

  const taskTitle = `${t("widget.gradeTable.assignment")} ${taskId || "1"}`;
  const courseId = "1"; // TODO взять реальный courseId из URL/контекста

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

  return (
    <AppShell title={taskTitle}>
      <Breadcrumbs
        items={[
          CRUMBS.courses,
          { label: t("student.task.mockCourseName"), href: ROUTES.course(courseId) },
          { label: taskTitle },
        ]}
      />

      <TaskHeader
        title={taskTitle}
        courseName={t("student.task.mockCourseName")}
        teacher={t("student.task.mockTeacher")}
        deadline={t("student.task.mockDeadline")}
        points={100}
        type={t("student.task.mockType")}
        status={getStatusLabel()}
        statusColor={getStatusColor()}
      />

      {/* на десктопе StatusCard уйдёт в правый sticky-сайдбар, здесь только мобильная версия */}
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
      </div>

      <div className="task-layout">
        <div className="w-full min-w-0 flex flex-col task-content-spacing">
          <TaskDescription />
          <TaskRequirements />
          <TaskMaterials />
          {/* комментарии в основной колонке только на мобильном — на десктопе они в правом сайдбаре */}
          <div className="hide-on-desktop">
            <TaskQuestionsComments />
          </div>
        </div>

        <div className="w-full min-w-0 flex flex-col task-content-spacing hide-below-desktop">
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
          </div>
          <TaskQuestionsComments />
        </div>
      </div>
    </AppShell>
  );
}
