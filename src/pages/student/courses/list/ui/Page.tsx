import { useCallback } from "react";

import { AdvancedPagination } from "@/shared/ui/advanced-pagination";
import { LayoutDebugger } from "@/shared/ui/LayoutDebugger";
import { usePagination } from "@/shared/ui/simple-pagination";

import { CourseCard } from "@/entities/course";

import { AppShell } from "@/widgets/app-shell/AppShell.tsx";
import { CourseFilterBar } from "@/widgets/course-filter-bar";

import { mockCourses } from "../model/mockCourses";

export default function CoursesListPage() {
  const handleCourseClick = useCallback((courseId: string) => {
    window.location.hash = `/course/${courseId}`;
  }, []);

  return (
    <AppShell title="Курсы">
      <h1 className="page-title mb-6">Курсы</h1>

      <CourseFilterBar courses={mockCourses}>
        {(filteredCourses) => (
          <CourseListContent courses={filteredCourses} onCourseClick={handleCourseClick} />
        )}
      </CourseFilterBar>

      <LayoutDebugger />
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
  const { currentPage, totalPages, currentItems, setCurrentPage } = usePagination(courses, 9);

  return (
    <>
      <div className="mb-4 text-[14px] text-[#767692]">Найдено курсов: {courses.length}</div>

      {currentItems.length > 0 ? (
        <div className="courses-grid">
          {currentItems.map((course) => (
            <CourseCard
              key={course.id}
              id={course.id}
              title={course.title}
              teacher={course.teacher}
              coverColor={course.coverColor}
              onClick={() => onCourseClick(course.id)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-[14px] text-[#767692]">Курсы не найдены</p>
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
