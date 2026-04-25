import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";

import { Breadcrumbs } from "@/shared/ui/Breadcrumbs.tsx";

import { useAuth } from "@/entities/user";

import {
  CreateAppealContext,
  CreateAppealForm,
  CreateAppealSuccess,
} from "@/features/appeal/create";

import { AppShell } from "@/widgets/app-shell/AppShell.tsx";

export default function CreateAppealPage() {
  const { courseId, taskId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();
  const [showSuccess, setShowSuccess] = useState(false);

  // пока мок — это нормально. позже будет из entities/course/task
  const context: CreateAppealContext = {
    courseName: t("student.task.mockCourseName"),
    taskName: t("student.appeals.mockTaskName"),
    currentScore: 78,
    maxScore: 100,
    reviewCount: 3,
    deadline: t("student.appeals.mockDeadline"),
  };

  const resolvedCourseId = courseId || "course-1";
  const resolvedTaskId = taskId || "task-1";
  const studentId = user?.id || "student-1";

  if (showSuccess) {
    return (
      <AppShell title={t("feature.appeal.success.title")}>
        <CreateAppealSuccess
          onGoToAppeals={() => void navigate("/student/appeals")}
          onGoToCourse={() => void navigate(`/student/courses/${resolvedCourseId}`)}
        />
      </AppShell>
    );
  }

  return (
    <AppShell title={t("feature.appeal.create.title")}>
      <Breadcrumbs
        items={[
          { label: t("nav.courses"), href: "/student/courses" },
          { label: context.courseName, href: `/student/courses/${resolvedCourseId}` },
          {
            label: context.taskName,
            href: `/student/courses/${resolvedCourseId}/tasks/${resolvedTaskId}`,
          },
          { label: t("nav.appeals") },
        ]}
      />

      <CreateAppealForm
        studentId={studentId}
        courseId={resolvedCourseId}
        taskId={resolvedTaskId}
        context={context}
        onCancel={() =>
          void navigate(`/student/courses/${resolvedCourseId}/tasks/${resolvedTaskId}`)
        }
        onSuccess={() => setShowSuccess(true)}
      />
    </AppShell>
  );
}
