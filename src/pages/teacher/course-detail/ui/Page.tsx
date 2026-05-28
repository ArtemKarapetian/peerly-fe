import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import { getCrumbs } from "@/shared/config/breadcrumbs.ts";
import { useAsync } from "@/shared/lib/useAsync";
import { Card, EmptyState } from "@/shared/ui";
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

import { CourseHeaderCard } from "./CourseHeaderCard";
import { CourseTabsBar } from "./CourseTabsBar";

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
        <EmptyState message={t("teacher.courseDetail.courseNotFound")} />
      </AppShell>
    );
  }

  const tabs: { key: TabKey; label: string }[] = [
    { key: "assignments", label: t("teacher.courseDetail.tabs.assignments") },
    { key: "participants", label: t("teacher.courseDetail.tabs.participants") },
    { key: "settings", label: t("teacher.courseDetail.tabs.settings") },
  ];

  return (
    <AppShell title={course.name}>
      <Breadcrumbs items={[CRUMBS.teacherCourses, { label: course.name }]} />

      <div className="mt-6">
        <CourseHeaderCard course={course} teacher={teacher} courseAssignments={courseAssignments} />

        <Card className="p-0 overflow-hidden">
          <CourseTabsBar tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

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
