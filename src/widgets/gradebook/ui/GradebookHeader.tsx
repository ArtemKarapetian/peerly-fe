import { Filter, ChevronDown, TrendingUp } from "lucide-react";
import { useState } from "react";

import { PageHeader } from "@/shared/ui/PageHeader";

interface GradebookStats {
  total: number;
  published: number;
  avgPercentage: string;
}

interface CourseOption {
  id: string;
  name: string;
}

interface GradebookHeaderProps {
  stats: GradebookStats;
  courses: CourseOption[];
  selectedCourse: string;
  selectedStatus: string;
  statusLabels: Record<string, string>;
  onCourseChange: (courseId: string) => void;
  onStatusChange: (status: string) => void;
  onReset: () => void;
}

export function GradebookHeader({
  stats,
  courses,
  selectedCourse,
  selectedStatus,
  statusLabels,
  onCourseChange,
  onStatusChange,
  onReset,
}: GradebookHeaderProps) {
  const [showCourseFilter, setShowCourseFilter] = useState(false);
  const [showStatusFilter, setShowStatusFilter] = useState(false);

  return (
    <>
      <PageHeader title="Журнал оценок" subtitle="Ваши результаты и оценки по всем курсам" />

      {/* Desktop stats strip */}
      <div className="hidden desktop:flex items-center gap-6 bg-[#f9f9f9] rounded-[16px] px-6 py-4 mb-6">
        <div className="flex items-center gap-3">
          <TrendingUp className="w-5 h-5 text-[#3d6bc6]" />
          <div>
            <div className="text-[13px] text-[#767692] mb-1">Средний балл</div>
            <div className="text-[20px] font-semibold text-[#21214f]">{stats.avgPercentage}%</div>
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

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
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
                  onCourseChange("all");
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
                    onCourseChange(course.id);
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
            <span>{selectedStatus === "all" ? "Все статусы" : statusLabels[selectedStatus]}</span>
            <ChevronDown className="w-4 h-4 text-[#767692]" />
          </button>

          {showStatusFilter && (
            <div className="absolute top-full left-0 mt-2 w-[220px] bg-white border-2 border-[#e6e8ee] rounded-[12px] shadow-lg z-10 overflow-hidden">
              <button
                onClick={() => {
                  onStatusChange("all");
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
                    onStatusChange(key);
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

        {(selectedCourse !== "all" || selectedStatus !== "all") && (
          <button onClick={onReset} className="text-[14px] text-[#3d6bc6] hover:underline">
            Сбросить
          </button>
        )}
      </div>
    </>
  );
}
