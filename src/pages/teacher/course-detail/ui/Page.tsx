import { useState } from "react";

import { CRUMBS } from "@/shared/config/breadcrumbs.ts";
import { ROUTES } from "@/shared/config/routes.ts";
import { useAsync } from "@/shared/lib/useAsync";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs.tsx";
import { ErrorBanner } from "@/shared/ui/ErrorBanner";
import { PageSkeleton } from "@/shared/ui/PageSkeleton";

import { assignmentRepo } from "@/entities/assignment";
import { courseRepo } from "@/entities/course";
import { userRepo } from "@/entities/user";

import { AppShell } from "@/widgets/app-shell/AppShell.tsx";
import {
  TeacherCourseAssignments,
  TeacherCourseParticipants,
  TeacherCourseAnnouncements,
  TeacherCourseSettings,
} from "@/widgets/teacher-course-detail";

/**
 * TeacherCourseDetailsPage - Детальный вид курса для преподавателя
 *
 * Вкладки с straight underline indicator:
 * 1. Задания
 * 2. Участники
 * 3. Анонсы
 * 4. Настройки
 */

type TabKey = "assignments" | "participants" | "announcements" | "settings";

interface TeacherCourseDetailsPageProps {
  courseId?: string | null;
}

export default function TeacherCourseDetailsPage({
  courseId = "c1",
}: TeacherCourseDetailsPageProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("assignments");

  // Load course, teacher, and assignments data
  const { data, isLoading, error, refetch } = useAsync(async () => {
    const course = await courseRepo.getById(courseId || "c1");
    const [teacher, courseAssignments] = await Promise.all([
      course ? userRepo.getById(course.teacherId) : Promise.resolve(null),
      course ? assignmentRepo.getByCourse(course.id) : Promise.resolve([]),
    ]);
    return { course, teacher, courseAssignments };
  }, [courseId]);

  if (isLoading)
    return (
      <AppShell title="Загрузка курса...">
        <PageSkeleton />
      </AppShell>
    );
  if (error)
    return (
      <AppShell title="Ошибка">
        <ErrorBanner message={error.message} onRetry={refetch} />
      </AppShell>
    );

  const { course, teacher, courseAssignments } = data!;

  if (!course) {
    return (
      <AppShell title="Курс н найден">
        <div className="text-center py-12">
          <p className="text-[16px] text-[#767692]">Курс не найден</p>
        </div>
      </AppShell>
    );
  }

  const tabs = [
    { key: "assignments" as TabKey, label: "Задания" },
    { key: "participants" as TabKey, label: "Участники" },
    { key: "announcements" as TabKey, label: "Анонсы" },
    { key: "settings" as TabKey, label: "Настройки" },
  ];

  return (
    <AppShell title={course.name}>
      <Breadcrumbs
        items={[
          CRUMBS.teacherDashboard,
          { label: "Курсы", href: ROUTES.teacherCourses },
          { label: course.name },
        ]}
      />

      <div className="mt-6">
        {/* Header */}
        <div className="bg-white border-2 border-[#e6e8ee] rounded-[20px] p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-[32px] font-medium text-[#21214f] tracking-[-0.5px]">
                  {course.name}
                </h1>
                {course.status === "active" ? (
                  <span className="px-3 py-1 bg-[#e8f5e9] text-[#4caf50] rounded-[8px] text-[13px] font-medium">
                    Активен
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-[#f5f5f5] text-[#767692] rounded-[8px] text-[13px] font-medium">
                    Архив
                  </span>
                )}
              </div>
              <p className="text-[15px] text-[#767692] mb-3">{course.code} • Весна 2025</p>
              {teacher && (
                <p className="text-[14px] text-[#767692]">
                  Преподаватель: <span className="text-[#21214f] font-medium">{teacher.name}</span>
                </p>
              )}
            </div>
            <div className="flex items-center gap-4 text-center">
              <div>
                <p className="text-[24px] font-medium text-[#21214f]">{course.enrollmentCount}</p>
                <p className="text-[13px] text-[#767692]">Участников</p>
              </div>
              <div className="w-px h-12 bg-[#e6e8ee]"></div>
              <div>
                <p className="text-[24px] font-medium text-[#21214f]">
                  {courseAssignments.filter((a) => a.status === "published").length}
                </p>
                <p className="text-[13px] text-[#767692]">Заданий</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs - Straight underline indicator */}
        <div className="bg-white border-2 border-[#e6e8ee] rounded-[20px] overflow-hidden">
          <div className="border-b-2 border-[#e6e8ee]">
            <div className="flex gap-0">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`
                    relative px-6 py-4 text-[16px] font-medium transition-colors
                    ${
                      activeTab === tab.key
                        ? "text-[#2563eb]"
                        : "text-[#767692] hover:text-[#21214f]"
                    }
                  `}
                >
                  {tab.label}
                  {/* Straight underline indicator */}
                  {activeTab === tab.key && (
                    <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#2563eb]"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "assignments" && <TeacherCourseAssignments courseId={course.id} />}
            {activeTab === "participants" && <TeacherCourseParticipants courseId={course.id} />}
            {activeTab === "announcements" && <TeacherCourseAnnouncements courseId={course.id} />}
            {activeTab === "settings" && <TeacherCourseSettings course={course} />}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
