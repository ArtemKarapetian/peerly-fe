import { useState } from "react";

import { Breadcrumbs } from "@/shared/ui/Breadcrumbs";

import { useAuth } from "@/entities/user";

import { ExtensionRequestForm, ExtensionRequestSuccess } from "@/features/extension/request";

import { AppShell } from "@/widgets/app-shell/AppShell";

type Props = {
  courseId?: string;
  taskId?: string;
};

export function ExtensionRequestPage({ courseId, taskId }: Props) {
  const { user } = useAuth();
  const [submitted, setSubmitted] = useState(false);

  // Если открыли /extensions без контекста
  if (!taskId) {
    return (
      <AppShell title="Запрос продления">
        <div className="max-w-[700px]">
          <Breadcrumbs items={[{ label: "Продления" }]} />
          <div className="mt-6">
            <h1 className="text-[28px] font-medium text-foreground">Запрос продления</h1>
            <p className="text-muted-foreground mt-2">
              Откройте запрос из конкретного задания (кнопка “Request extension”), либо добавьте
              сюда список заданий для выбора.
            </p>
            <div className="mt-6">
              <a
                href="#/courses"
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg inline-block"
              >
                Перейти к курсам
              </a>
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  const resolvedCourseId = courseId ?? "1";
  const assignmentId = taskId; // по факту это assignmentId в entities/extension

  const backToTaskHref = `#/task/${taskId}`; // у тебя пока legacy task route
  const backToCoursesHref = "#/courses";

  if (submitted) {
    return (
      <AppShell title="Запрос продления">
        <ExtensionRequestSuccess
          backToTaskHref={backToTaskHref}
          backToCoursesHref={backToCoursesHref}
        />
      </AppShell>
    );
  }

  return (
    <AppShell title="Запрос продления">
      <div className="max-w-[700px]">
        <Breadcrumbs
          items={[
            { label: "Курсы", href: "#/courses" },
            { label: `Course ${resolvedCourseId}`, href: `#/course/${resolvedCourseId}` },
            { label: `Task ${taskId}`, href: backToTaskHref },
            { label: "Запрос продления" },
          ]}
        />

        <ExtensionRequestForm
          assignmentId={assignmentId}
          studentId={user?.id || "1"}
          studentName={user?.name || "Текущий студент"}
          backHref={backToTaskHref}
          onSuccess={() => setSubmitted(true)}
        />
      </div>
    </AppShell>
  );
}
