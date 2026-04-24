import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { AdvancedPagination } from "@/shared/ui/advanced-pagination";
import { PageHeader } from "@/shared/ui/PageHeader";
import { usePagination } from "@/shared/ui/simple-pagination";

import { CourseCard } from "@/entities/course";

import { AppShell } from "@/widgets/app-shell/AppShell.tsx";
import { CourseFilterBar } from "@/widgets/course-filter-bar";

import { mockCourses } from "../model/mockCourses";

// Keeps page size aligned with .courses-grid column count so completed pages
// never end with a half-empty row. Breakpoints mirror src/shared/styles/courses.css.
function useCoursesPageSize(): number {
  const compute = () => {
    if (typeof window === "undefined") return 12;
    if (window.innerWidth >= 1200) return 12; // 4 cols × 3 rows
    if (window.innerWidth >= 800) return 8; // 2 cols × 4 rows
    return 6; // 1 col × 6 rows
  };
  const [pageSize, setPageSize] = useState(compute);

  useEffect(() => {
    const onResize = () => setPageSize(compute());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return pageSize;
}

export default function CoursesListPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const handleCourseClick = useCallback(
    (courseId: string) => {
      void navigate(`/courses/${courseId}`);
    },
    [navigate],
  );

  return (
    <AppShell title={t("student.courses.title")}>
      <PageHeader title={t("student.courses.title")} subtitle={t("student.courses.subtitle")} />

      <CourseFilterBar courses={mockCourses}>
        {(filteredCourses) => (
          <CourseListContent courses={filteredCourses} onCourseClick={handleCourseClick} />
        )}
      </CourseFilterBar>
    </AppShell>
  );
}

function CourseListContent({
  courses,
  onCourseClick,
}: {
  courses: typeof mockCourses;
  onCourseClick: (id: string) => void;
}) {
  const { t } = useTranslation();
  const pageSize = useCoursesPageSize();
  const { currentPage, totalPages, currentItems, setCurrentPage } = usePagination(
    courses,
    pageSize,
  );

  return (
    <>
      {courses.length > 0 && (
        <p className="mb-3 text-[12px] text-[--text-tertiary]">
          {t("common.found")}: {courses.length}
        </p>
      )}

      {currentItems.length > 0 ? (
        <div className="courses-grid">
          {currentItems.map((course) => (
            <CourseCard
              key={course.id}
              id={course.id}
              title={course.title}
              teacher={course.teacher}
              coverColor={course.coverColor}
              deadline={course.deadline}
              progress={course.progress}
              newAssignments={course.newAssignments}
              status={course.status}
              onClick={() => onCourseClick(course.id)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-12 h-12 bg-[--surface-hover] rounded-[var(--radius-lg)] flex items-center justify-center mb-3">
            <span className="text-[22px]">📚</span>
          </div>
          <p className="text-[14px] font-medium text-[--text-primary] mb-1">
            {t("student.courses.notFound")}
          </p>
          <p className="text-[13px] text-[--text-secondary]">
            {t("student.courses.tryChangingSearch")}
          </p>
        </div>
      )}

      {totalPages > 1 && (
        <AdvancedPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          className="mt-8"
        />
      )}
    </>
  );
}
