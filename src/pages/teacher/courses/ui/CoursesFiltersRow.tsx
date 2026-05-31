import { useTranslation } from "react-i18next";

import { Select } from "@/shared/ui";

import { CourseSearch } from "@/features/course/search";

import type { StatusFilter } from "../model/types";

interface CoursesFiltersRowProps {
  searchQuery: string;
  statusFilter: StatusFilter;
  resultsCount: number;
  onSearchChange: (q: string) => void;
  onStatusChange: (s: StatusFilter) => void;
}

export function CoursesFiltersRow({
  searchQuery,
  statusFilter,
  resultsCount,
  onSearchChange,
  onStatusChange,
}: CoursesFiltersRowProps) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-3 mb-4 flex-wrap">
      <div className="flex-1 min-w-[220px]">
        <CourseSearch
          value={searchQuery}
          onChange={onSearchChange}
          placeholder={t("teacher.courses.searchPlaceholder")}
        />
      </div>
      <div className="w-[180px]">
        <Select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value as StatusFilter)}
        >
          <option value="active">{t("teacher.courseDetail.status.active")}</option>
          <option value="draft">{t("teacher.courseDetail.status.draft")}</option>
          <option value="all">{t("teacher.courses.statusAll")}</option>
        </Select>
      </div>
      {resultsCount > 0 && (
        <p className="text-xs text-muted-foreground tabular-nums shrink-0 hidden tablet:block">
          {t("teacher.courses.coursesCount", { count: resultsCount })}
        </p>
      )}
    </div>
  );
}
