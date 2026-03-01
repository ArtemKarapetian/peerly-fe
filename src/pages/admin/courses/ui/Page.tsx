import { Book, ExternalLink, Search } from "lucide-react";
import { useState } from "react";

import { SimplePagination, usePagination } from "@/shared/ui/simple-pagination";

import { courseRepo } from "@/entities/course";

import { AppShell } from "@/widgets/app-shell/AppShell.tsx";

/**
 * AdminCoursesPage - Просмотр всех курсов в системе (Admin)
 */

export default function AdminCoursesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const courses = courseRepo.getAll();

  // Filter courses by search
  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.code.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const { currentPage, totalPages, currentItems, setCurrentPage } = usePagination(
    filteredCourses,
    15,
  );

  return (
    <AppShell title="Все курсы">
      <div className="mb-6">
        <h1 className="text-[32px] font-medium text-[#21214f] tracking-[-0.5px] mb-2">Все курсы</h1>
        <p className="text-[--text-secondary]">Просмотр всех курсов в системе</p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[--text-tertiary]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск по названию или коду..."
            className="w-full pl-10 pr-4 py-2.5 border border-[--surface-border] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[--brand-primary]/30 focus:border-[--brand-primary]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-[--surface] border border-[--surface-border] rounded-[var(--radius-lg)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[--surface-border] bg-[--surface-hover]">
                <th className="text-left px-6 py-3 text-xs font-medium text-[--text-secondary] uppercase">
                  Курс
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-[--text-secondary] uppercase">
                  Преподаватель
                </th>
                <th className="text-center px-6 py-3 text-xs font-medium text-[--text-secondary] uppercase">
                  Студентов
                </th>
                <th className="text-center px-6 py-3 text-xs font-medium text-[--text-secondary] uppercase">
                  Заданий
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-[--text-secondary] uppercase">
                  Статус
                </th>
                <th className="text-right px-6 py-3 text-xs font-medium text-[--text-secondary] uppercase">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((course, index) => (
                <tr
                  key={course.id}
                  className={`border-b border-[--surface-border] last:border-0 hover:bg-[--surface-hover] transition-colors ${
                    index % 2 === 0 ? "" : "bg-[--surface-hover]/50"
                  }`}
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-[--text-primary]">{course.title}</p>
                      <p className="text-xs text-[--text-secondary] mt-0.5">{course.code}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-[--text-primary]">
                      {course.teacherId === "teacher-1" ? "Иванов И.И." : "Преподаватель"}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center justify-center min-w-[40px] px-2.5 py-1 bg-[#e3f2fd] text-[#1976d2] rounded-md text-xs font-medium">
                      {course.enrollmentCount}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center justify-center min-w-[40px] px-2.5 py-1 bg-[#e8f5e9] text-[#388e3c] rounded-md text-xs font-medium">
                      {course.assignmentIds?.length || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {course.archived ? (
                      <span className="inline-flex px-2.5 py-1 bg-[#f5f5f5] text-[--text-secondary] rounded-md text-xs font-medium">
                        Архив
                      </span>
                    ) : (
                      <span className="inline-flex px-2.5 py-1 bg-[#e8f5e9] text-[#388e3c] rounded-md text-xs font-medium">
                        Активен
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end">
                      <button
                        onClick={() => (window.location.hash = `/teacher/course/${course.id}`)}
                        className="p-2 hover:bg-[--surface-hover] rounded-[var(--radius-sm)] transition-colors"
                        title="Открыть курс"
                      >
                        <ExternalLink className="w-4 h-4 text-[--text-secondary]" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6">
          <SimplePagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Empty state */}
      {filteredCourses.length === 0 && (
        <div className="bg-[--surface] border border-[--surface-border] rounded-[var(--radius-lg)] p-12 text-center">
          <Book className="w-12 h-12 text-[--text-tertiary] mx-auto mb-4" />
          <h3 className="text-lg font-medium text-[--text-primary] mb-2">Курсы не найдены</h3>
          <p className="text-sm text-[--text-secondary]">
            {searchQuery ? "Попробуйте изменить поисковый запрос" : "В системе пока нет курсов"}
          </p>
        </div>
      )}
    </AppShell>
  );
}
