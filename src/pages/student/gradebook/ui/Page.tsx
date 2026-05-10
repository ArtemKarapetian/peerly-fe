import { useMemo, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { AppShell } from "@/widgets/app-shell/AppShell.tsx";
import { GradebookHeader, GradeTable } from "@/widgets/gradebook";
import type { GradeEntry } from "@/widgets/gradebook";

import { useGradebookEntries } from "../model/queries";

const STATUS_LABEL_KEYS: Record<string, string> = {
  PUBLISHED: "student.gradebook.statusPublished",
  IN_REVIEW: "student.gradebook.statusInReview",
  NOT_SUBMITTED: "student.gradebook.statusNotSubmitted",
};

const STATUS_COLORS: Record<string, string> = {
  PUBLISHED: "bg-success-light text-success",
  IN_REVIEW: "bg-warning-light text-warning",
  NOT_SUBMITTED: "bg-error-light text-error",
};

export default function GradebookPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data, isLoading } = useGradebookEntries();
  const grades = useMemo(() => data ?? [], [data]);

  const [selectedCourse, setSelectedCourse] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const courses = useMemo(() => {
    const map = new Map<string, string>();
    for (const g of grades) map.set(g.courseId, g.courseName);
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [grades]);

  const filteredGrades = useMemo(
    () =>
      grades.filter((g) => {
        const courseMatch = selectedCourse === "all" || g.courseId === selectedCourse;
        const statusMatch = selectedStatus === "all" || g.status === selectedStatus;
        return courseMatch && statusMatch;
      }),
    [grades, selectedCourse, selectedStatus],
  );

  const stats = useMemo(() => {
    const published = filteredGrades.filter((g) => g.status === "PUBLISHED" && g.score !== null);
    const totalScore = published.reduce((sum, g) => sum + (g.score ?? 0), 0);
    const totalMax = published.reduce((sum, g) => sum + g.maxScore, 0);
    const avgPercentage = totalMax > 0 ? (totalScore / totalMax) * 100 : 0;
    return {
      total: filteredGrades.length,
      published: published.length,
      avgPercentage: avgPercentage.toFixed(1),
    };
  }, [filteredGrades]);

  const handleRowClick = useCallback(
    (grade: GradeEntry) => {
      void navigate(`/student/courses/${grade.courseId}/tasks/${grade.taskId}`);
    },
    [navigate],
  );

  const statusLabels = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(STATUS_LABEL_KEYS).map(([key, i18nKey]) => [key, t(i18nKey)]),
      ),
    [t],
  );

  return (
    <AppShell>
      <GradebookHeader
        stats={stats}
        courses={courses}
        selectedCourse={selectedCourse}
        selectedStatus={selectedStatus}
        statusLabels={statusLabels}
        onCourseChange={setSelectedCourse}
        onStatusChange={setSelectedStatus}
        onReset={() => {
          setSelectedCourse("all");
          setSelectedStatus("all");
        }}
      />

      <div className="max-w-[1400px] mx-auto px-4 tablet:px-6 desktop:px-8 py-6 desktop:py-8">
        <div className="desktop:hidden mb-6 grid grid-cols-2 gap-4">
          <div className="bg-card border-2 border-border rounded-[12px] p-4">
            <div className="text-[13px] text-muted-foreground mb-1">
              {t("student.gradebook.avgScore")}
            </div>
            <div className="text-[24px] font-semibold text-foreground">{stats.avgPercentage}%</div>
          </div>
          <div className="bg-card border-2 border-border rounded-[12px] p-4">
            <div className="text-[13px] text-muted-foreground mb-1">
              {t("student.gradebook.gradesReceived")}
            </div>
            <div className="text-[24px] font-semibold text-foreground">
              {stats.published} / {stats.total}
            </div>
          </div>
        </div>

        {isLoading ? (
          <p className="text-[14px] text-text-tertiary">{t("common.loading")}</p>
        ) : (
          <GradeTable
            grades={filteredGrades}
            statusLabels={statusLabels}
            statusColors={STATUS_COLORS}
            onRowClick={handleRowClick}
          />
        )}
      </div>
    </AppShell>
  );
}
