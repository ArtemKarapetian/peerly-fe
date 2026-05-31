import { useTranslation } from "react-i18next";

import { Field, FiltersCard, Select } from "@/shared/ui";

interface FilterOption {
  id: string;
  title: string;
}

interface DistributionFiltersCardProps {
  courses: FilterOption[];
  assignments: FilterOption[];
  selectedCourse: string;
  selectedAssignment: string;
  filtersDirty: boolean;
  onCourseChange: (v: string) => void;
  onAssignmentChange: (v: string) => void;
  onReset: () => void;
}

export function DistributionFiltersCard({
  courses,
  assignments,
  selectedCourse,
  selectedAssignment,
  filtersDirty,
  onCourseChange,
  onAssignmentChange,
  onReset,
}: DistributionFiltersCardProps) {
  const { t } = useTranslation();
  return (
    <FiltersCard columns={2} onReset={onReset} showReset={filtersDirty}>
      <Field label={t("teacher.distribution.courseLabel")}>
        <Select value={selectedCourse} onChange={(e) => onCourseChange(e.target.value)}>
          <option value="">{t("teacher.distribution.selectCourse")}</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </Select>
      </Field>

      <Field label={t("teacher.distribution.assignmentLabel")}>
        <Select
          value={selectedAssignment}
          onChange={(e) => onAssignmentChange(e.target.value)}
          disabled={!selectedCourse}
        >
          <option value="">{t("teacher.distribution.selectAssignment")}</option>
          {assignments.map((a) => (
            <option key={a.id} value={a.id}>
              {a.title}
            </option>
          ))}
        </Select>
      </Field>
    </FiltersCard>
  );
}
