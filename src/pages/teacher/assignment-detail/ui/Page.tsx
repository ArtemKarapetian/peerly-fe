import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import { getCrumbs } from "@/shared/config/breadcrumbs.ts";
import { ROUTES } from "@/shared/config/routes.ts";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs.tsx";

import { useTeacherAssignmentDetail } from "@/entities/assignment";
import { useCourse } from "@/entities/course";

import { AppShell } from "@/widgets/app-shell";

import { useDeleteAssignment } from "../model/useDeleteAssignment";

import { AssignmentHeaderCard } from "./AssignmentHeaderCard";
import { DeadlinesCard } from "./DeadlinesCard";
import { NavTilesRow } from "./NavTilesRow";
import { PublishedHint } from "./PublishedHint";
import { RubricCard } from "./RubricCard";

export default function TeacherAssignmentDetailsPage() {
  const { assignmentId = "" } = useParams<{ assignmentId: string }>();
  const { t, i18n } = useTranslation();
  const CRUMBS = getCrumbs();

  const { data: detail, isLoading } = useTeacherAssignmentDetail(assignmentId);
  const courseId = detail?.assignment.courseId ?? "";
  const { data: course } = useCourse(courseId);
  const { deleting, deleteError, handleDelete } = useDeleteAssignment({
    assignmentId,
    courseId,
  });

  if (isLoading) {
    return (
      <AppShell title={t("teacher.assignmentDetail.title")}>
        <Breadcrumbs items={[CRUMBS.teacherCourses, { label: t("common.loading") }]} />
        <p className="mt-6 text-sm text-text-tertiary">{t("common.loading")}</p>
      </AppShell>
    );
  }

  if (!detail) {
    return (
      <AppShell title={t("teacher.assignmentDetail.title")}>
        <Breadcrumbs items={[CRUMBS.teacherCourses, { label: t("common.notFound") }]} />
        <p className="mt-6 text-sm text-text-tertiary">{t("teacher.assignmentDetail.notFound")}</p>
      </AppShell>
    );
  }

  const { assignment, submittedCount } = detail;
  const courseName = course?.name ?? "";
  const isPublished = assignment.backendStatus !== "draft";

  return (
    <AppShell title={assignment.title}>
      <Breadcrumbs
        items={[
          CRUMBS.teacherCourses,
          { label: courseName, href: ROUTES.teacherCourse(courseId) },
          { label: assignment.title },
        ]}
      />

      <AssignmentHeaderCard
        assignment={assignment}
        courseName={courseName}
        submittedCount={submittedCount}
        isPublished={isPublished}
        deleting={deleting}
        onDelete={() => void handleDelete()}
      />

      {deleteError && (
        <div className="mt-4 bg-error-light border border-error/20 rounded-md p-4">
          <p className="text-13 text-foreground">{deleteError}</p>
        </div>
      )}

      <DeadlinesCard
        dueDate={assignment.dueDate}
        reviewDeadline={assignment.reviewDeadline ?? undefined}
        locale={i18n.language}
      />

      {assignment.rubricId && <RubricCard rubricId={assignment.rubricId} />}

      <NavTilesRow assignmentId={assignmentId} />

      {isPublished && submittedCount === 0 && courseName && (
        <PublishedHint courseName={courseName} />
      )}
    </AppShell>
  );
}
