import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import { getCrumbs } from "@/shared/config/breadcrumbs.ts";
import { useAsync } from "@/shared/lib/useAsync";
import { Card } from "@/shared/ui";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs.tsx";
import { ErrorBanner } from "@/shared/ui/ErrorBanner";
import { PageSkeleton } from "@/shared/ui/PageSkeleton";

import { assignmentRepo } from "@/entities/assignment";
import { courseRepo } from "@/entities/course";

import { AppShell } from "@/widgets/app-shell/AppShell.tsx";
import {
  TeacherCourseAssignments,
  TeacherCourseParticipants,
  TeacherCourseSettings,
} from "@/widgets/teacher-course-detail";

type TabKey = "assignments" | "participants" | "settings";

export default function TeacherCourseDetailsPage() {
  const { courseId: routeCourseId } = useParams<{ courseId: string }>();
  const courseId = routeCourseId ?? "c1";
  const { t } = useTranslation();
  const CRUMBS = getCrumbs();
  const [activeTab, setActiveTab] = useState<TabKey>("assignments");

  const { data, isLoading, error, refetch } = useAsync(
    async () => {
      const course = await courseRepo.getById(courseId || "c1");
      const [participants, courseAssignments] = await Promise.all([
        course
          ? courseRepo.getParticipants(course.id)
          : Promise.resolve({ teachers: [], students: [] }),
        course ? assignmentRepo.getByCourse(course.id) : Promise.resolve([]),
      ]);
      const teacher = participants.teachers[0] ?? null;
      return { course, teacher, courseAssignments };
    },
    [courseId],
    { onError: "redirect" },
  );

  if (isLoading)
    return (
      <AppShell title={t("teacher.courseDetail.loadingCourse")}>
        <PageSkeleton />
      </AppShell>
    );
  if (error)
    return (
      <AppShell title={t("teacher.courseDetail.error")}>
        <ErrorBanner error={error} onRetry={refetch} />
      </AppShell>
    );

  const { course, teacher, courseAssignments } = data!;

  if (!course) {
    return (
      <AppShell title={t("teacher.courseDetail.courseNotFound")}>
        <div className="text-center py-12">
          <p className="text-base text-muted-foreground">
            {t("teacher.courseDetail.courseNotFound")}
          </p>
        </div>
      </AppShell>
    );
  }

  const tabs = [
    { key: "assignments" as TabKey, label: t("teacher.courseDetail.tabs.assignments") },
    { key: "participants" as TabKey, label: t("teacher.courseDetail.tabs.participants") },
    { key: "settings" as TabKey, label: t("teacher.courseDetail.tabs.settings") },
  ];

  return (
    <AppShell title={course.name}>
      <Breadcrumbs items={[CRUMBS.teacherCourses, { label: course.name }]} />

      <div className="mt-6">
        {/* Header */}
        <Card className="p-4 tablet:p-6 mb-6">
          <div className="flex flex-col tablet:flex-row tablet:items-start tablet:justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-2">
                <h1 className="text-[clamp(20px,4.5vw,32px)] font-medium text-foreground tracking-[-0.5px] leading-tight [overflow-wrap:anywhere] [text-wrap:balance]">
                  {course.name}
                </h1>
                {course.status === "active" ? (
                  <span className="px-3 py-1 bg-success-light text-success rounded-sm text-13 font-medium whitespace-nowrap shrink-0">
                    {t("teacher.courseDetail.status.active")}
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-muted text-muted-foreground rounded-sm text-13 font-medium whitespace-nowrap shrink-0">
                    {t("teacher.courseDetail.status.archived")}
                  </span>
                )}
              </div>
              {teacher && (
                <p className="text-sm text-muted-foreground">
                  {t("teacher.courseDetail.meta.teacherLabel")}{" "}
                  <span className="text-foreground font-medium">{teacher.name}</span>
                </p>
              )}
            </div>
            <div className="flex items-center gap-4 text-center shrink-0 self-start">
              <div className="min-w-[72px]">
                <p className="text-2xl font-medium text-foreground tabular-nums leading-none mb-1">
                  {course.enrollmentCount}
                </p>
                <p className="text-13 text-muted-foreground whitespace-nowrap">
                  {t("teacher.courseDetail.meta.participants")}
                </p>
              </div>
              <div className="w-px h-12 bg-border" />
              <div className="min-w-[72px]">
                <p className="text-2xl font-medium text-foreground tabular-nums leading-none mb-1">
                  {courseAssignments.filter((a) => a.status === "published").length}
                </p>
                <p className="text-13 text-muted-foreground whitespace-nowrap">
                  {t("teacher.courseDetail.meta.assignments")}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Tabs - Straight underline indicator */}
        <Card className="p-0 overflow-hidden">
          <div className="border-b-2 border-border">
            <div className="flex gap-0">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`
                    relative px-6 py-4 text-base font-medium transition-colors
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
            {activeTab === "settings" && <TeacherCourseSettings course={course} />}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
