import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";

import { getCrumbs } from "@/shared/config/breadcrumbs.ts";
import { ROUTES } from "@/shared/config/routes.ts";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs.tsx";

import { VersionTimeline } from "@/entities/work";
import type { Version } from "@/entities/work";

import { ComparisonView } from "@/features/submission/compare";

import { AppShell } from "@/widgets/app-shell/AppShell.tsx";

import { mockVersions } from "../model/mockVersions";

/**
 * SubmissionsPage - История версий работы
 *
 * Route: /courses/:courseId/tasks/:taskId/submissions
 *
 * Features:
 * - Timeline of all versions (v1, v2, ...)
 * - Each version shows: timestamp, status, files, note, checks
 * - Actions: Download, View Reports, Make Current, Create New Version
 * - Comparison mode: select 2 versions to compare side-by-side
 * - Empty state if no submissions
 * - Handle work limits
 */

export default function SubmissionsPage() {
  const { courseId = "", taskId = "" } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const CRUMBS = getCrumbs();
  const [comparisonMode, setComparisonMode] = useState(false);
  const [selectedVersions, setSelectedVersions] = useState<string[]>([]);

  // Mock data - will be replaced with API
  const courseName = t("student.submissions.mockCourseName");
  const taskTitle = t("student.submissions.mockTaskTitle");
  const allowResubmissions = true; // If false, hide "Create new version"
  const maxSubmissions = 3; // 0 = unlimited

  const [versions] = useState<Version[]>(mockVersions);

  // Handle version selection for comparison
  const handleToggleSelect = (versionId: string) => {
    setSelectedVersions((prev) => {
      if (prev.includes(versionId)) {
        return prev.filter((id) => id !== versionId);
      }
      if (prev.length >= 2) {
        // Max 2 versions for comparison
        return [prev[1], versionId];
      }
      return [...prev, versionId];
    });
  };

  // Get selected version objects
  const getSelectedVersionsObjects = (): [Version, Version] | null => {
    if (selectedVersions.length !== 2) return null;
    const v1 = versions.find((v) => v.id === selectedVersions[0]);
    const v2 = versions.find((v) => v.id === selectedVersions[1]);
    return v1 && v2 ? [v1, v2] : null;
  };

  const selectedVersionsObjects = getSelectedVersionsObjects();

  // Actions
  const handleDownload = (versionId: string) => {
    console.log("Download version:", versionId);
    alert(`${t("student.submissions.downloadingVersion")} ${versionId}`);
  };

  const handleViewReports = (versionId: string) => {
    console.log("View reports for version:", versionId);
    alert(`${t("student.submissions.viewingReports")} ${versionId}`);
  };

  const handleMakeCurrent = (versionId: string) => {
    console.log("Make version current:", versionId);
    if (confirm(t("student.submissions.makeCurrentVersion"))) {
      alert(`${t("student.submissions.versionNowCurrent", { id: versionId })}`);
    }
  };

  const handleCreateNewVersion = () => {
    // Check if max submissions reached
    if (maxSubmissions > 0 && versions.length >= maxSubmissions) {
      alert(t("student.submissions.maxVersionsReached", { max: maxSubmissions }));
      return;
    }
    void navigate(`/courses/${courseId}/tasks/${taskId}/submit`);
  };

  // Update versions with selected state for comparison
  const versionsWithSelection = versions.map((v) => ({
    ...v,
    selected: selectedVersions.includes(v.id),
  }));

  // Empty state
  if (versions.length === 0) {
    return (
      <AppShell title={t("student.submissions.title")}>
        <Breadcrumbs
          items={[
            CRUMBS.courses,
            { label: courseName, href: ROUTES.course(courseId) },
            { label: taskTitle, href: ROUTES.task(courseId, taskId) },
            { label: t("student.submissions.breadcrumbVersions") },
          ]}
        />

        <div className="flex items-center justify-center min-h-[400px]">
          <div className="bg-muted rounded-[20px] p-8 max-w-[480px] text-center">
            <div className="mb-4">
              <div className="w-16 h-16 bg-brand-primary-lighter rounded-full mx-auto flex items-center justify-center">
                <span className="text-[32px]">📝</span>
              </div>
            </div>
            <h2 className="text-[24px] font-medium text-foreground mb-3 tracking-[-0.5px]">
              {t("student.submissions.noSubmissions")}
            </h2>
            <p className="text-[16px] text-muted-foreground leading-[1.5] mb-6">
              {t("student.submissions.noSubmissionsDesc")}
            </p>
            <button
              onClick={() => {
                void navigate(`/courses/${courseId}/tasks/${taskId}/submit`);
              }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-primary hover:bg-brand-primary-hover text-primary-foreground rounded-[12px] transition-colors text-[15px] font-medium"
            >
              {t("student.submissions.submitWork")}
            </button>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title={t("student.submissions.title")}>
      <Breadcrumbs
        items={[
          CRUMBS.courses,
          { label: courseName, href: ROUTES.course(courseId) },
          { label: taskTitle, href: ROUTES.task(courseId, taskId) },
          { label: t("student.submissions.breadcrumbVersions") },
        ]}
      />

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-[32px] font-medium text-foreground tracking-[-0.5px] mb-2">
          {t("student.submissions.title")}
        </h1>
        <p className="text-[16px] text-muted-foreground leading-[1.5]">{taskTitle}</p>
      </div>

      {/* Comparison Mode Toggle */}
      <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
        <button
          onClick={() => {
            setComparisonMode(!comparisonMode);
            setSelectedVersions([]);
          }}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-[12px] text-[14px] font-medium transition-colors ${
            comparisonMode
              ? "bg-brand-primary text-primary-foreground hover:bg-brand-primary-hover"
              : "bg-brand-primary-lighter text-foreground hover:bg-brand-primary-lighter"
          }`}
        >
          {comparisonMode
            ? t("student.submissions.cancelCompare")
            : t("student.submissions.compareVersions")}
        </button>

        {comparisonMode && (
          <p className="text-[13px] text-muted-foreground">
            {t("student.submissions.selectTwoVersions")} ({selectedVersions.length}/2)
          </p>
        )}

        {!allowResubmissions && (
          <div className="bg-warning-light border border-warning rounded-[12px] px-4 py-2 flex-1 max-w-md">
            <p className="text-[13px] text-foreground">
              {t("student.submissions.singleSubmission")}
            </p>
          </div>
        )}
      </div>

      {/* Comparison View (if 2 versions selected) */}
      {comparisonMode && selectedVersionsObjects && (
        <ComparisonView
          version1={selectedVersionsObjects[0]}
          version2={selectedVersionsObjects[1]}
          onClose={() => {
            setSelectedVersions([]);
          }}
        />
      )}

      {/* Version Timeline */}
      <VersionTimeline
        versions={versionsWithSelection}
        allowResubmissions={allowResubmissions}
        onDownload={handleDownload}
        onViewReports={handleViewReports}
        onMakeCurrent={handleMakeCurrent}
        onCreateNewVersion={handleCreateNewVersion}
        onToggleSelect={comparisonMode ? handleToggleSelect : undefined}
        comparisonMode={comparisonMode}
      />
    </AppShell>
  );
}
