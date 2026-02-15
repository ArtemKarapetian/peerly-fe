import { useState, useMemo, useCallback } from "react";
import { AppShell } from "@/widgets/app-shell/AppShell.tsx";
import { BookOpen, Filter, Lock, ChevronDown, TrendingUp } from "lucide-react";

interface GradeEntry {
  id: string;
  courseId: string;
  courseName: string;
  taskId: string;
  taskTitle: string;
  status: "PUBLISHED" | "IN_REVIEW" | "PENDING" | "NOT_SUBMITTED";
  score: number | null;
  maxScore: number;
  isScoreLocked: boolean; // Scores hidden until instructor publishes
  updatedAt: string;
}

// Mock data for student gradebook
const mockGrades: GradeEntry[] = [
  {
    id: "1",
    courseId: "1",
    courseName: "Веб-разработка",
    taskId: "1",
    taskTitle: "Задание 1: Landing Page",
    status: "PUBLISHED",
    score: 85,
    maxScore: 100,
    isScoreLocked: false,
    updatedAt: "2025-01-20T14:30:00",
  },
  {
    id: "2",
    courseId: "1",
    courseName: "Веб-разработка",
    taskId: "2",
    taskTitle: "Задание 2: React компоненты",
    status: "IN_REVIEW",
    score: null,
    maxScore: 100,
    isScoreLocked: true,
    updatedAt: "2025-01-22T10:15:00",
  },
  {
    id: "3",
    courseId: "1",
    courseName: "Веб-разработка",
    taskId: "4",
    taskTitle: "Задание 4: TypeScript проект",
    status: "PUBLISHED",
    score: 92,
    maxScore: 100,
    isScoreLocked: false,
    updatedAt: "2025-01-23T16:45:00",
  },
  {
    id: "4",
    courseId: "2",
    courseName: "UI/UX Дизайн",
    taskId: "3",
    taskTitle: "Задание 3: Прототипирование",
    status: "PENDING",
    score: null,
    maxScore: 100,
    isScoreLocked: true,
    updatedAt: "2025-01-18T09:00:00",
  },
  {
    id: "5",
    courseId: "2",
    courseName: "UI/UX Дизайн",
    taskId: "5",
    taskTitle: "Задание 5: Вайрфреймы",
    status: "PUBLISHED",
    score: 78,
    maxScore: 100,
    isScoreLocked: false,
    updatedAt: "2025-01-21T11:20:00",
  },
  {
    id: "6",
    courseId: "1",
    courseName: "Веб-разработка",
    taskId: "6",
    taskTitle: "Задание 6: Backend API",
    status: "NOT_SUBMITTED",
    score: null,
    maxScore: 100,
    isScoreLocked: false,
    updatedAt: "2025-01-15T08:00:00",
  },
  {
    id: "7",
    courseId: "3",
    courseName: "Алгоритмы и структуры данных",
    taskId: "7",
    taskTitle: "Задание 1: Сортировка",
    status: "PUBLISHED",
    score: 95,
    maxScore: 100,
    isScoreLocked: false,
    updatedAt: "2025-01-19T13:00:00",
  },
  {
    id: "8",
    courseId: "3",
    courseName: "Алгоритмы и структуры данных",
    taskId: "8",
    taskTitle: "Задание 2: Графы",
    status: "PUBLISHED",
    score: 88,
    maxScore: 100,
    isScoreLocked: false,
    updatedAt: "2025-01-22T15:30:00",
  },
];

const statusLabels: Record<string, string> = {
  PUBLISHED: "Опубликовано",
  IN_REVIEW: "На проверке",
  PENDING: "Ожидание",
  NOT_SUBMITTED: "Не сдано",
};

const statusColors: Record<string, string> = {
  PUBLISHED: "bg-[#e8f5e9] text-[#2e7d32]",
  IN_REVIEW: "bg-[#fff3e0] text-[#e65100]",
  PENDING: "bg-[#f3f4f6] text-[#6b7280]",
  NOT_SUBMITTED: "bg-[#ffebee] text-[#c62828]",
};

