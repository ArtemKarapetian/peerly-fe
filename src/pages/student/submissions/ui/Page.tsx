import { useState } from "react";

import { CRUMBS } from "@/shared/config/breadcrumbs.ts";
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

interface SubmissionsPageProps {
  courseId: string;
  taskId: string;
}

export default function SubmissionsPage({ courseId, taskId }: SubmissionsPageProps) {
  const [comparisonMode, setComparisonMode] = useState(false);
  const [selectedVersions, setSelectedVersions] = useState<string[]>([]);

  // Mock data - will be replaced with API
  const courseName = "Веб-разработка";
  const taskTitle = "Задание 1: Создание лендинга";
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
    alert(`Скачивание версии ${versionId}`);
  };

  const handleViewReports = (versionId: string) => {
    console.log("View reports for version:", versionId);
    alert(`Просмотр отчётов для версии ${versionId}`);
  };

  const handleMakeCurrent = (versionId: string) => {
    console.log("Make version current:", versionId);
    if (confirm("Сделать эту версию текущей?")) {
      alert(`Версия ${versionId} теперь текущая`);
    }
  };

  const handleCreateNewVersion = () => {
    // Check if max submissions reached
    if (maxSubmissions > 0 && versions.length >= maxSubmissions) {
      alert(`Достигнуто максимальное количество версий (${maxSubmissions})`);
      return;
    }
    window.location.hash = `/courses/${courseId}/tasks/${taskId}/submit`;
  };

  // Update versions with selected state for comparison
  const versionsWithSelection = versions.map((v) => ({
    ...v,
    selected: selectedVersions.includes(v.id),
  }));

  // Empty state
  if (versions.length === 0) {
    return (
      <AppShell title="История версий">
        <Breadcrumbs
          items={[
            CRUMBS.courses,
            { label: courseName, href: ROUTES.course(courseId) },
            { label: taskTitle, href: ROUTES.task(courseId, taskId) },
            { label: "Версии" },
          ]}
        />

        <div className="flex items-center justify-center min-h-[400px]">
          <div className="bg-[#f9f9f9] rounded-[20px] p-8 max-w-[480px] text-center">
            <div className="mb-4">
              <div className="w-16 h-16 bg-[#d2e1f8] rounded-full mx-auto flex items-center justify-center">
                <span className="text-[32px]">📝</span>
              </div>
            </div>
            <h2 className="text-[24px] font-medium text-[#21214f] mb-3 tracking-[-0.5px]">
              Вы ещё не загружали работу
            </h2>
            <p className="text-[16px] text-[#767692] leading-[1.5] mb-6">
              Начните работу над заданием, загрузив свои файлы.
            </p>
            <button
              onClick={() => {
                window.location.hash = `/courses/${courseId}/tasks/${taskId}/submit`;
              }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#3d6bc6] hover:bg-[#2d5bb6] text-white rounded-[12px] transition-colors text-[15px] font-medium"
            >
              Сдать работу
            </button>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="История версий">
      <Breadcrumbs
        items={[
          CRUMBS.courses,
          { label: courseName, href: ROUTES.course(courseId) },
          { label: taskTitle, href: ROUTES.task(courseId, taskId) },
          { label: "Версии" },
        ]}
      />

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-[32px] font-medium text-[#21214f] tracking-[-0.5px] mb-2">
          История версий
        </h1>
        <p className="text-[16px] text-[#767692] leading-[1.5]">{taskTitle}</p>
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
              ? "bg-[#5b8def] text-white hover:bg-[#4a7ddf]"
              : "bg-[#d2def8] text-[#21214f] hover:bg-[#c5d5f5]"
          }`}
        >
          {comparisonMode ? "Отменить сравнение" : "Сравнить версии"}
        </button>

        {comparisonMode && (
          <p className="text-[13px] text-[#767692]">
            Выберите 2 версии для сравнения ({selectedVersions.length}/2)
          </p>
        )}

        {!allowResubmissions && (
          <div className="bg-[#fff8f0] border border-[#ffe8cc] rounded-[12px] px-4 py-2 flex-1 max-w-md">
            <p className="text-[13px] text-[#4b4963]">
              ℹ️ Для этого задания разрешена только одна отправка
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
