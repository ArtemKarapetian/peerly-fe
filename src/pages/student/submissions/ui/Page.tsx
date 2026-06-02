import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import { getCrumbs } from "@/shared/config/breadcrumbs.ts";
import { ROUTES } from "@/shared/config/routes.ts";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs.tsx";
import { ErrorBanner } from "@/shared/ui/ErrorBanner";
import { PageSkeleton } from "@/shared/ui/PageSkeleton";

import { useAssignment } from "@/entities/assignment";
import { useCourse } from "@/entities/course";
import { useRubric } from "@/entities/rubric";
import { useMySubmission } from "@/entities/work";

import { AppShell } from "@/widgets/app-shell";

import { useSubmissionDetail } from "../model/useSubmissionDetail";

import { CommentSection } from "./CommentSection";
import { FilesSection } from "./FilesSection";
import { FinalMarkAside } from "./FinalMarkAside";
import { NoSubmissionView } from "./NoSubmissionView";
import { ReviewsSection } from "./ReviewsSection";
import { SubmissionsPageHeader } from "./SubmissionsPageHeader";

export default function SubmissionsPage() {
  const { courseId = "", taskId = "" } = useParams();
  const { t } = useTranslation();
  const CRUMBS = getCrumbs();

  const { data: course } = useCourse(courseId);
  const { data: hw } = useAssignment(taskId);
  const { data: submission, isLoading, isError, error, refetch } = useMySubmission(taskId);
  const submissionDetail = useSubmissionDetail(submission?.id);
  const { data: rubricDetail } = useRubric(hw?.rubricId ?? undefined);

  const [now] = useState(() => Date.now());
  const isDeadlinePassed = hw?.dueDate ? hw.dueDate.getTime() < now : false;

  const courseName = course?.name ?? "";
  const taskTitle = hw?.title ?? "";
  const reviews = submissionDetail.data?.submittedReviews ?? [];
  const finalMark = submissionDetail.data?.finalMark ?? null;
  const rubricTotal = rubricDetail?.criteria.reduce((sum, c) => sum + c.maxScore, 0) ?? 0;
  const maxScore = rubricTotal > 0 ? rubricTotal : 100;

  const breadcrumbs = [
    CRUMBS.courses,
    { label: courseName, href: ROUTES.course(courseId) },
    { label: taskTitle, href: ROUTES.task(courseId, taskId) },
    { label: t("student.submissions.breadcrumb") },
  ];

  if (isLoading) {
    return (
      <AppShell title={t("student.submissions.title")}>
        <Breadcrumbs items={breadcrumbs} />
        <PageSkeleton />
      </AppShell>
    );
  }

  if (isError) {
    return (
      <AppShell title={t("student.submissions.title")}>
        <Breadcrumbs items={breadcrumbs} />
        <ErrorBanner error={error} onRetry={() => void refetch()} />
      </AppShell>
    );
  }

  if (!submission) {
    return (
      <NoSubmissionView
        courseId={courseId}
        taskId={taskId}
        isDeadlinePassed={isDeadlinePassed}
        breadcrumbs={breadcrumbs}
      />
    );
  }

  return (
    <AppShell title={t("student.submissions.title")}>
      <Breadcrumbs items={breadcrumbs} />

      <SubmissionsPageHeader
        taskTitle={taskTitle}
        courseId={courseId}
        taskId={taskId}
        isDeadlinePassed={isDeadlinePassed}
      />

      <div className="grid gap-4 desktop:grid-cols-3">
        <div className="desktop:col-span-2 space-y-4">
          <CommentSection content={submission.content} />
          <FilesSection files={submission.files} />
          <ReviewsSection reviews={reviews} maxScore={maxScore} />
        </div>
        <FinalMarkAside finalMark={finalMark} maxScore={maxScore} />
      </div>
    </AppShell>
  );
}
