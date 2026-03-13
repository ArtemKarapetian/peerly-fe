import { Archive, BookOpen, ChevronRight, Plus, Users } from "lucide-react";
import { useState, useCallback } from "react";

import { CRUMBS } from "@/shared/config/breadcrumbs.ts";
import { useAsync } from "@/shared/lib/useAsync";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs.tsx";
import { ErrorBanner } from "@/shared/ui/ErrorBanner";
import { PageSkeleton } from "@/shared/ui/PageSkeleton";
import { SimplePagination, usePagination } from "@/shared/ui/simple-pagination";
import { StatCard } from "@/shared/ui/StatCard";

import { courseRepo } from "@/entities/course";

import { CourseSearch } from "@/features/course/search";

import { AppShell } from "@/widgets/app-shell/AppShell.tsx";

interface CourseRow {
  id: string;
  name: string;
  code: string;
  term: string;
  participantsCount: number;
  activeAssignments: number;
  status: "active" | "archived";
}

export default function TeacherCoursesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: courses, isLoading, error, refetch } = useAsync(() => courseRepo.getAll(), []);

  const allCourseRows: CourseRow[] = (courses ?? []).map((course) => ({
    id: course.id,
    name: course.title,
    code: course.code,
    term: "Весна 2025",
    participantsCount: course.enrollmentCount,
    activeAssignments: course.assignmentIds?.length || 0,
    status: course.archived ? "archived" : "active",
  }));

  const filteredCourses = allCourseRows.filter((course) => {
    if (course.status === "archived") return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return course.name.toLowerCase().includes(q) || course.code.toLowerCase().includes(q);
    }
    return true;
  });

  const activeCourses = allCourseRows.filter((c) => c.status === "active");
  const totalStudents = activeCourses.reduce((sum, c) => sum + c.participantsCount, 0);
  const totalAssignments = activeCourses.reduce((sum, c) => sum + c.activeAssignments, 0);

  const handleOpenCourse = useCallback((courseId: string) => {
    window.location.hash = `/teacher/course/${courseId}`;
  }, []);

  const handleRowKeyDown = (e: React.KeyboardEvent, courseId: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleOpenCourse(courseId);
    }
  };

  const { currentPage, totalPages, handlePageChange } = usePagination(filteredCourses, 10);

  if (isLoading)
    return (
      <AppShell title="Управление курсами">
        <PageSkeleton />
      </AppShell>
    );
  if (error)
    return (
      <AppShell title="Управление курсами">
        <ErrorBanner message={error.message} onRetry={refetch} />
      </AppShell>
    );

  return (
    <AppShell title="Управление курсами">
      <Breadcrumbs items={[CRUMBS.teacherDashboard, { label: "Курсы" }]} />

      <div className="mt-6">
        {/* Header: title + primary CTA */}
        <div className="flex items-center justify-between gap-4 mb-5">
          <div>
            <h1 className="page-title mb-1">Управление курсами</h1>
            <p className="text-[14px] text-[--text-secondary]">Ваши курсы, студенты и задания</p>
          </div>
          <button
            onClick={() => (window.location.hash = "/teacher/course/create")}
            style={{ backgroundColor: "#2563eb" }}
            className="flex items-center gap-2 px-4 py-2.5 text-white rounded-[var(--radius-md)] hover:opacity-90 active:opacity-80 transition-opacity shadow-[0_2px_8px_rgba(37,99,235,0.25)] text-[14px] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2563eb] shrink-0"
          >
            <Plus className="w-4 h-4" />
            Создать курс
          </button>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 gap-2.5 tablet:grid-cols-4 mb-5">
          <StatCard
            label="Активных курсов"
            value={activeCourses.length}
            icon={<BookOpen className="w-4 h-4" />}
            accent="#2563eb"
          />
          <StatCard
            label="Всего студентов"
            value={totalStudents}
            icon={<Users className="w-4 h-4" />}
            accent="#059669"
          />
          <StatCard
            label="Активных заданий"
            value={totalAssignments}
            icon={<BookOpen className="w-4 h-4" />}
            accent="#d97706"
          />
          <StatCard
            label="Всего курсов"
            value={allCourseRows.length}
            icon={<Archive className="w-4 h-4" />}
            accent="#7c3aed"
          />
        </div>

        {/* Search toolbar */}
        <div className="mb-4">
          <CourseSearch
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Поиск по названию или коду курса..."
          />
        </div>

        {/* Table or empty state */}
        {filteredCourses.length > 0 ? (
          <>
            <p className="text-[12px] text-[--text-tertiary] mb-2">
              Курсов: {filteredCourses.length}
            </p>

            <div className="bg-white border border-[--surface-border] rounded-[var(--radius-xl)] overflow-hidden shadow-[var(--shadow-sm)]">
              <div className="overflow-x-auto">
                <table className="w-full table-fixed">
                  <colgroup>
                    <col /> {/* Курс — занимает остаток */}
                    <col className="w-[130px] hidden tablet:table-column" /> {/* Семестр */}
                    <col className="w-[100px] hidden tablet:table-column" /> {/* Студенты */}
                    <col className="w-[100px] hidden tablet:table-column" /> {/* Задания */}
                    <col className="w-[110px]" /> {/* Статус */}
                    <col className="w-[56px]" /> {/* Chevron */}
                  </colgroup>
                  <thead>
                    <tr className="border-b border-[--surface-border] bg-[--surface-hover]">
                      <th className="text-left px-5 py-3 text-[11px] font-medium text-[--text-tertiary] uppercase tracking-wide">
                        Курс
                      </th>
                      <th className="text-left px-5 py-3 text-[11px] font-medium text-[--text-tertiary] uppercase tracking-wide hidden tablet:table-cell">
                        Семестр
                      </th>
                      <th className="text-center px-5 py-3 text-[11px] font-medium text-[--text-tertiary] uppercase tracking-wide hidden tablet:table-cell">
                        Студенты
                      </th>
                      <th className="text-center px-5 py-3 text-[11px] font-medium text-[--text-tertiary] uppercase tracking-wide hidden tablet:table-cell">
                        Задания
                      </th>
                      <th className="text-left px-5 py-3 text-[11px] font-medium text-[--text-tertiary] uppercase tracking-wide">
                        Статус
                      </th>
                      <th className="pl-3 pr-4 py-3" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[--surface-border]">
                    {filteredCourses
                      .slice((currentPage - 1) * 10, currentPage * 10)
                      .map((course) => (
                        <tr
                          key={course.id}
                          className="hover:bg-[#f7f9ff] transition-colors duration-150 cursor-pointer group"
                          onClick={() => handleOpenCourse(course.id)}
                          onKeyDown={(e) => handleRowKeyDown(e, course.id)}
                          role="button"
                          tabIndex={0}
                          aria-label={`Открыть курс ${course.name}`}
                        >
                          {/* Course name + code */}
                          <td className="px-5 py-3.5">
                            <p className="text-[14px] font-semibold text-[--text-primary] tracking-[-0.2px] leading-snug">
                              {course.name}
                            </p>
                            <p className="text-[11px] text-[--text-tertiary] mt-0.5 font-mono">
                              {course.code}
                            </p>
                          </td>

                          {/* Semester */}
                          <td className="px-5 py-3.5 hidden tablet:table-cell">
                            <p className="text-[13px] text-[--text-secondary]">{course.term}</p>
                          </td>

                          {/* Students */}
                          <td className="px-5 py-3.5 text-center hidden tablet:table-cell">
                            <span className="inline-flex items-center justify-center min-w-[32px] px-2 py-0.5 bg-[#eff6ff] text-[--brand-primary] rounded-[var(--radius-sm)] text-[13px] font-semibold tabular-nums">
                              {course.participantsCount}
                            </span>
                          </td>

                          {/* Assignments */}
                          <td className="px-5 py-3.5 text-center hidden tablet:table-cell">
                            <span className="inline-flex items-center justify-center min-w-[32px] px-2 py-0.5 bg-[--success-light] text-[--success] rounded-[var(--radius-sm)] text-[13px] font-semibold tabular-nums">
                              {course.activeAssignments}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="px-5 py-3.5">
                            {course.status === "active" ? (
                              <span className="badge badge-success">Активен</span>
                            ) : (
                              <span className="badge badge-neutral">Архив</span>
                            )}
                          </td>

                          {/* Row-navigation affordance */}
                          <td className="pl-3 pr-4 py-3.5 w-10">
                            <ChevronRight
                              aria-hidden="true"
                              className="w-4 h-4 text-[--text-tertiary] opacity-25 group-hover:opacity-60 transition-opacity duration-150 ml-auto"
                            />
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            {totalPages > 1 && (
              <div className="mt-4">
                <SimplePagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        ) : (
          <div className="bg-white border border-[--surface-border] rounded-[var(--radius-xl)] p-12 text-center shadow-[var(--shadow-sm)]">
            <div className="w-12 h-12 bg-[--surface-hover] rounded-[var(--radius-lg)] flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-6 h-6 text-[--text-tertiary]" />
            </div>
            <h3 className="text-[17px] font-semibold text-[--text-primary] mb-2">Нет курсов</h3>
            <p className="text-[14px] text-[--text-secondary] mb-6">
              Создайте первый курс, чтобы начать работу
            </p>
            <button
              onClick={() => (window.location.hash = "/teacher/course/create")}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[--brand-primary] text-white rounded-[var(--radius-md)] hover:bg-[--brand-primary-hover] transition-colors shadow-[0_2px_8px_rgba(37,99,235,0.2)] text-[14px] font-medium"
            >
              <Plus className="w-4 h-4" />
              Создать курс
            </button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
