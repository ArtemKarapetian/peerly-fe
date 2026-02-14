import { useState, useCallback } from "react";
import { AppShell } from "@/app/components/AppShell";
import { CourseCard } from "@/app/components/CourseCard";
import { LayoutDebugger } from "@/app/components/LayoutDebugger";
import { AdvancedPagination } from "@/app/components/ui/advanced-pagination";
import { usePagination } from "@/app/components/ui/simple-pagination";
import { CourseFilters, CourseFilterType } from "@/app/components/CourseFilters";
import { CourseSearch } from "@/app/components/CourseSearch";

/**
 * CoursesListPage - Список всех курсов
 */

interface Course {
  id: string;
  title: string;
  teacher: string;
  coverColor: string;
  status?: "active" | "completed"; // добавим статус для фильтрации
}

// Моковые данные курсов
const mockCourses: Course[] = [
  {
    id: "2",
    title: "Введение в программирование",
    teacher: "Иванов И.И.",
    coverColor: "#b0e9fb",
    status: "active",
  },
  {
    id: "3",
    title: "Веб-разработка",
    teacher: "Петров П.П.",
    coverColor: "#b7bdff",
    status: "active",
  },
  {
    id: "4",
    title: "Дизайн интерфейсов",
    teacher: "Сидорова С.С.",
    coverColor: "#9cf38d",
    status: "completed",
  },
  {
    id: "5",
    title: "Мобильная разработка",
    teacher: "Козлов К.К.",
    coverColor: "#ffb8b8",
    status: "active",
  },
  {
    id: "6",
    title: "Алгоритмы и структуры данных",
    teacher: "Алексеев А.А.",
    coverColor: "#ffd4a3",
    status: "active",
  },
  {
    id: "7",
    title: "Базы данных",
    teacher: "Михайлов М.М.",
    coverColor: "#d4b8ff",
    status: "completed",
  },
  {
    id: "8",
    title: "Машинное обучение",
    teacher: "Николаева Н.Н.",
    coverColor: "#b8ffd4",
    status: "active",
  },
  {
    id: "9",
    title: "Компьютерные сети",
    teacher: "Сергеев С.С.",
    coverColor: "#ffc9e8",
    status: "active",
  },
  {
    id: "10",
    title: "Операционные системы",
    teacher: "Васильева В.В.",
    coverColor: "#c9e8ff",
    status: "completed",
  },
  {
    id: "11",
    title: "Тестирование ПО",
    teacher: "Григорьев Г.Г.",
    coverColor: "#e8c9ff",
    status: "active",
  },
  {
    id: "12",
    title: "Архитектура ПО",
    teacher: "Дмитриев Д.Д.",
    coverColor: "#b7bdff",
    status: "active",
  },
  {
    id: "13",
    title: "Параллельное программирование",
    teacher: "Федорова Ф.Ф.",
    coverColor: "#9cf38d",
    status: "completed",
  },
  {
    id: "14",
    title: "Информационная безопасность",
    teacher: "Егоров Е.Е.",
    coverColor: "#ffb8b8",
    status: "active",
  },
  {
    id: "15",
    title: "Компьютерная графика",
    teacher: "Романова Р.Р.",
    coverColor: "#ffd4a3",
    status: "active",
  },
];

export default function CoursesListPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<CourseFilterType>("all");

  // Фильтрация курсов
  const filteredCourses = mockCourses.filter((course) => {
    // Поиск
    if (
      searchQuery &&
      !course.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !course.teacher.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // Фильтр по статусу
    if (activeFilter === "active" && course.status !== "active") {
      return false;
    }
    if (activeFilter === "completed" && course.status !== "completed") {
      return false;
    }

    return true;
  });

  const { currentPage, totalPages, currentItems, setCurrentPage } = usePagination(
    filteredCourses,
    9,
  );

  const handleCourseClick = useCallback((courseId: string) => {
    // Навигация на страницу курса
    window.location.hash = `/course/${courseId}`;
  }, []);

  return (
    <AppShell title="Курсы">
      {/* Page Title */}
      <h1 className="page-title mb-6">Курсы</h1>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <CourseSearch value={searchQuery} onChange={setSearchQuery} />
        <CourseFilters activeFilter={activeFilter} onFilterChange={setActiveFilter} />
      </div>

      {/* Results count */}
      <div className="mb-4 text-[14px] text-[#767692]">
        Найдено курсов: {filteredCourses.length}
      </div>

      {/* Courses Grid */}
      {currentItems.length > 0 ? (
        <div className="courses-grid">
          {currentItems.map((course) => (
            <CourseCard
              key={course.id}
              id={course.id}
              title={course.title}
              teacher={course.teacher}
              coverColor={course.coverColor}
              onClick={() => handleCourseClick(course.id)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-[14px] text-[#767692]">Курсы не найдены</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <AdvancedPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          className="mt-8"
        />
      )}

      {/* Layout Debugger */}
      <LayoutDebugger />
    </AppShell>
  );
}