export default function GradebookPage() {
  const [selectedCourse, setSelectedCourse] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [showCourseFilter, setShowCourseFilter] = useState(false);
  const [showStatusFilter, setShowStatusFilter] = useState(false);

  // Get unique courses for filter
  const courses = useMemo(() => {
    const uniqueCourses = Array.from(
      new Set(mockGrades.map((g) => JSON.stringify({ id: g.courseId, name: g.courseName }))),
    ).map((str) => JSON.parse(str));
    return uniqueCourses;
  }, []);

  // Filter grades
  const filteredGrades = useMemo(() => {
    return mockGrades.filter((grade) => {
      const courseMatch = selectedCourse === "all" || grade.courseId === selectedCourse;
      const statusMatch = selectedStatus === "all" || grade.status === selectedStatus;
      return courseMatch && statusMatch;
    });
  }, [selectedCourse, selectedStatus]);

  // Calculate overall stats
  const stats = useMemo(() => {
    const publishedGrades = filteredGrades.filter(
      (g) => g.status === "PUBLISHED" && g.score !== null,
    );
    const totalScore = publishedGrades.reduce((sum, g) => sum + (g.score || 0), 0);
    const totalMax = publishedGrades.reduce((sum, g) => sum + g.maxScore, 0);
    const avgPercentage = totalMax > 0 ? (totalScore / totalMax) * 100 : 0;

    return {
      total: filteredGrades.length,
      published: publishedGrades.length,
      avgPercentage: avgPercentage.toFixed(1),
    };
  }, [filteredGrades]);

  const handleRowClick = useCallback((grade: GradeEntry) => {
    // Navigate to task details
    window.location.hash = `/task/${grade.taskId}`;
  }, []);

  const getScoreColor = (score: number, max: number) => {
    const percentage = (score / max) * 100;
    if (percentage >= 90) return "text-[#2e7d32]";
    if (percentage >= 75) return "text-[#558b2f]";
    if (percentage >= 60) return "text-[#f57c00]";
    return "text-[#c62828]";
  };

  return (
    <AppShell>
      {/* Header */}
      <div className="bg-white border-b-2 border-[#e6e8ee] -mx-6 tablet:-mx-6 desktop:-mx-10 px-4 tablet:px-6 desktop:px-8 py-6 desktop:py-8 mb-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h1 className="text-[32px] font-medium text-[#21214f] tracking-[-0.5px] mb-2">
                Журнал оценок
              </h1>
              <p className="text-[15px] text-[#767692] leading-[1.5]">
                Ваши результаты и оценки по всем курсам
              </p>
            </div>

            {/* Stats Card */}
            <div className="hidden desktop:flex items-center gap-6 bg-[#f9f9f9] rounded-[16px] px-6 py-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-[#3d6bc6]" />
                <div>
                  <div className="text-[13px] text-[#767692] mb-1">Средний балл</div>
                  <div className="text-[20px] font-semibold text-[#21214f]">
                    {stats.avgPercentage}%
                  </div>
                </div>
              </div>
              <div className="w-px h-12 bg-[#e6e8ee]"></div>
              <div>
                <div className="text-[13px] text-[#767692] mb-1">Оценок получено</div>
                <div className="text-[20px] font-semibold text-[#21214f]">
                  {stats.published} / {stats.total}
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-[14px] text-[#767692]">
              <Filter className="w-4 h-4" />
              <span className="hidden tablet:inline">Фильтры:</span>
            </div>

            {/* Course Filter */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowCourseFilter(!showCourseFilter);
                  setShowStatusFilter(false);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-[#e6e8ee] rounded-[8px] text-[14px] text-[#21214f] hover:border-[#a0b8f1] transition-colors"
              >
                <span>
                  {selectedCourse === "all"
                    ? "Все курсы"
                    : courses.find((c) => c.id === selectedCourse)?.name}
                </span>
                <ChevronDown className="w-4 h-4 text-[#767692]" />
              </button>

              {showCourseFilter && (
                <div className="absolute top-full left-0 mt-2 w-[280px] bg-white border-2 border-[#e6e8ee] rounded-[12px] shadow-lg z-10 overflow-hidden">
                  <button
                    onClick={() => {
                      setSelectedCourse("all");
                      setShowCourseFilter(false);
                    }}
                    className={`w-full text-left px-4 py-3 text-[14px] hover:bg-[#f9f9f9] transition-colors ${
                      selectedCourse === "all"
                        ? "bg-[#f0f4ff] text-[#3d6bc6] font-medium"
                        : "text-[#21214f]"
                    }`}
                  >
                    Все курсы
                  </button>
                  {courses.map((course) => (
                    <button
                      key={course.id}
                      onClick={() => {
                        setSelectedCourse(course.id);
                        setShowCourseFilter(false);
                      }}
                      className={`w-full text-left px-4 py-3 text-[14px] hover:bg-[#f9f9f9] transition-colors ${
                        selectedCourse === course.id
                          ? "bg-[#f0f4ff] text-[#3d6bc6] font-medium"
                          : "text-[#21214f]"
                      }`}
                    >
                      {course.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Status Filter */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowStatusFilter(!showStatusFilter);
                  setShowCourseFilter(false);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-[#e6e8ee] rounded-[8px] text-[14px] text-[#21214f] hover:border-[#a0b8f1] transition-colors"
              >
                <span>
                  {selectedStatus === "all" ? "Все статусы" : statusLabels[selectedStatus]}
                </span>
                <ChevronDown className="w-4 h-4 text-[#767692]" />
              </button>

              {showStatusFilter && (
                <div className="absolute top-full left-0 mt-2 w-[220px] bg-white border-2 border-[#e6e8ee] rounded-[12px] shadow-lg z-10 overflow-hidden">
                  <button
                    onClick={() => {
                      setSelectedStatus("all");
                      setShowStatusFilter(false);
                    }}
                    className={`w-full text-left px-4 py-3 text-[14px] hover:bg-[#f9f9f9] transition-colors ${
                      selectedStatus === "all"
                        ? "bg-[#f0f4ff] text-[#3d6bc6] font-medium"
                        : "text-[#21214f]"
                    }`}
                  >
                    Все статусы
                  </button>
                  {Object.entries(statusLabels).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => {
                        setSelectedStatus(key);
                        setShowStatusFilter(false);
                      }}
                      className={`w-full text-left px-4 py-3 text-[14px] hover:bg-[#f9f9f9] transition-colors ${
                        selectedStatus === key
                          ? "bg-[#f0f4ff] text-[#3d6bc6] font-medium"
                          : "text-[#21214f]"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Clear Filters */}
            {(selectedCourse !== "all" || selectedStatus !== "all") && (
              <button
                onClick={() => {
                  setSelectedCourse("all");
                  setSelectedStatus("all");
                }}
                className="text-[14px] text-[#3d6bc6] hover:underline"
              >
                Сбросить
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1400px] mx-auto px-4 tablet:px-6 desktop:px-8 py-6 desktop:py-8">
        {/* Mobile Stats (shown on mobile only) */}
        <div className="desktop:hidden mb-6 grid grid-cols-2 gap-4">
          <div className="bg-white border-2 border-[#e6e8ee] rounded-[12px] p-4">
            <div className="text-[13px] text-[#767692] mb-1">Средний балл</div>
            <div className="text-[24px] font-semibold text-[#21214f]">{stats.avgPercentage}%</div>
          </div>
          <div className="bg-white border-2 border-[#e6e8ee] rounded-[12px] p-4">
            <div className="text-[13px] text-[#767692] mb-1">Оценок получено</div>
            <div className="text-[24px] font-semibold text-[#21214f]">
              {stats.published} / {stats.total}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border-2 border-[#e6e8ee] rounded-[20px] overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden tablet:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#f9f9f9] border-b-2 border-[#e6e8ee]">
                  <th className="text-left px-4 desktop:px-6 py-4 text-[13px] font-medium text-[#767692] uppercase tracking-wide">
                    Курс
                  </th>
                  <th className="text-left px-4 desktop:px-6 py-4 text-[13px] font-medium text-[#767692] uppercase tracking-wide">
                    Задание
                  </th>
                  <th className="text-left px-4 desktop:px-6 py-4 text-[13px] font-medium text-[#767692] uppercase tracking-wide">
                    Статус
                  </th>
                  <th className="text-right px-4 desktop:px-6 py-4 text-[13px] font-medium text-[#767692] uppercase tracking-wide">
                    Оценка
                  </th>
                  <th className="text-right px-4 desktop:px-6 py-4 text-[13px] font-medium text-[#767692] uppercase tracking-wide">
                    Макс
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredGrades.map((grade) => (
                  <tr
                    key={grade.id}
                    onClick={() => handleRowClick(grade)}
                    className="border-b border-[#e6e8ee] hover:bg-[#fafbfc] cursor-pointer transition-colors group"
                  >
                    <td className="px-4 desktop:px-6 py-4">
                      <div className="text-[14px] text-[#21214f] font-medium group-hover:text-[#3d6bc6] transition-colors">
                        {grade.courseName}
                      </div>
                    </td>
                    <td className="px-4 desktop:px-6 py-4">
                      <div className="text-[14px] text-[#21214f]">{grade.taskTitle}</div>
                    </td>
                    <td className="px-4 desktop:px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-[6px] text-[13px] font-medium ${
                          statusColors[grade.status]
                        }`}
                      >
                        {statusLabels[grade.status]}
                      </span>
                    </td>
                    <td className="px-4 desktop:px-6 py-4 text-right">
                      {grade.isScoreLocked ? (
                        <div className="inline-flex items-center gap-2 group/lock relative">
                          <Lock className="w-4 h-4 text-[#767692]" />
                          <span className="text-[14px] text-[#767692]">—</span>
                          {/* Tooltip */}
                          <div className="absolute right-0 bottom-full mb-2 hidden group-hover/lock:block w-[240px] bg-[#21214f] text-white text-[13px] rounded-[8px] px-3 py-2 shadow-lg z-10">
                            Оценки будут доступны после публикации преподавателем
                            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[#21214f]"></div>
                          </div>
                        </div>
                      ) : grade.score !== null ? (
                        <span
                          className={`text-[16px] font-semibold ${getScoreColor(grade.score, grade.maxScore)}`}
                        >
                          {grade.score}
                        </span>
                      ) : (
                        <span className="text-[14px] text-[#767692]">—</span>
                      )}
                    </td>
                    <td className="px-4 desktop:px-6 py-4 text-right">
                      <span className="text-[14px] text-[#767692]">{grade.maxScore}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="tablet:hidden divide-y-2 divide-[#e6e8ee]">
            {filteredGrades.map((grade) => (
              <div
                key={grade.id}
                onClick={() => handleRowClick(grade)}
                className="p-3 hover:bg-[#fafbfc] cursor-pointer transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="text-[13px] text-[#767692] mb-1">{grade.courseName}</div>
                    <div className="text-[15px] text-[#21214f] font-medium">{grade.taskTitle}</div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="flex items-center gap-1.5">
                      {grade.isScoreLocked ? (
                        <>
                          <Lock className="w-3.5 h-3.5 text-[#767692]" />
                          <span className="text-[14px] text-[#767692]">—</span>
                        </>
                      ) : grade.score !== null ? (
                        <span
                          className={`text-[16px] font-semibold ${getScoreColor(grade.score, grade.maxScore)}`}
                        >
                          {grade.score} / {grade.maxScore}
                        </span>
                      ) : (
                        <span className="text-[14px] text-[#767692]">— / {grade.maxScore}</span>
                      )}
                    </div>
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-[6px] text-[12px] font-medium ${
                        statusColors[grade.status]
                      }`}
                    >
                      {statusLabels[grade.status]}
                    </span>
                  </div>
                </div>

                {grade.isScoreLocked && (
                  <div className="mt-2 flex items-start gap-2 text-[12px] text-[#767692] bg-[#f9f9f9] rounded-[8px] p-2.5">
                    <Lock className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span>Оценки будут доступны после публикации преподавателем</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredGrades.length === 0 && (
            <div className="py-16 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#f9f9f9] rounded-full mb-4">
                <BookOpen className="w-8 h-8 text-[#767692]" />
              </div>
              <h3 className="text-[18px] font-medium text-[#21214f] mb-2">Оценок не найдено</h3>
              <p className="text-[14px] text-[#767692]">
                Попробуйте изменить фильтры или выберите другой курс
              </p>
            </div>
          )}
        </div>

        {/* Info Card */}
        <div className="mt-6 bg-[#f0f4ff] border-2 border-[#d2e1f8] rounded-[16px] p-5">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-[#3d6bc6] rounded-full flex items-center justify-center shrink-0">
              <span className="text-white text-[14px] font-semibold">i</span>
            </div>
            <div>
              <h4 className="text-[15px] font-medium text-[#21214f] mb-1">О журнале оценок</h4>
              <p className="text-[14px] text-[#767692] leading-[1.6]">
                Здесь отображаются ваши оценки по всем заданиям. Некоторые оценки могут быть скрыты
                до тех пор, пока преподаватель не опубликует результаты. Нажмите на строку, чтобы
                перейти к деталям задания.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
