import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { coverColorFor } from "@/shared/lib/coverColor";
import { AdvancedPagination } from "@/shared/ui/advanced-pagination";
import { ErrorBanner } from "@/shared/ui/ErrorBanner";
import { PageHeader } from "@/shared/ui/PageHeader";
import { PageSkeleton } from "@/shared/ui/PageSkeleton";
import { usePagination } from "@/shared/ui/simple-pagination";

import { CourseCard, useCourses } from "@/entities/course";
import type { Course } from "@/entities/course";

import { AppShell } from "@/widgets/app-shell";
import { CourseFilterBar } from "@/widgets/course-filter-bar";

interface CourseListItem {
  id: string;
  title: string;
  teacher: string;
  coverColor: string;
  status: "active" | "completed";
}

function toListItem(c: Course): CourseListItem {
  return {
    id: c.id,
    title: c.name,
    teacher: c.teachers.map((t) => t.name).join(", "),
    coverColor: coverColorFor(c.id),
    status: c.status === "archived" ? "completed" : "active",
  };
}

function useCoursesPageSize(): number {
  const compute = () => {
    if (typeof window === "undefined") return 12;
    if (window.innerWidth >= 1200) return 12;
    if (window.innerWidth >= 800) return 8;
    return 6;
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
  const { data, isLoading, error, refetch } = useCourses();

  const items = useMemo(() => (data ?? []).map(toListItem), [data]);

  const handleCourseClick = useCallback(
    (courseId: string) => {
      void navigate(`/student/courses/${courseId}`);
    },
    [navigate],
  );

  return (
    <AppShell title={t("student.courses.title")}>
      <PageHeader title={t("student.courses.title")} subtitle={t("student.courses.subtitle")} />

      {isLoading ? (
        <PageSkeleton />
      ) : error ? (
        <ErrorBanner error={error} onRetry={() => void refetch()} />
      ) : (
        <CourseFilterBar courses={items}>
          {(filteredCourses) => (
            <CourseListContent courses={filteredCourses} onCourseClick={handleCourseClick} />
          )}
        </CourseFilterBar>
      )}
    </AppShell>
  );
}

function CourseListContent({
  courses,
  onCourseClick,
}: {
  courses: CourseListItem[];
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
        <p className="mb-3 text-xs text-[--text-tertiary]">
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
          <p className="text-sm font-medium text-[--text-primary] mb-1">
            {t("student.courses.notFound")}
          </p>
          <p className="text-13 text-[--text-secondary]">
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
