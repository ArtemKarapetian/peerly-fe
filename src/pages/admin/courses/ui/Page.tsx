import { BookOpen, ChevronRight, GraduationCap, Users } from "lucide-react";
import { useState, useCallback } from "react";

import { useAsync } from "@/shared/lib/useAsync";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs.tsx";
import { ErrorBanner } from "@/shared/ui/ErrorBanner";
import { PageSkeleton } from "@/shared/ui/PageSkeleton";
import { SimplePagination, usePagination } from "@/shared/ui/simple-pagination";
import { StatCard } from "@/shared/ui/StatCard";

import { courseRepo } from "@/entities/course";

import { CourseSearch } from "@/features/course/search";

import { AppShell } from "@/widgets/app-shell/AppShell.tsx";

/** Имя преподавателя по teacherId (мок) */
function resolveTeacher(teacherId: string): string {
  const map: Record<string, string> = {
    u2: "Иванов И.И.",
    "teacher-1": "Петров П.П.",
  };
  return map[teacherId] ?? "Преподаватель";
}

export default function AdminCoursesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: courses, isLoading, error, refetch } = useAsync(() => courseRepo.getAll(), []);

  const allCourses = courses ?? [];

  const filteredCourses = allCourses.filter((course) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return course.title.toLowerCase().includes(q) || course.code.toLowerCase().includes(q);
  });

  // Stats over ALL courses (admin sees everything)
  const activeCourses = allCourses.filter((c) => !c.archived && c.status === "active");
  const totalStudents = allCourses.reduce((sum, c) => sum + c.enrollmentCount, 0);
  const uniqueTeachers = new Set(allCourses.map((c) => c.teacherId)).size;

  const handleOpenCourse = useCallback((courseId: string) => {
    window.location.hash = `/teacher/course/${courseId}`;
  }, []);

  const handleRowKeyDown = (e: React.KeyboardEvent, courseId: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleOpenCourse(courseId);
    }
  };

  const { currentPage, totalPages, currentItems, setCurrentPage } = usePagination(
    filteredCourses,
    15,
  );

  if (isLoading)
    return (
      <AppShell title="Все курсы">
        <PageSkeleton />
      </AppShell>
    );
  if (error)
    return (
      <AppShell title="Все курсы">
        <ErrorBanner message={error.message} onRetry={refetch} />
      </AppShell>
    );

  return (
    <AppShell title="Все курсы">
      <Breadcrumbs items={[{ label: "Курсы" }]} />

      <div className="mt-6">
        {/* Header — без CTA, у администратора нет создания курсов */}
        <div className="mb-5">
          <h1 className="page-title mb-1">Все курсы</h1>
          <p className="text-[14px] text-[--text-secondary]">Все курсы системы, включая архивные</p>
        </div>

        {/* Stat cards — admin-специфичные метрики */}
        <div className="grid grid-cols-2 gap-2.5 tablet:grid-cols-4 mb-5">
          <StatCard
            label="Всего курсов"
            value={allCourses.length}
            icon={<BookOpen className="w-4 h-4" />}
            accent="#2563eb"
          />
          <StatCard
            label="Активных"
            value={activeCourses.length}
            icon={<BookOpen className="w-4 h-4" />}
            accent="#059669"
          />
          <StatCard
            label="Студентов записано"
            value={totalStudents}
            icon={<Users className="w-4 h-4" />}
            accent="#d97706"
          />
          <StatCard
            label="Преподавателей"
            value={uniqueTeachers}
            icon={<GraduationCap className="w-4 h-4" />}
            accent="#7c3aed"
          />
        </div>

        {/* Search */}
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
                    <col /> {/* Курс — остаток */}
                    <col className="w-[160px] hidden tablet:table-column" /> {/* Преподаватель */}
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
                        Преподаватель
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
                    {currentItems.map((course) => (
                      <tr
                        key={course.id}
                        className="hover:bg-[#f7f9ff] transition-colors duration-150 cursor-pointer group"
                        onClick={() => handleOpenCourse(course.id)}
                        onKeyDown={(e) => handleRowKeyDown(e, course.id)}
                        role="button"
                        tabIndex={0}
                        aria-label={`Открыть курс ${course.title}`}
                      >
                        {/* Курс */}
                        <td className="px-5 py-3.5">
                          <p className="text-[14px] font-semibold text-[--text-primary] tracking-[-0.2px] leading-snug truncate">
                            {course.title}
                          </p>
                          <p className="text-[11px] text-[--text-tertiary] mt-0.5 font-mono">
                            {course.code}
                          </p>
                        </td>

                        {/* Преподаватель — admin-специфичная колонка */}
                        <td className="px-5 py-3.5 hidden tablet:table-cell">
                          <p className="text-[13px] text-[--text-secondary] truncate">
                            {resolveTeacher(course.teacherId)}
                          </p>
                        </td>

                        {/* Студенты */}
                        <td className="px-5 py-3.5 text-center hidden tablet:table-cell">
                          <span className="inline-flex items-center justify-center min-w-[32px] px-2 py-0.5 bg-[#eff6ff] text-[--brand-primary] rounded-[var(--radius-sm)] text-[13px] font-semibold tabular-nums">
                            {course.enrollmentCount}
                          </span>
                        </td>

                        {/* Задания */}
                        <td className="px-5 py-3.5 text-center hidden tablet:table-cell">
                          <span className="inline-flex items-center justify-center min-w-[32px] px-2 py-0.5 bg-[--success-light] text-[--success] rounded-[var(--radius-sm)] text-[13px] font-semibold tabular-nums">
                            {course.assignmentIds?.length ?? 0}
                          </span>
                        </td>

                        {/* Статус — архивные тоже видны (admin sees all) */}
                        <td className="px-5 py-3.5">
                          {course.archived || course.status === "archived" ? (
                            <span className="badge badge-neutral">Архив</span>
                          ) : (
                            <span className="badge badge-success">Активен</span>
                          )}
                        </td>

                        {/* Row-navigation affordance */}
                        <td className="pl-3 pr-4 py-3.5">
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
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </>
        ) : (
          <div className="bg-white border border-[--surface-border] rounded-[var(--radius-xl)] p-12 text-center shadow-[var(--shadow-sm)]">
            <div className="w-12 h-12 bg-[--surface-hover] rounded-[var(--radius-lg)] flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-6 h-6 text-[--text-tertiary]" />
            </div>
            <h3 className="text-[17px] font-semibold text-[--text-primary] mb-2">
              Курсы не найдены
            </h3>
            <p className="text-[14px] text-[--text-secondary]">
              {searchQuery ? "Попробуйте изменить поисковый запрос" : "В системе пока нет курсов"}
            </p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
