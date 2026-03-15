import { useCallback } from "react";

import { AdvancedPagination } from "@/shared/ui/advanced-pagination";
import { PageHeader } from "@/shared/ui/PageHeader";
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
      <PageHeader title="Курсы" subtitle="Ваши учебные курсы на текущий семестр" />

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
  const { currentPage, totalPages, currentItems, setCurrentPage } = usePagination(courses, 9);

  return (
    <>
      {courses.length > 0 && (
        <p className="mb-3 text-[12px] text-[--text-tertiary]">Найдено: {courses.length}</p>
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
              semester={course.semester}
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
          <p className="text-[14px] font-medium text-[--text-primary] mb-1">Курсы не найдены</p>
          <p className="text-[13px] text-[--text-secondary]">
            Попробуйте изменить параметры поиска
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
