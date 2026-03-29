import { useState, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";

import { AppShell } from "@/widgets/app-shell/AppShell.tsx";
import { GradebookHeader, GradeTable } from "@/widgets/gradebook";
import type { GradeEntry } from "@/widgets/gradebook";

import { mockGrades, statusLabels, statusColors } from "../model/mockGrades";

export default function GradebookPage() {
  const { t } = useTranslation();
  const [selectedCourse, setSelectedCourse] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const courses = useMemo(() => {
    const uniqueCourses = Array.from(
      new Set(mockGrades.map((g) => JSON.stringify({ id: g.courseId, name: g.courseName }))),
    ).map((str) => JSON.parse(str));
    return uniqueCourses;
  }, []);

  const filteredGrades = useMemo(() => {
    return mockGrades.filter((grade) => {
      const courseMatch = selectedCourse === "all" || grade.courseId === selectedCourse;
      const statusMatch = selectedStatus === "all" || grade.status === selectedStatus;
      return courseMatch && statusMatch;
    });
  }, [selectedCourse, selectedStatus]);

  const stats = useMemo(() => {
    const publishedGrades = filteredGrades.filter(
      (g) => g.status === "PUBLISHED" && g.score !== null,
    );
    const totalScore = publishedGrades.reduce((sum, g) => sum + (g.score || 0), 0);
    const totalMax = publishedGrades.reduce((sum, g) => sum + g.maxScore, 0);
    const avgPercentage = totalMax > 0 ? (totalScore / totalMax) * 100 : 0;

    return {
      total: filteredGrades.length,
      published: publishedGrades.length,
      avgPercentage: avgPercentage.toFixed(1),
    };
  }, [filteredGrades]);

  const handleRowClick = useCallback((grade: GradeEntry) => {
    window.location.hash = `/task/${grade.taskId}`;
  }, []);

  const handleReset = () => {
    setSelectedCourse("all");
    setSelectedStatus("all");
  };

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
        onReset={handleReset}
      />

      <div className="max-w-[1400px] mx-auto px-4 tablet:px-6 desktop:px-8 py-6 desktop:py-8">
        {/* Mobile Stats */}
        <div className="desktop:hidden mb-6 grid grid-cols-2 gap-4">
          <div className="bg-white border-2 border-[#e6e8ee] rounded-[12px] p-4">
            <div className="text-[13px] text-[#767692] mb-1">{t("student.gradebook.avgScore")}</div>
            <div className="text-[24px] font-semibold text-[#21214f]">{stats.avgPercentage}%</div>
          </div>
          <div className="bg-white border-2 border-[#e6e8ee] rounded-[12px] p-4">
            <div className="text-[13px] text-[#767692] mb-1">
              {t("student.gradebook.gradesReceived")}
            </div>
            <div className="text-[24px] font-semibold text-[#21214f]">
              {stats.published} / {stats.total}
            </div>
          </div>
        </div>

        <GradeTable
          grades={filteredGrades}
          statusLabels={statusLabels}
          statusColors={statusColors}
          onRowClick={handleRowClick}
        />

        {/* Info Card */}
        <div className="mt-6 bg-[#f0f4ff] border-2 border-[#d2e1f8] rounded-[16px] p-5">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-[#3d6bc6] rounded-full flex items-center justify-center shrink-0">
              <span className="text-white text-[14px] font-semibold">i</span>
            </div>
            <div>
              <h4 className="text-[15px] font-medium text-[#21214f] mb-1">
                {t("student.gradebook.about")}
              </h4>
              <p className="text-[14px] text-[#767692] leading-[1.6]">
                {t("student.gradebook.aboutDesc")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
