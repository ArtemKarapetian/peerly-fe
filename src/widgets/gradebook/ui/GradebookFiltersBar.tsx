import { Filter } from "lucide-react";
import { useTranslation } from "react-i18next";

import { DropdownFilter } from "./DropdownFilter";

interface CourseOption {
  id: string;
  name: string;
}

interface GradebookFiltersBarProps {
  courses: CourseOption[];
  selectedCourse: string;
  selectedStatus: string;
  statusLabels: Record<string, string>;
  onCourseChange: (id: string) => void;
  onStatusChange: (status: string) => void;
  onReset: () => void;
}

export function GradebookFiltersBar({
  courses,
  selectedCourse,
  selectedStatus,
  statusLabels,
  onCourseChange,
  onStatusChange,
  onReset,
}: GradebookFiltersBarProps) {
  const { t } = useTranslation();
  const courseOptions = [
    { value: "all", label: t("student.gradebook.allCourses") },
    ...courses.map((c) => ({ value: c.id, label: c.name })),
  ];
  const statusOptions = [
    { value: "all", label: t("student.gradebook.allStatuses") },
    ...Object.entries(statusLabels).map(([value, label]) => ({ value, label })),
  ];
  const selectedCourseLabel =
    selectedCourse === "all"
      ? t("student.gradebook.allCourses")
      : (courses.find((c) => c.id === selectedCourse)?.name ?? "");
  const selectedStatusLabel =
    selectedStatus === "all" ? t("student.gradebook.allStatuses") : statusLabels[selectedStatus];
  const filtersDirty = selectedCourse !== "all" || selectedStatus !== "all";

  return (
    <div className="flex flex-wrap items-center gap-3 mb-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Filter className="w-4 h-4" />
        <span className="hidden tablet:inline">{t("common.filters")}:</span>
      </div>

      <DropdownFilter
        options={courseOptions}
        selectedValue={selectedCourse}
        selectedLabel={selectedCourseLabel}
        onSelect={onCourseChange}
      />

      <DropdownFilter
        options={statusOptions}
        selectedValue={selectedStatus}
        selectedLabel={selectedStatusLabel}
        width="220px"
        onSelect={onStatusChange}
      />

      {filtersDirty && (
        <button onClick={onReset} className="text-sm text-brand-primary hover:underline">
          {t("common.reset")}
        </button>
      )}
    </div>
  );
}
