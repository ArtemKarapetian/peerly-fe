import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Select, TextField } from "@/shared/ui";

interface CourseOption {
  id: string;
  name: string;
}

interface PickerFiltersProps {
  searchQuery: string;
  selectedCourseId: string;
  courses: CourseOption[];
  onSearchChange: (q: string) => void;
  onCourseChange: (id: string) => void;
}

export function PickerFilters({
  searchQuery,
  selectedCourseId,
  courses,
  onSearchChange,
  onCourseChange,
}: PickerFiltersProps) {
  const { t } = useTranslation();
  return (
    <div className="p-6 border-b-2 border-border space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <TextField
          placeholder={t("feature.assignmentPicker.searchPlaceholder")}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 py-2 text-sm"
        />
      </div>

      <Select
        value={selectedCourseId}
        onChange={(e) => onCourseChange(e.target.value)}
        className="py-2 text-sm"
      >
        <option value="all">{t("feature.assignmentPicker.allCourses")}</option>
        {courses.map((course) => (
          <option key={course.id} value={course.id}>
            {course.name}
          </option>
        ))}
      </Select>
    </div>
  );
}
