import { useState } from "react";

import { Breadcrumbs } from "@/shared/ui/Breadcrumbs.tsx";

import { useAuth } from "@/entities/user";

import {
  CreateAppealContext,
  CreateAppealForm,
  CreateAppealSuccess,
} from "@/features/appeal/create";

import { AppShell } from "@/widgets/app-shell/AppShell.tsx";

/**
 * CreateAppealPage - Student Appeal (Regrade/Review Request)
 *
 * Allows students to request a regrade or appeal a review decision
 */

interface CreateAppealPageProps {
  courseId?: string;
  taskId?: string;
}

export default function CreateAppealPage({ courseId, taskId }: CreateAppealPageProps = {}) {
  const { user } = useAuth();
  const [showSuccess, setShowSuccess] = useState(false);

  // пока мок — это нормально. позже будет из entities/course/task
  const context: CreateAppealContext = {
    courseName: "Веб-программирование",
    taskName: "Задание 1: Введение в peer review",
    currentScore: 78,
    maxScore: 100,
    reviewCount: 3,
    deadline: "25 января 2026, 23:59",
  };

  const resolvedCourseId = courseId || "course-1";
  const resolvedTaskId = taskId || "task-1";
  const studentId = user?.id || "student-1";

  if (showSuccess) {
    return (
      <AppShell title="Апелляция отправлена">
        <CreateAppealSuccess
          onGoToAppeals={() => (window.location.hash = "/appeals")}
          onGoToCourse={() => (window.location.hash = `/courses/${resolvedCourseId}`)}
        />
      </AppShell>
    );
  }

  return (
    <AppShell title="Запрос на пересмотр">
      <Breadcrumbs
        items={[
          { label: "Курсы", href: "/courses" },
          { label: context.courseName, href: `/courses/${resolvedCourseId}` },
          { label: context.taskName, href: `/courses/${resolvedCourseId}/tasks/${resolvedTaskId}` },
          { label: "Апелляция" },
        ]}
      />

      <CreateAppealForm
        studentId={studentId}
        courseId={resolvedCourseId}
        taskId={resolvedTaskId}
        context={context}
        onCancel={() =>
          (window.location.hash = `/courses/${resolvedCourseId}/tasks/${resolvedTaskId}`)
        }
        onSuccess={() => setShowSuccess(true)}
      />
    </AppShell>
  );
}
