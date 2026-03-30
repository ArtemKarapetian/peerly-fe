import { Edit, Trash2, Calendar, BarChart3, Settings, FileText } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";

import { getCrumbs } from "@/shared/config/breadcrumbs.ts";
import { ROUTES } from "@/shared/config/routes.ts";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs.tsx";

import { AppShell } from "@/widgets/app-shell/AppShell.tsx";

/**
 * TeacherAssignmentDetailsPage - Детальная страница задания (преподаватель)
 *
 * Отображает созданное задание с его статусом и управляющими кнопками
 */

export default function TeacherAssignmentDetailsPage() {
  const { assignmentId: routeAssignmentId } = useParams<{ assignmentId: string }>();
  const assignmentId = routeAssignmentId ?? "a1";
  const navigate = useNavigate();
  const { t } = useTranslation();
  const CRUMBS = getCrumbs();
  // In a real app, we'd load assignment data from storage/API
  // For now, using mock data with fixed dates

  const assignment = {
    id: assignmentId,
    title: t("teacher.assignmentDetail.mockTitle") || "New Assignment",
    description: t("teacher.assignmentDetail.mockDesc") || "Assignment description",
    status: "published" as "draft" | "published",
    courseName: t("teacher.assignmentDetail.mockCourseName") || "Web Development",
    courseCode: "CS301",
    taskType: "project",
    submissionDeadline: new Date("2024-02-21"),
    reviewDeadline: new Date("2024-02-28"),
    studentsCount: 45,
    submissionsCount: 0,
    reviewsCount: 0,
    rubricName: t("teacher.assignmentDetail.mockRubricName") || "Web Project Assessment",
    reviewsPerSubmission: 3,
  };

  const getStatusBadge = (status: "draft" | "published") => {
    if (status === "published") {
      return (
        <span className="inline-flex items-center gap-2 px-3 py-2 bg-success-light text-success rounded-[8px] text-[14px] font-medium">
          <div className="w-2 h-2 bg-success rounded-full"></div>
          {t("teacher.assignmentDetail.published")}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-2 px-3 py-2 bg-muted text-muted-foreground rounded-[8px] text-[14px] font-medium">
        <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
        {t("teacher.assignmentDetail.draft")}
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
          CRUMBS.teacherCourses,
          { label: assignment.courseName, href: ROUTES.teacherCourse(assignment.courseCode) },
          { label: assignment.title },
        ]}
      />

      {/* Header */}
      <div className="mt-6 bg-card border-2 border-border rounded-[20px] p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <h1 className="text-[32px] font-medium text-foreground tracking-[-0.5px]">
                {assignment.title}
              </h1>
              {getStatusBadge(assignment.status)}
            </div>
            <p className="text-[15px] text-muted-foreground mb-3">
              {assignment.courseName} ({assignment.courseCode})
            </p>
            {assignment.description && (
              <p className="text-[15px] text-foreground leading-[1.6] max-w-[800px]">
                {assignment.description}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 ml-4">
            <button
              onClick={() => {
                void navigate(`/teacher/assignments/new?edit=${assignmentId}`);
              }}
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

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4 pt-4 border-t-2 border-border">
          <div>
            <p className="text-[13px] text-muted-foreground mb-1">
              {t("teacher.assignmentDetail.studentsInCourse")}
            </p>
            <p className="text-[24px] font-medium text-foreground">{assignment.studentsCount}</p>
          </div>
          <div>
            <p className="text-[13px] text-muted-foreground mb-1">
              {t("teacher.assignmentDetail.submissionsCount")}
            </p>
            <p className="text-[24px] font-medium text-brand-primary">
              {assignment.submissionsCount}
            </p>
          </div>
          <div>
            <p className="text-[13px] text-muted-foreground mb-1">
              {t("teacher.assignmentDetail.reviewsReady")}
            </p>
            <p className="text-[24px] font-medium text-success">{assignment.reviewsCount}</p>
          </div>
          <div>
            <p className="text-[13px] text-muted-foreground mb-1">
              {t("teacher.assignmentDetail.totalReviews")}
            </p>
            <p className="text-[24px] font-medium text-foreground">
              {assignment.submissionsCount * assignment.reviewsPerSubmission}
            </p>
          </div>
        </div>
      </div>

      {/* Deadlines */}
      <div className="mt-6 bg-card border-2 border-border rounded-[20px] p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-brand-primary" />
          <h2 className="text-[20px] font-medium text-foreground tracking-[-0.5px]">
            {t("teacher.assignmentDetail.deadlines")}
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-[13px] text-muted-foreground mb-2">
              {t("teacher.assignmentDetail.submissionDeadline")}
            </p>
            <p className="text-[16px] text-foreground font-medium">
              {formatDate(assignment.submissionDeadline)}
            </p>
          </div>
          <div>
            <p className="text-[13px] text-muted-foreground mb-2">
              {t("teacher.assignmentDetail.reviewDeadline")}
            </p>
            <p className="text-[16px] text-foreground font-medium">
              {formatDate(assignment.reviewDeadline)}
            </p>
          </div>
        </div>
      </div>

      {/* Settings Summary */}
      <div className="mt-6 bg-card border-2 border-border rounded-[20px] p-6">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="w-5 h-5 text-brand-primary" />
          <h2 className="text-[20px] font-medium text-foreground tracking-[-0.5px]">
            {t("teacher.assignmentDetail.peerReviewSettings")}
          </h2>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div>
            <p className="text-[13px] text-muted-foreground mb-2">
              {t("teacher.assignmentDetail.reviewsPerSubmission")}
            </p>
            <p className="text-[16px] text-foreground font-medium">
              {assignment.reviewsPerSubmission}
            </p>
          </div>
          <div>
            <p className="text-[13px] text-muted-foreground mb-2">
              {t("teacher.assignmentDetail.gradingRubric")}
            </p>
            <p className="text-[16px] text-foreground font-medium">
              {assignment.rubricName || t("teacher.assignmentDetail.notSpecified")}
            </p>
          </div>
          <div>
            <p className="text-[13px] text-muted-foreground mb-2">
              {t("teacher.assignmentDetail.distributionMode")}
            </p>
            <p className="text-[16px] text-foreground font-medium">
              {t("teacher.assignmentDetail.random")}
            </p>
          </div>
        </div>
      </div>

      {/* Action Cards */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <button
          onClick={() => {
            void navigate(`/teacher/peer-session-settings/${assignmentId}`);
          }}
          className="p-6 bg-card border-2 border-border rounded-[16px] hover:border-brand-primary hover:bg-info-light transition-all text-left group"
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
          onClick={() => {
            void navigate(`/teacher/submissions?assignmentId=${assignmentId}`);
          }}
          className="p-6 bg-card border-2 border-border rounded-[16px] hover:border-brand-primary hover:bg-info-light transition-all text-left group"
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
          onClick={() => {
            void navigate(`/teacher/assignment/${assignmentId}/analytics`);
          }}
          className="p-6 bg-card border-2 border-border rounded-[16px] hover:border-brand-primary hover:bg-info-light transition-all text-left group"
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

      {/* Success Message for Published Assignments */}
      {assignment.status === "published" && assignment.submissionsCount === 0 && (
        <div className="mt-6 bg-success-light border border-success rounded-[16px] p-4">
          <p className="text-[14px] text-foreground">
            {t("teacher.assignmentDetail.publishedSuccess")}{" "}
            {t("teacher.assignmentDetail.publishedSuccessDesc", {
              courseName: assignment.courseName,
            })}
          </p>
        </div>
      )}
    </AppShell>
  );
}
