import { Filter, ChevronDown, TrendingUp } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  const [showCourseFilter, setShowCourseFilter] = useState(false);
  const [showStatusFilter, setShowStatusFilter] = useState(false);

  return (
    <>
      <PageHeader title={t("student.gradebook.title")} subtitle={t("student.gradebook.subtitle")} />

      {/* Desktop stats strip */}
      <div className="hidden desktop:flex items-center gap-6 bg-muted rounded-[16px] px-6 py-4 mb-6">
        <div className="flex items-center gap-3">
          <TrendingUp className="w-5 h-5 text-brand-primary" />
          <div>
            <div className="text-[13px] text-muted-foreground mb-1">
              {t("student.gradebook.avgScore")}
            </div>
            <div className="text-[20px] font-semibold text-foreground">{stats.avgPercentage}%</div>
          </div>
        </div>
        <div className="w-px h-12 bg-border"></div>
        <div>
          <div className="text-[13px] text-muted-foreground mb-1">
            {t("student.gradebook.gradesReceived")}
          </div>
          <div className="text-[20px] font-semibold text-foreground">
            {stats.published} / {stats.total}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex items-center gap-2 text-[14px] text-muted-foreground">
          <Filter className="w-4 h-4" />
          <span className="hidden tablet:inline">{t("common.filters")}:</span>
        </div>

        {/* Course Filter */}
        <div className="relative">
          <button
            onClick={() => {
              setShowCourseFilter(!showCourseFilter);
              setShowStatusFilter(false);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-card border-2 border-border rounded-[8px] text-[14px] text-foreground hover:border-brand-primary transition-colors"
          >
            <span>
              {selectedCourse === "all"
                ? `${t("common.all")} ${t("nav.courses").toLowerCase()}`
                : courses.find((c) => c.id === selectedCourse)?.name}
            </span>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </button>

          {showCourseFilter && (
            <div className="absolute top-full left-0 mt-2 w-[280px] bg-card border-2 border-border rounded-[12px] shadow-lg z-10 overflow-hidden">
              <button
                onClick={() => {
                  onCourseChange("all");
                  setShowCourseFilter(false);
                }}
                className={`w-full text-left px-4 py-3 text-[14px] hover:bg-muted transition-colors ${
                  selectedCourse === "all"
                    ? "bg-brand-primary-light text-brand-primary font-medium"
                    : "text-foreground"
                }`}
              >
                {t("common.all")} {t("nav.courses").toLowerCase()}
              </button>
              {courses.map((course) => (
                <button
                  key={course.id}
                  onClick={() => {
                    onCourseChange(course.id);
                    setShowCourseFilter(false);
                  }}
                  className={`w-full text-left px-4 py-3 text-[14px] hover:bg-muted transition-colors ${
                    selectedCourse === course.id
                      ? "bg-brand-primary-light text-brand-primary font-medium"
                      : "text-foreground"
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
            className="flex items-center gap-2 px-4 py-2 bg-card border-2 border-border rounded-[8px] text-[14px] text-foreground hover:border-brand-primary transition-colors"
          >
            <span>
              {selectedStatus === "all"
                ? `${t("common.all")} ${t("common.status").toLowerCase()}`
                : statusLabels[selectedStatus]}
            </span>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </button>

          {showStatusFilter && (
            <div className="absolute top-full left-0 mt-2 w-[220px] bg-card border-2 border-border rounded-[12px] shadow-lg z-10 overflow-hidden">
              <button
                onClick={() => {
                  onStatusChange("all");
                  setShowStatusFilter(false);
                }}
                className={`w-full text-left px-4 py-3 text-[14px] hover:bg-muted transition-colors ${
                  selectedStatus === "all"
                    ? "bg-brand-primary-light text-brand-primary font-medium"
                    : "text-foreground"
                }`}
              >
                {t("common.all")} {t("common.status").toLowerCase()}
              </button>
              {Object.entries(statusLabels).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => {
                    onStatusChange(key);
                    setShowStatusFilter(false);
                  }}
                  className={`w-full text-left px-4 py-3 text-[14px] hover:bg-muted transition-colors ${
                    selectedStatus === key
                      ? "bg-brand-primary-light text-brand-primary font-medium"
                      : "text-foreground"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

        {(selectedCourse !== "all" || selectedStatus !== "all") && (
          <button onClick={onReset} className="text-[14px] text-brand-primary hover:underline">
            {t("common.reset")}
          </button>
        )}
      </div>
    </>
  );
}
