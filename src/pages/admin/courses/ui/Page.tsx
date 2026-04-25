import { BookOpen, ChevronRight, GraduationCap, Users } from "lucide-react";
import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { useAsync } from "@/shared/lib/useAsync";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs.tsx";
import { ErrorBanner } from "@/shared/ui/ErrorBanner";
import { PageHeader } from "@/shared/ui/PageHeader";
import { PageSkeleton } from "@/shared/ui/PageSkeleton";
import { SimplePagination, usePagination } from "@/shared/ui/simple-pagination";
import { StatCard } from "@/shared/ui/StatCard";

import { courseRepo } from "@/entities/course";

import { CourseSearch } from "@/features/course/search";

import { AppShell } from "@/widgets/app-shell/AppShell.tsx";

// мок-резолв ФИО преподавателя по id, пока нет users-репо
function resolveTeacher(teacherId: string): string {
  const map: Record<string, string> = {
    u2: "Иванов И.И.",
    "teacher-1": "Петров П.П.",
  };
  return map[teacherId] ?? teacherId;
}

export default function AdminCoursesPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: courses,
    isLoading,
    error,
    refetch,
  } = useAsync(() => courseRepo.getAll(), [], {
    onError: "redirect",
  });

  const allCourses = courses ?? [];

  const filteredCourses = allCourses.filter((course) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return course.title.toLowerCase().includes(q) || course.code.toLowerCase().includes(q);
  });

  // у админа в счётчиках учитываются и архивные курсы тоже
  const activeCourses = allCourses.filter((c) => !c.archived && c.status === "active");
  const totalStudents = allCourses.reduce((sum, c) => sum + c.enrollmentCount, 0);
  const uniqueTeachers = new Set(allCourses.map((c) => c.teacherId)).size;

  const handleOpenCourse = useCallback(
    (courseId: string) => {
      void navigate(`/teacher/courses/${courseId}`);
    },
    [navigate],
  );

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
      <AppShell title={t("admin.courses.title")}>
        <PageSkeleton />
      </AppShell>
    );
  if (error)
    return (
      <AppShell title={t("admin.courses.title")}>
        <ErrorBanner message={error.message} onRetry={refetch} />
      </AppShell>
    );

  return (
    <AppShell title={t("admin.courses.title")}>
      <Breadcrumbs items={[{ label: t("nav.courses") }]} />

      <PageHeader title={t("admin.courses.title")} subtitle={t("admin.courses.subtitle")} />

      <div>
        <div className="grid grid-cols-2 gap-2.5 tablet:grid-cols-4 mb-5">
          <StatCard
            label={t("admin.coursesPage.totalCourses")}
            value={allCourses.length}
            icon={<BookOpen className="w-4 h-4" />}
            accent="var(--brand-primary)"
          />
          <StatCard
            label={t("admin.coursesPage.activeCourses")}
            value={activeCourses.length}
            icon={<BookOpen className="w-4 h-4" />}
            accent="var(--success)"
          />
          <StatCard
            label={t("admin.coursesPage.enrolledStudents")}
            value={totalStudents}
            icon={<Users className="w-4 h-4" />}
            accent="var(--warning)"
          />
          <StatCard
            label={t("admin.coursesPage.teachers")}
            value={uniqueTeachers}
            icon={<GraduationCap className="w-4 h-4" />}
            accent="var(--chart-4)"
          />
        </div>

        <div className="mb-4">
          <CourseSearch
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder={t("admin.coursesPage.searchPlaceholder")}
          />
        </div>

        {filteredCourses.length > 0 ? (
          <>
            <p className="text-[12px] text-[--text-tertiary] mb-2">
              {t("admin.coursesPage.coursesCount", { count: filteredCourses.length })}
            </p>

            <div className="bg-card border border-[--surface-border] rounded-[var(--radius-xl)] overflow-hidden shadow-[var(--shadow-sm)]">
              <div className="overflow-x-auto">
                <table className="w-full table-fixed">
                  <colgroup>
                    <col />
                    <col className="w-[160px] hidden tablet:table-column" />
                    <col className="w-[100px] hidden tablet:table-column" />
                    <col className="w-[100px] hidden tablet:table-column" />
                    <col className="w-[110px]" />
                    <col className="w-[56px]" />
                  </colgroup>
                  <thead>
                    <tr className="border-b border-[--surface-border] bg-[--surface-hover]">
                      <th className="text-left px-5 py-3 text-[11px] font-medium text-[--text-tertiary] uppercase tracking-wide">
                        {t("admin.coursesPage.headerCourse")}
                      </th>
                      <th className="text-left px-5 py-3 text-[11px] font-medium text-[--text-tertiary] uppercase tracking-wide hidden tablet:table-cell">
                        {t("admin.coursesPage.headerTeacher")}
                      </th>
                      <th className="text-center px-5 py-3 text-[11px] font-medium text-[--text-tertiary] uppercase tracking-wide hidden tablet:table-cell">
                        {t("admin.coursesPage.headerStudents")}
                      </th>
                      <th className="text-center px-5 py-3 text-[11px] font-medium text-[--text-tertiary] uppercase tracking-wide hidden tablet:table-cell">
                        {t("admin.coursesPage.headerAssignments")}
                      </th>
                      <th className="text-left px-5 py-3 text-[11px] font-medium text-[--text-tertiary] uppercase tracking-wide">
                        {t("admin.coursesPage.headerStatus")}
                      </th>
                      <th className="pl-3 pr-4 py-3" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[--surface-border]">
                    {currentItems.map((course) => (
                      <tr
                        key={course.id}
                        className="hover:bg-brand-primary-lighter transition-colors duration-150 cursor-pointer group"
                        onClick={() => handleOpenCourse(course.id)}
                        onKeyDown={(e) => handleRowKeyDown(e, course.id)}
                        role="button"
                        tabIndex={0}
                        aria-label={t("admin.coursesPage.openCourseLabel", { title: course.title })}
                      >
                        <td className="px-5 py-3.5">
                          <p className="text-[14px] font-semibold text-[--text-primary] tracking-[-0.2px] leading-snug truncate">
                            {course.title}
                          </p>
                          <p className="text-[11px] text-[--text-tertiary] mt-0.5 font-mono">
                            {course.code}
                          </p>
                        </td>

                        {/* колонка только для админа */}
                        <td className="px-5 py-3.5 hidden tablet:table-cell">
                          <p className="text-[13px] text-[--text-secondary] truncate">
                            {resolveTeacher(course.teacherId)}
                          </p>
                        </td>

                        <td className="px-5 py-3.5 text-center hidden tablet:table-cell">
                          <span className="inline-flex items-center justify-center min-w-[32px] px-2 py-0.5 bg-info-light text-[--brand-primary] rounded-[var(--radius-sm)] text-[13px] font-semibold tabular-nums">
                            {course.enrollmentCount}
                          </span>
                        </td>

                        <td className="px-5 py-3.5 text-center hidden tablet:table-cell">
                          <span className="inline-flex items-center justify-center min-w-[32px] px-2 py-0.5 bg-[--success-light] text-[--success] rounded-[var(--radius-sm)] text-[13px] font-semibold tabular-nums">
                            {course.assignmentIds?.length ?? 0}
                          </span>
                        </td>

                        {/* у админа архивные курсы тоже отображаются */}
                        <td className="px-5 py-3.5">
                          {course.archived || course.status === "archived" ? (
                            <span className="badge badge-neutral">
                              {t("admin.coursesPage.statusArchived")}
                            </span>
                          ) : (
                            <span className="badge badge-success">
                              {t("admin.coursesPage.statusActive")}
                            </span>
                          )}
                        </td>

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
          <div className="bg-card border border-[--surface-border] rounded-[var(--radius-xl)] p-12 text-center shadow-[var(--shadow-sm)]">
            <div className="w-12 h-12 bg-[--surface-hover] rounded-[var(--radius-lg)] flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-6 h-6 text-[--text-tertiary]" />
            </div>
            <h3 className="text-[17px] font-semibold text-[--text-primary] mb-2">
              {t("admin.coursesPage.notFound")}
            </h3>
            <p className="text-[14px] text-[--text-secondary]">
              {searchQuery
                ? t("admin.coursesPage.notFoundWithSearch")
                : t("admin.coursesPage.notFoundEmpty")}
            </p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
