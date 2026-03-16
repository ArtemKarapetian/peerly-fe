import { BookOpen, ChevronRight, ClipboardList, Plus, Users } from "lucide-react";
import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";

import { useAsync } from "@/shared/lib/useAsync";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs.tsx";
import { ErrorBanner } from "@/shared/ui/ErrorBanner";
import { PageSkeleton } from "@/shared/ui/PageSkeleton";
import { SimplePagination, usePagination } from "@/shared/ui/simple-pagination";

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
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: courses, isLoading, error, refetch } = useAsync(() => courseRepo.getAll(), []);

  const allCourseRows: CourseRow[] = (courses ?? []).map((course) => ({
    id: course.id,
    name: course.title,
    code: course.code,
    term: t("teacher.courses.springTerm"),
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
    window.location.hash = `/teacher/courses/${courseId}`;
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
      <AppShell title={t("teacher.courses.management")}>
        <PageSkeleton />
      </AppShell>
    );
  if (error)
    return (
      <AppShell title={t("teacher.courses.management")}>
        <ErrorBanner message={error.message} onRetry={refetch} />
      </AppShell>
    );

  return (
    <AppShell title={t("teacher.courses.management")}>
      <Breadcrumbs items={[{ label: t("teacher.courses.title") }]} />

      <div className="mt-6">
        {/* Hero header card */}
        <div className="bg-white border-2 border-[#e6e8ee] rounded-[20px] p-6 mb-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-[32px] font-medium text-[#21214f] tracking-[-0.5px] mb-1">
                {t("teacher.courses.title")}
              </h1>
              <p className="text-[15px] text-[#767692]">
                {activeCourses.length > 0
                  ? `${activeCourses.length} ${t("teacher.courses.activeCourses")}, ${allCourseRows.length - activeCourses.length > 0 ? `${allCourseRows.length - activeCourses.length} ${t("teacher.courses.inArchive")}` : t("teacher.courses.allActive")}`
                  : t("teacher.courses.createFirst")}
              </p>
            </div>
            <div className="flex items-center gap-5 shrink-0">
              {/* Inline stats — mirroring course detail page counters */}
              <div className="hidden tablet:flex items-center gap-5">
                <div className="text-center">
                  <p className="text-[24px] font-medium text-[#21214f] tabular-nums leading-none mb-1">
                    {totalStudents}
                  </p>
                  <p className="text-[13px] text-[#767692]">{t("teacher.courses.studentsLabel")}</p>
                </div>
                <div className="w-px h-10 bg-[#e6e8ee]"></div>
                <div className="text-center">
                  <p className="text-[24px] font-medium text-[#21214f] tabular-nums leading-none mb-1">
                    {totalAssignments}
                  </p>
                  <p className="text-[13px] text-[#767692]">
                    {t("teacher.courses.assignmentsLabel")}
                  </p>
                </div>
                <div className="w-px h-10 bg-[#e6e8ee]"></div>
              </div>
              <button
                onClick={() => (window.location.hash = "/teacher/course/create")}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#2563eb] text-white rounded-[10px] hover:bg-[#1d4ed8] active:bg-[#1e40af] transition-colors shadow-[0_2px_8px_rgba(37,99,235,0.25)] text-[14px] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2563eb]"
              >
                <Plus className="w-4 h-4" />
                {t("teacher.courses.createCourse")}
              </button>
            </div>
          </div>

          {/* Mobile stats strip — visible below tablet */}
          <div className="flex tablet:hidden gap-3 mt-4 pt-4 border-t-2 border-[#e6e8ee]">
            <div className="flex-1 flex items-center gap-2.5 px-3 py-2 bg-[#f7f9ff] rounded-[10px]">
              <div className="w-7 h-7 bg-[#2563eb1a] rounded-[6px] flex items-center justify-center shrink-0">
                <BookOpen className="w-3.5 h-3.5 text-[#2563eb]" />
              </div>
              <div>
                <p className="text-[15px] font-semibold text-[#21214f] leading-none">
                  {activeCourses.length}
                </p>
                <p className="text-[10px] text-[#767692] mt-0.5">
                  {t("teacher.courses.coursesCount")}
                </p>
              </div>
            </div>
            <div className="flex-1 flex items-center gap-2.5 px-3 py-2 bg-[#f0fdf4] rounded-[10px]">
              <div className="w-7 h-7 bg-[#0596691a] rounded-[6px] flex items-center justify-center shrink-0">
                <Users className="w-3.5 h-3.5 text-[#059669]" />
              </div>
              <div>
                <p className="text-[15px] font-semibold text-[#21214f] leading-none">
                  {totalStudents}
                </p>
                <p className="text-[10px] text-[#767692] mt-0.5">
                  {t("teacher.courses.studentsLabel")}
                </p>
              </div>
            </div>
            <div className="flex-1 flex items-center gap-2.5 px-3 py-2 bg-[#fffbeb] rounded-[10px]">
              <div className="w-7 h-7 bg-[#d977061a] rounded-[6px] flex items-center justify-center shrink-0">
                <ClipboardList className="w-3.5 h-3.5 text-[#d97706]" />
              </div>
              <div>
                <p className="text-[15px] font-semibold text-[#21214f] leading-none">
                  {totalAssignments}
                </p>
                <p className="text-[10px] text-[#767692] mt-0.5">
                  {t("teacher.courses.assignmentsLabel")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search + count */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1">
            <CourseSearch
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder={t("teacher.courses.searchPlaceholder")}
            />
          </div>
          {filteredCourses.length > 0 && (
            <p className="text-[12px] text-[#767692] tabular-nums shrink-0 hidden tablet:block">
              {filteredCourses.length} {t("teacher.courses.coursesCount")}
            </p>
          )}
        </div>

        {/* Table or empty state */}
        {filteredCourses.length > 0 ? (
          <>
            <div className="bg-white border-2 border-[#e6e8ee] rounded-[20px] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full table-fixed">
                  <colgroup>
                    <col /> {/* Курс — остаток */}
                    <col className="w-[120px] hidden tablet:table-column" /> {/* Семестр */}
                    <col className="w-[100px] hidden tablet:table-column" /> {/* Студенты */}
                    <col className="w-[100px] hidden tablet:table-column" /> {/* Задания */}
                    <col className="w-[105px]" /> {/* Статус */}
                    <col className="w-[48px]" /> {/* Chevron */}
                  </colgroup>
                  <thead>
                    <tr className="border-b-2 border-[#e6e8ee] bg-[#fafbfc]">
                      <th className="text-left px-5 py-3 text-[11px] font-semibold text-[#767692] uppercase tracking-[0.5px]">
                        {t("common.course")}
                      </th>
                      <th className="text-left px-5 py-3 text-[11px] font-semibold text-[#767692] uppercase tracking-[0.5px] hidden tablet:table-cell">
                        {t("common.semester")}
                      </th>
                      <th className="text-center px-5 py-3 text-[11px] font-semibold text-[#767692] uppercase tracking-[0.5px] hidden tablet:table-cell">
                        {t("common.students")}
                      </th>
                      <th className="text-center px-5 py-3 text-[11px] font-semibold text-[#767692] uppercase tracking-[0.5px] hidden tablet:table-cell">
                        {t("common.assignments")}
                      </th>
                      <th className="text-left px-5 py-3 text-[11px] font-semibold text-[#767692] uppercase tracking-[0.5px]">
                        {t("common.status")}
                      </th>
                      <th className="py-3 w-[48px]" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e6e8ee]">
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
                          aria-label={t("teacher.courses.openCourse", { name: course.name })}
                        >
                          {/* Course name + code */}
                          <td className="px-5 py-4">
                            <p className="text-[14px] font-semibold text-[#21214f] tracking-[-0.2px] leading-snug">
                              {course.name}
                            </p>
                            <p className="text-[12px] text-[#767692] mt-0.5 font-mono">
                              {course.code}
                            </p>
                          </td>

                          {/* Semester */}
                          <td className="px-5 py-4 hidden tablet:table-cell">
                            <p className="text-[13px] text-[#767692]">{course.term}</p>
                          </td>

                          {/* Students */}
                          <td className="px-5 py-4 text-center hidden tablet:table-cell">
                            <span className="inline-flex items-center justify-center min-w-[32px] px-2.5 py-1 bg-[#eff6ff] text-[#2563eb] rounded-[8px] text-[13px] font-semibold tabular-nums">
                              {course.participantsCount}
                            </span>
                          </td>

                          {/* Assignments */}
                          <td className="px-5 py-4 text-center hidden tablet:table-cell">
                            <span className="inline-flex items-center justify-center min-w-[32px] px-2.5 py-1 bg-[#f0fdf4] text-[#059669] rounded-[8px] text-[13px] font-semibold tabular-nums">
                              {course.activeAssignments}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="px-5 py-4">
                            {course.status === "active" ? (
                              <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#e8f5e9] text-[#4caf50] rounded-[8px] text-[12px] font-medium">
                                {t("common.active")}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#f5f5f5] text-[#767692] rounded-[8px] text-[12px] font-medium">
                                {t("common.archive")}
                              </span>
                            )}
                          </td>

                          {/* Row-navigation affordance */}
                          <td className="pr-4 py-4 w-[48px]">
                            <ChevronRight
                              aria-hidden="true"
                              className="w-4 h-4 text-[#767692] opacity-20 group-hover:opacity-50 transition-opacity duration-150 ml-auto"
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
          <div className="bg-white border-2 border-[#e6e8ee] rounded-[20px] p-12 text-center">
            <div className="w-12 h-12 bg-[#f7f9ff] rounded-[12px] flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-6 h-6 text-[#767692]" />
            </div>
            <h3 className="text-[17px] font-medium text-[#21214f] mb-2">
              {searchQuery ? t("teacher.courses.noCoursesSearch") : t("teacher.courses.noCourses")}
            </h3>
            <p className="text-[14px] text-[#767692] mb-6">
              {searchQuery
                ? t("teacher.courses.tryChangingSearch")
                : t("teacher.courses.createFirst")}
            </p>
            {!searchQuery && (
              <button
                onClick={() => (window.location.hash = "/teacher/course/create")}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#2563eb] text-white rounded-[10px] hover:bg-[#1d4ed8] transition-colors shadow-[0_2px_8px_rgba(37,99,235,0.2)] text-[14px] font-medium"
              >
                <Plus className="w-4 h-4" />
                {t("teacher.courses.createCourse")}
              </button>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}
