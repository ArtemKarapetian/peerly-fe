import { useState, useCallback } from "react";
import { AppShell } from "@/app/components/AppShell";
import { Breadcrumbs } from "@/app/components/Breadcrumbs";
import { ROUTES } from "@/shared/config/routes.ts";
import { Book, Archive, Plus, ArchiveRestore } from "lucide-react";
import { demoDataStore } from "@/app/stores/demoDataStore";
import { SimplePagination, usePagination } from "@/shared/ui/simple-pagination";
import { CourseSearch } from "@/app/components/CourseSearch";

/**
 * TeacherCoursesPage - Управление курсами (Teacher)
 *
 * Административный вид списка курсов для преподавателя
 * - Таблица/сетка с информацией о курсах
 * - Действия: Открыть, Настройки, Участники, Архивировать
 * - Переключатель "Показать архивные" курсы
 * - Поиск по названию и коду курса
 */

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
  const [showArchived, setShowArchived] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Load demo courses
  const courses = demoDataStore.getCourses();

  const courseRows: CourseRow[] = courses.map((course) => ({
    id: course.id,
    name: course.title,
    code: course.code,
    term: "Весна 2025",
    participantsCount: course.enrollmentCount,
    activeAssignments: course.assignmentIds?.length || 0,
    status: course.archived ? "archived" : "active",
  }));

  // Filter courses based on archived status and search
  const filteredCourses = courseRows.filter((course) => {
    // Filter by archived status
    if (!showArchived && course.status === "archived") {
      return false;
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return course.name.toLowerCase().includes(query) || course.code.toLowerCase().includes(query);
    }

    return true;
  });

  const handleOpenCourse = useCallback((courseId: string) => {
    window.location.hash = `/teacher/course/${courseId}`;
  }, []);

  const handleArchive = (courseId: string) => {
    if (confirm("Архивировать этот курс? Он будет скрыт из основного списка.")) {
      demoDataStore.archiveCourse(courseId, true);
      window.location.reload(); // Reload to show updated state
    }
  };

  const handleUnarchive = (courseId: string) => {
    if (confirm("Восстановить курс из архива?")) {
      demoDataStore.archiveCourse(courseId, false);
      window.location.reload();
    }
  };

  const handleRowClick = (courseId: string) => {
    handleOpenCourse(courseId);
  };

  const handleRowKeyDown = (e: React.KeyboardEvent, courseId: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleOpenCourse(courseId);
    }
  };

  const { currentPage, totalPages, handlePageChange } = usePagination(filteredCourses, 10);

  return (
    <AppShell title="Упрвление курсами">
      <Breadcrumbs
        items={[
          { label: "Дашборд преподавателя", href: ROUTES.teacherDashboard },
          { label: "Курсы" },
        ]}
      />

      <div className="mt-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="page-title mb-2">Управление курсами</h1>
            <p className="text-base text-[--text-secondary]">Ваши курсы, студенты и задания</p>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showArchived}
                onChange={(e) => setShowArchived(e.target.checked)}
                className="w-4 h-4 rounded border-[--surface-border] text-[--brand-primary] focus:ring-2 focus:ring-[--brand-primary]/30"
              />
              <Archive className="w-4 h-4 text-[--text-secondary]" />
              <span className="text-sm text-[--text-primary]">Показать архивные</span>
            </label>
            <button
              onClick={() => (window.location.hash = "/teacher/course/create")}
              className="flex items-center gap-2 px-4 py-2 bg-[--brand-primary] text-white rounded-[var(--radius-md)] hover:bg-[--brand-primary-hover] transition-colors"
            >
              <Plus className="w-5 h-5" />
              Создать курс
            </button>
          </div>
        </div>

        {/* Search and Stats */}
        <div className="mb-6 space-y-4">
          <CourseSearch
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Поиск по названию или коду курса..."
          />
          <div className="text-[14px] text-[#767692]">Найдено курсов: {filteredCourses.length}</div>
        </div>

        {/* Courses Table */}
        <div className="bg-white border-2 border-[#e6e8ee] rounded-[20px] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-[#e6e8ee]">
                  <th className="text-left px-6 py-4 text-[13px] font-medium text-[#767692] uppercase tracking-wide">
                    Курс
                  </th>
                  <th className="text-left px-6 py-4 text-[13px] font-medium text-[#767692] uppercase tracking-wide">
                    Семестр
                  </th>
                  <th className="text-center px-6 py-4 text-[13px] font-medium text-[#767692] uppercase tracking-wide">
                    Участники
                  </th>
                  <th className="text-center px-6 py-4 text-[13px] font-medium text-[#767692] uppercase tracking-wide">
                    Задания
                  </th>
                  <th className="text-left px-6 py-4 text-[13px] font-medium text-[#767692] uppercase tracking-wide">
                    Статус
                  </th>
                  <th className="text-right px-6 py-4 text-[13px] font-medium text-[#767692] uppercase tracking-wide">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredCourses
                  .slice((currentPage - 1) * 10, currentPage * 10)
                  .map((course, index) => (
                    <tr
                      key={course.id}
                      className={`
                      border-b border-[#e6e8ee] last:border-0 
                      hover:bg-[#f0f6ff] transition-all duration-200 cursor-pointer
                      shadow-[0_1px_3px_rgba(0,0,0,0.02)]
                      hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)]
                      ${index % 2 === 0 ? "bg-white" : "bg-[#fafbfc]"}
                    `}
                      onClick={() => handleRowClick(course.id)}
                      onKeyDown={(e) => handleRowKeyDown(e, course.id)}
                      role="button"
                      tabIndex={0}
                      aria-label={`Открыть курс ${course.name}`}
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-[16px] font-medium text-[#21214f] tracking-[-0.3px]">
                            {course.name}
                          </p>
                          <p className="text-[13px] text-[#767692] mt-1">{course.code}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-[15px] text-[#21214f]">{course.term}</p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center justify-center min-w-[40px] px-3 py-1 bg-[#e9f5ff] text-[#2563eb] rounded-[8px] text-[14px] font-medium">
                          {course.participantsCount}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center justify-center min-w-[40px] px-3 py-1 bg-[#e8f5e9] text-[#4caf50] rounded-[8px] text-[14px] font-medium">
                          {course.activeAssignments}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {course.status === "active" ? (
                          <span className="inline-flex px-3 py-1 bg-[#e8f5e9] text-[#4caf50] rounded-[8px] text-[13px] font-medium">
                            Активен
                          </span>
                        ) : (
                          <span className="inline-flex px-3 py-1 bg-[#f5f5f5] text-[#767692] rounded-[8px] text-[13px] font-medium">
                            Архив
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {course.status === "active" ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleArchive(course.id);
                              }}
                              className="p-2 hover:bg-white rounded-[var(--radius-sm)] transition-colors"
                              title="Архивировать"
                            >
                              <Archive className="w-4 h-4 text-[--text-secondary]" />
                            </button>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUnarchive(course.id);
                              }}
                              className="p-2 hover:bg-white rounded-[var(--radius-sm)] transition-colors"
                              title="Восстановить"
                            >
                              <ArchiveRestore className="w-4 h-4 text-[--text-secondary]" />
                            </button>
                          )}
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
              onPageChange={handlePageChange}
            />
          </div>
        )}

        {/* Empty state if no courses */}
        {filteredCourses.length === 0 && (
          <div className="bg-white border-2 border-[#e6e8ee] rounded-[20px] p-12 text-center">
            <div className="w-16 h-16 bg-[#f9f9f9] rounded-[16px] flex items-center justify-center mx-auto mb-4">
              <Book className="w-8 h-8 text-[#767692]" />
            </div>
            <h3 className="text-[20px] font-medium text-[#21214f] mb-2">Нет курсов</h3>
            <p className="text-[15px] text-[#767692] mb-6">
              Создайте первый курс, чтобы начать работу
            </p>
            <button className="px-4 py-2 bg-[#2563eb] text-white rounded-[12px] hover:bg-[#1d4ed8] transition-all duration-200 shadow-[0_2px_8px_rgba(37,99,235,0.3)] hover:shadow-[0_4px_12px_rgba(37,99,235,0.4)]">
              Создать курс
            </button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
