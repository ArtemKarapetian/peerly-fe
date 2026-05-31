import { useTranslation } from "react-i18next";

import { PageHeader } from "@/shared/ui/PageHeader";

import { GradebookFiltersBar } from "./GradebookFiltersBar";
import { GradebookStatsRow } from "./GradebookStatsRow";

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

  return (
    <>
      <PageHeader title={t("student.gradebook.title")} subtitle={t("student.gradebook.subtitle")} />

      <GradebookStatsRow
        avgPercentage={stats.avgPercentage}
        published={stats.published}
        total={stats.total}
      />

      <GradebookFiltersBar
        courses={courses}
        selectedCourse={selectedCourse}
        selectedStatus={selectedStatus}
        statusLabels={statusLabels}
        onCourseChange={onCourseChange}
        onStatusChange={onStatusChange}
        onReset={onReset}
      />
    </>
  );
}
