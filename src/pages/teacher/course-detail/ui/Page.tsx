import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import { getCrumbs } from "@/shared/config/breadcrumbs.ts";
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

export default function TeacherCourseDetailsPage() {
  const { courseId: routeCourseId } = useParams<{ courseId: string }>();
  const courseId = routeCourseId ?? "c1";
  const { t } = useTranslation();
  const CRUMBS = getCrumbs();
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
      <AppShell title={t("teacher.courseDetail.loadingCourse")}>
        <PageSkeleton />
      </AppShell>
    );
  if (error)
    return (
      <AppShell title={t("teacher.courseDetail.error")}>
        <ErrorBanner message={error.message} onRetry={refetch} />
      </AppShell>
    );

  const { course, teacher, courseAssignments } = data!;

  if (!course) {
    return (
      <AppShell title={t("teacher.courseDetail.courseNotFound")}>
        <div className="text-center py-12">
          <p className="text-[16px] text-muted-foreground">
            {t("teacher.courseDetail.courseNotFound")}
          </p>
        </div>
      </AppShell>
    );
  }

  const tabs = [
    { key: "assignments" as TabKey, label: t("teacher.courseDetail.tabs.assignments") },
    { key: "participants" as TabKey, label: t("teacher.courseDetail.tabs.participants") },
    { key: "announcements" as TabKey, label: t("teacher.courseDetail.tabs.announcements") },
    { key: "settings" as TabKey, label: t("teacher.courseDetail.tabs.settings") },
  ];

  return (
    <AppShell title={course.name}>
      <Breadcrumbs items={[CRUMBS.teacherCourses, { label: course.name }]} />

      <div className="mt-6">
        {/* Header */}
        <div className="bg-card border-2 border-border rounded-[20px] p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-[32px] font-medium text-foreground tracking-[-0.5px]">
                  {course.name}
                </h1>
                {course.status === "active" ? (
                  <span className="px-3 py-1 bg-success-light text-success rounded-[8px] text-[13px] font-medium">
                    {t("teacher.courseDetail.status.active")}
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-muted text-muted-foreground rounded-[8px] text-[13px] font-medium">
                    {t("teacher.courseDetail.status.archived")}
                  </span>
                )}
              </div>
              <p className="text-[15px] text-muted-foreground mb-3">
                {course.code} • {t("teacher.courseDetail.springTerm")}
              </p>
              {teacher && (
                <p className="text-[14px] text-muted-foreground">
                  {t("teacher.courseDetail.meta.teacherLabel")}{" "}
                  <span className="text-foreground font-medium">{teacher.name}</span>
                </p>
              )}
            </div>
            <div className="flex items-center gap-4 text-center">
              <div>
                <p className="text-[24px] font-medium text-foreground">{course.enrollmentCount}</p>
                <p className="text-[13px] text-muted-foreground">
                  {t("teacher.courseDetail.meta.participants")}
                </p>
              </div>
              <div className="w-px h-12 bg-border"></div>
              <div>
                <p className="text-[24px] font-medium text-foreground">
                  {courseAssignments.filter((a) => a.status === "published").length}
                </p>
                <p className="text-[13px] text-muted-foreground">
                  {t("teacher.courseDetail.meta.assignments")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs - Straight underline indicator */}
        <div className="bg-card border-2 border-border rounded-[20px] overflow-hidden">
          <div className="border-b-2 border-border">
            <div className="flex gap-0">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`
                    relative px-6 py-4 text-[16px] font-medium transition-colors
                    ${
                      activeTab === tab.key
                        ? "text-brand-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }
                  `}
                >
                  {tab.label}
                  {/* Straight underline indicator */}
                  {activeTab === tab.key && (
                    <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-brand-primary"></div>
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
