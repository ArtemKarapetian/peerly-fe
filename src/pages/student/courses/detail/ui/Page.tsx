import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import { getCrumbs } from "@/shared/config/breadcrumbs.ts";
import { coverColorFor } from "@/shared/lib/coverColor";
import { Card } from "@/shared/ui";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs.tsx";
import { ErrorBanner } from "@/shared/ui/ErrorBanner";
import { PageSkeleton } from "@/shared/ui/PageSkeleton";

import { useAssignmentsByCourse } from "@/entities/assignment";
import { CourseHeader, CourseTabs, useCourse, useCourseParticipants } from "@/entities/course";

import { AppShell } from "@/widgets/app-shell";
import { CourseAssignmentsTab } from "@/widgets/course-assignments-tab";
import { CourseParticipantsTab } from "@/widgets/course-participants-tab";

export default function CoursePage() {
  const { courseId: courseIdParam } = useParams();
  const courseId = courseIdParam ?? "";
  const { t } = useTranslation();
  const CRUMBS = getCrumbs();
  const [activeTab, setActiveTab] = useState<"assignments" | "participants">("assignments");

  const { data: course, isLoading, error, refetch } = useCourse(courseId);
  const { data: assignments } = useAssignmentsByCourse(courseId);
  const { data: participants } = useCourseParticipants(courseId);

  const title = course?.name ?? "";
  const description = course?.description ?? "";

  const assignmentsCount = (assignments ?? []).filter(
    (a) => a.backendStatus !== "draft" && a.backendStatus !== "deleted",
  ).length;
  const participantsCount =
    (participants?.students.length ?? 0) + (participants?.teachers.length ?? 0);

  return (
    <AppShell title={title}>
      <Breadcrumbs items={[CRUMBS.courses, { label: title || t("common.loading") }]} />

      <div className="mt-6 space-y-6">
        {isLoading ? (
          <PageSkeleton />
        ) : error ? (
          <ErrorBanner error={error} onRetry={() => void refetch()} />
        ) : (
          <CourseHeader
            title={title}
            coverColor={coverColorFor(courseId)}
            description={description}
            teachers={course?.teachers}
          />
        )}

        <Card className="p-0 overflow-hidden">
          <CourseTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            assignmentsCount={assignmentsCount}
            participantsCount={participantsCount}
          />

          <div className="p-6">
            {activeTab === "assignments" && <CourseAssignmentsTab courseId={courseId} />}
            {activeTab === "participants" && <CourseParticipantsTab courseId={courseId} />}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
