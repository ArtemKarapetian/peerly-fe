import { Edit, Trash2, Calendar, BarChart3, Settings, FileText } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";

import { getCrumbs } from "@/shared/config/breadcrumbs.ts";
import { ROUTES } from "@/shared/config/routes.ts";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs.tsx";

import { useTeacherAssignmentDetail } from "@/entities/assignment";
import { useCourse } from "@/entities/course";

import { AppShell } from "@/widgets/app-shell/AppShell.tsx";

function formatDate(date: Date, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default function TeacherAssignmentDetailsPage() {
  const { assignmentId = "" } = useParams<{ assignmentId: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const CRUMBS = getCrumbs();

  const { data: detail, isLoading } = useTeacherAssignmentDetail(assignmentId);
  const courseId = detail?.assignment.courseId ?? "";
  const { data: course } = useCourse(courseId);

  if (isLoading) {
    return (
      <AppShell title={t("teacher.assignmentDetail.title")}>
        <Breadcrumbs items={[CRUMBS.teacherCourses, { label: t("common.loading") }]} />
        <p className="mt-6 text-[14px] text-text-tertiary">{t("common.loading")}</p>
      </AppShell>
    );
  }

  if (!detail) {
    return (
      <AppShell title={t("teacher.assignmentDetail.title")}>
        <Breadcrumbs items={[CRUMBS.teacherCourses, { label: t("common.notFound") }]} />
        <p className="mt-6 text-[14px] text-text-tertiary">
          {t("teacher.assignmentDetail.notFound")}
        </p>
      </AppShell>
    );
  }

  const { assignment, submittedCount, totalStudentsCount } = detail;
  const courseName = course?.title ?? "";
  const reviewsCount = submittedCount * assignment.reviewCount;
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

      <div className="mt-6 bg-card border border-border shadow-sm rounded-[20px] p-6">
        <div className="flex items-start justify-between mb-4 gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <h1 className="text-[28px] desktop:text-[32px] font-medium text-foreground tracking-[-0.5px]">
                {assignment.title}
              </h1>
              <span
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-[8px] text-[13px] font-medium ${
                  isPublished ? "bg-success-light text-success" : "bg-muted text-muted-foreground"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isPublished ? "bg-success" : "bg-muted-foreground"
                  }`}
                />
                {isPublished
                  ? t("teacher.assignmentDetail.published")
                  : t("teacher.assignmentDetail.draft")}
              </span>
            </div>
            {courseName ? (
              <p className="text-[15px] text-muted-foreground mb-3">{courseName}</p>
            ) : null}
            {assignment.description ? (
              <p className="text-[15px] text-foreground leading-[1.6] max-w-[800px]">
                {assignment.description}
              </p>
            ) : null}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => void navigate(`/teacher/assignments/new?edit=${assignmentId}`)}
              className="flex items-center gap-2 px-4 py-3 border-2 border-border text-foreground rounded-[12px] hover:bg-muted transition-colors"
            >
              <Edit className="w-4 h-4" />
              <span className="text-[14px] font-medium">
                {t("teacher.assignmentDetail.editBtn")}
              </span>
            </button>
            <button
              onClick={() => {
                if (confirm(t("teacher.assignmentDetail.deleteConfirm"))) {
                  void navigate("/teacher/assignments");
                }
              }}
              className="flex items-center gap-2 px-4 py-3 border-2 border-border text-error rounded-[12px] hover:border-error hover:bg-error-light transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span className="text-[14px] font-medium">
                {t("teacher.assignmentDetail.deleteBtn")}
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 tablet:grid-cols-4 gap-4 pt-4 border-t border-border">
          <div>
            <p className="text-[13px] text-muted-foreground mb-1">
              {t("teacher.assignmentDetail.studentsInCourse")}
            </p>
            <p className="text-[24px] font-medium text-foreground">{totalStudentsCount}</p>
          </div>
          <div>
            <p className="text-[13px] text-muted-foreground mb-1">
              {t("teacher.assignmentDetail.submissionsCount")}
            </p>
            <p className="text-[24px] font-medium text-brand-primary">{submittedCount}</p>
          </div>
          <div>
            <p className="text-[13px] text-muted-foreground mb-1">
              {t("teacher.assignmentDetail.reviewsPerSubmission")}
            </p>
            <p className="text-[24px] font-medium text-foreground">{assignment.reviewCount}</p>
          </div>
          <div>
            <p className="text-[13px] text-muted-foreground mb-1">
              {t("teacher.assignmentDetail.totalReviews")}
            </p>
            <p className="text-[24px] font-medium text-foreground">{reviewsCount}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-card border border-border shadow-sm rounded-[20px] p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-brand-primary" />
          <h2 className="text-[20px] font-medium text-foreground tracking-[-0.5px]">
            {t("teacher.assignmentDetail.deadlines")}
          </h2>
        </div>

        <div className="grid grid-cols-1 tablet:grid-cols-2 gap-6">
          <div>
            <p className="text-[13px] text-muted-foreground mb-2">
              {t("teacher.assignmentDetail.submissionDeadline")}
            </p>
            <p className="text-[16px] text-foreground font-medium">
              {formatDate(assignment.dueDate, i18n.language)}
            </p>
          </div>
          {assignment.reviewDeadline ? (
            <div>
              <p className="text-[13px] text-muted-foreground mb-2">
                {t("teacher.assignmentDetail.reviewDeadline")}
              </p>
              <p className="text-[16px] text-foreground font-medium">
                {formatDate(assignment.reviewDeadline, i18n.language)}
              </p>
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 tablet:grid-cols-3 gap-4">
        <button
          onClick={() => void navigate(`/teacher/peer-session-settings/${assignmentId}`)}
          className="p-6 bg-card border border-border shadow-sm rounded-[16px] hover:border-brand-primary hover:bg-info-light transition-all text-left"
        >
          <Settings className="w-6 h-6 text-brand-primary mb-3" />
          <h3 className="text-[16px] font-medium text-foreground mb-2">
            {t("teacher.assignmentDetail.peerSessionSettings")}
          </h3>
          <p className="text-[13px] text-muted-foreground">
            {t("teacher.assignmentDetail.peerSessionSettingsDesc")}
          </p>
        </button>

        <button
          onClick={() => void navigate(`/teacher/submissions?assignmentId=${assignmentId}`)}
          className="p-6 bg-card border border-border shadow-sm rounded-[16px] hover:border-brand-primary hover:bg-info-light transition-all text-left"
        >
          <FileText className="w-6 h-6 text-brand-primary mb-3" />
          <h3 className="text-[16px] font-medium text-foreground mb-2">
            {t("teacher.assignmentDetail.submissions")}
          </h3>
          <p className="text-[13px] text-muted-foreground">
            {t("teacher.assignmentDetail.submissionsDesc")}
          </p>
        </button>

        <button
          onClick={() => void navigate(`/teacher/assignment/${assignmentId}/analytics`)}
          className="p-6 bg-card border border-border shadow-sm rounded-[16px] hover:border-brand-primary hover:bg-info-light transition-all text-left"
        >
          <BarChart3 className="w-6 h-6 text-brand-primary mb-3" />
          <h3 className="text-[16px] font-medium text-foreground mb-2">
            {t("teacher.assignmentDetail.analyticsTitle")}
          </h3>
          <p className="text-[13px] text-muted-foreground">
            {t("teacher.assignmentDetail.analyticsDesc")}
          </p>
        </button>
      </div>

      {isPublished && submittedCount === 0 && courseName ? (
        <div className="mt-6 bg-success-light border border-success rounded-[16px] p-4">
          <p className="text-[14px] text-foreground">
            {t("teacher.assignmentDetail.publishedSuccess")}{" "}
            {t("teacher.assignmentDetail.publishedSuccessDesc", { courseName })}
          </p>
        </div>
      ) : null}
    </AppShell>
  );
}
