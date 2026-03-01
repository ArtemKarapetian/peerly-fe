import { Edit, Trash2, Calendar, BarChart3, Settings, FileText } from "lucide-react";
import React from "react";

import { ROUTES } from "@/shared/config/routes.ts";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs.tsx";

import { AppShell } from "@/widgets/app-shell/AppShell.tsx";

/**
 * TeacherAssignmentDetailsPage - Детальная страница задания (преподаватель)
 *
 * Отображает созданное задание с его статусом и управляющими кнопками
 */

interface TeacherAssignmentDetailsPageProps {
  assignmentId: string;
}

export default function TeacherAssignmentDetailsPage({
  assignmentId,
}: TeacherAssignmentDetailsPageProps) {
  // In a real app, we'd load assignment data from storage/API
  // For now, using mock data with fixed dates

  const assignment = {
    id: assignmentId,
    title: "Новое задание",
    description: "Описание задания будет здесь",
    status: "published" as "draft" | "published",
    courseName: "Веб-разработка",
    courseCode: "CS301",
    taskType: "project",
    submissionDeadline: new Date("2024-02-21"),
    reviewDeadline: new Date("2024-02-28"),
    studentsCount: 45,
    submissionsCount: 0,
    reviewsCount: 0,
    rubricName: "Оценка веб-проекта",
    reviewsPerSubmission: 3,
  };

  const getStatusBadge = (status: "draft" | "published") => {
    if (status === "published") {
      return (
        <span className="inline-flex items-center gap-2 px-3 py-2 bg-[#e8f5e9] text-[#4caf50] rounded-[8px] text-[14px] font-medium">
          <div className="w-2 h-2 bg-[#4caf50] rounded-full"></div>
          Опубликовано
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-2 px-3 py-2 bg-[#f5f5f5] text-[#767692] rounded-[8px] text-[14px] font-medium">
        <div className="w-2 h-2 bg-[#767692] rounded-full"></div>
        Черновик
      </span>
    );
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <AppShell title={assignment.title}>
      <Breadcrumbs
        items={[
          { label: "Дашборд преподавателя", href: ROUTES.teacherDashboard },
          { label: "Конструктор заданий", href: ROUTES.teacherDashboard },
          { label: assignment.title },
        ]}
      />

      {/* Header */}
      <div className="mt-6 bg-white border-2 border-[#e6e8ee] rounded-[20px] p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <h1 className="text-[32px] font-medium text-[#21214f] tracking-[-0.5px]">
                {assignment.title}
              </h1>
              {getStatusBadge(assignment.status)}
            </div>
            <p className="text-[15px] text-[#767692] mb-3">
              {assignment.courseName} ({assignment.courseCode})
            </p>
            {assignment.description && (
              <p className="text-[15px] text-[#21214f] leading-[1.6] max-w-[800px]">
                {assignment.description}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 ml-4">
            <button
              onClick={() => {
                window.location.hash = `/teacher/assignments/new?edit=${assignmentId}`;
              }}
              className="flex items-center gap-2 px-4 py-3 border-2 border-[#e6e8ee] text-[#21214f] rounded-[12px] hover:bg-[#f9f9f9] transition-colors"
            >
              <Edit className="w-4 h-4" />
              <span className="text-[14px] font-medium">Редактировать</span>
            </button>
            <button
              onClick={() => {
                if (confirm("Удалить это задание?")) {
                  window.location.hash = "/teacher/assignments";
                }
              }}
              className="flex items-center gap-2 px-4 py-3 border-2 border-[#e6e8ee] text-[#d4183d] rounded-[12px] hover:border-[#d4183d] hover:bg-[#fff5f5] transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span className="text-[14px] font-medium">Удалить</span>
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4 pt-4 border-t-2 border-[#e6e8ee]">
          <div>
            <p className="text-[13px] text-[#767692] mb-1">Студентов в курсе</p>
            <p className="text-[24px] font-medium text-[#21214f]">{assignment.studentsCount}</p>
          </div>
          <div>
            <p className="text-[13px] text-[#767692] mb-1">Сдано работ</p>
            <p className="text-[24px] font-medium text-[#5b8def]">{assignment.submissionsCount}</p>
          </div>
          <div>
            <p className="text-[13px] text-[#767692] mb-1">Рецензий готово</p>
            <p className="text-[24px] font-medium text-[#4caf50]">{assignment.reviewsCount}</p>
          </div>
          <div>
            <p className="text-[13px] text-[#767692] mb-1">Всего рецензий</p>
            <p className="text-[24px] font-medium text-[#21214f]">
              {assignment.submissionsCount * assignment.reviewsPerSubmission}
            </p>
          </div>
        </div>
      </div>

      {/* Deadlines */}
      <div className="mt-6 bg-white border-2 border-[#e6e8ee] rounded-[20px] p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-[#5b8def]" />
          <h2 className="text-[20px] font-medium text-[#21214f] tracking-[-0.5px]">Дедлайны</h2>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-[13px] text-[#767692] mb-2">Дедлайн сдачи работы</p>
            <p className="text-[16px] text-[#21214f] font-medium">
              {formatDate(assignment.submissionDeadline)}
            </p>
          </div>
          <div>
            <p className="text-[13px] text-[#767692] mb-2">Дедлайн рецензирования</p>
            <p className="text-[16px] text-[#21214f] font-medium">
              {formatDate(assignment.reviewDeadline)}
            </p>
          </div>
        </div>
      </div>

      {/* Settings Summary */}
      <div className="mt-6 bg-white border-2 border-[#e6e8ee] rounded-[20px] p-6">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="w-5 h-5 text-[#5b8def]" />
          <h2 className="text-[20px] font-medium text-[#21214f] tracking-[-0.5px]">
            Настройки peer review
          </h2>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div>
            <p className="text-[13px] text-[#767692] mb-2">Рецензий на одну работу</p>
            <p className="text-[16px] text-[#21214f] font-medium">
              {assignment.reviewsPerSubmission}
            </p>
          </div>
          <div>
            <p className="text-[13px] text-[#767692] mb-2">Рубрика оценивания</p>
            <p className="text-[16px] text-[#21214f] font-medium">
              {assignment.rubricName || "Не указана"}
            </p>
          </div>
          <div>
            <p className="text-[13px] text-[#767692] mb-2">Режим распределения</p>
            <p className="text-[16px] text-[#21214f] font-medium">Случайное</p>
          </div>
        </div>
      </div>

      {/* Action Cards */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <button
          onClick={() => {
            window.location.hash = `/teacher/peer-session-settings/${assignmentId}`;
          }}
          className="p-6 bg-white border-2 border-[#e6e8ee] rounded-[16px] hover:border-[#5b8def] hover:bg-[#e9f5ff] transition-all text-left group"
        >
          <Settings className="w-6 h-6 text-[#5b8def] mb-3" />
          <h3 className="text-[16px] font-medium text-[#21214f] mb-2">Настройки peer-сессии</h3>
          <p className="text-[13px] text-[#767692]">Анонимность, распределение, штрафы</p>
        </button>

        <button
          onClick={() => {
            window.location.hash = `/teacher/submissions?assignmentId=${assignmentId}`;
          }}
          className="p-6 bg-white border-2 border-[#e6e8ee] rounded-[16px] hover:border-[#5b8def] hover:bg-[#e9f5ff] transition-all text-left group"
        >
          <FileText className="w-6 h-6 text-[#5b8def] mb-3" />
          <h3 className="text-[16px] font-medium text-[#21214f] mb-2">Сабмишены</h3>
          <p className="text-[13px] text-[#767692]">Просмотр работ студентов с проверками</p>
        </button>

        <button
          onClick={() => {
            window.location.hash = `/teacher/assignment/${assignmentId}/analytics`;
          }}
          className="p-6 bg-white border-2 border-[#e6e8ee] rounded-[16px] hover:border-[#5b8def] hover:bg-[#e9f5ff] transition-all text-left group"
        >
          <BarChart3 className="w-6 h-6 text-[#5b8def] mb-3" />
          <h3 className="text-[16px] font-medium text-[#21214f] mb-2">Аналитика</h3>
          <p className="text-[13px] text-[#767692]">Статистика сдачи и оценок</p>
        </button>
      </div>

      {/* Success Message for Published Assignments */}
      {assignment.status === "published" && assignment.submissionsCount === 0 && (
        <div className="mt-6 bg-[#e8f5e9] border border-[#4caf50] rounded-[16px] p-4">
          <p className="text-[14px] text-[#21214f]">
            ✅ <strong>Задание успешно опубликовано!</strong> Студенты курса {assignment.courseName}{" "}
            уже могут видеть это задание и начать работу.
          </p>
        </div>
      )}
    </AppShell>
  );
}
