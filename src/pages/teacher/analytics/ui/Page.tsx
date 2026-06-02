import { X } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

import { useAsync } from "@/shared/lib/useAsync";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs.tsx";
import { ErrorBanner } from "@/shared/ui/ErrorBanner";
import { PageHeader } from "@/shared/ui/PageHeader";
import { PageSkeleton } from "@/shared/ui/PageSkeleton";

import { assignmentRepo } from "@/entities/assignment";
import { courseRepo } from "@/entities/course";
import { reviewRepo } from "@/entities/review";
import { workRepo } from "@/entities/work";

import { AppShell } from "@/widgets/app-shell";

import {
  computeAssignmentMetrics,
  computeGradebook,
  computeOverallMetrics,
} from "../lib/computeAnalytics";
import { exportGradebookCsv } from "../lib/exportGradebookCsv";
import type { AnalyticsRawData } from "../model/types";

import { ChartsRow } from "./ChartsRow";
import { CourseSelectorCard } from "./CourseSelectorCard";
import { GradebookCard } from "./GradebookCard";
import { OverallMetricsRow } from "./OverallMetricsRow";
import { PerAssignmentTable } from "./PerAssignmentTable";

export default function TeacherAnalyticsPage() {
  const { t } = useTranslation();
  const { data, isLoading, error, refetch } = useAsync(
    async () => {
      const [courses, assignments, submissions, reviews] = await Promise.all([
        courseRepo.getAll(),
        assignmentRepo.getAll(),
        workRepo.getAll(),
        reviewRepo.getAll(),
      ]);
      return { courses, assignments, submissions, reviews };
    },
    [],
    { onError: "redirect" },
  );

  if (isLoading)
    return (
      <AppShell title={t("teacher.analytics.title")}>
        <PageSkeleton />
      </AppShell>
    );
  if (error)
    return (
      <AppShell title={t("teacher.analytics.title")}>
        <ErrorBanner error={error} onRetry={refetch} />
      </AppShell>
    );

  return <AnalyticsContent data={data!} />;
}

function pickInitialCourse(
  data: AnalyticsRawData,
  preAssignmentId: string | null,
  preCourseId: string | null,
): string {
  if (preAssignmentId) {
    const a = data.assignments.find((x) => x.id === preAssignmentId);
    if (a) return a.courseId;
  }
  if (preCourseId && data.courses.some((c) => c.id === preCourseId)) {
    return preCourseId;
  }
  return data.courses[0]?.id ?? "";
}

function AnalyticsContent({ data }: { data: AnalyticsRawData }) {
  const { t } = useTranslation();
  const { courses, assignments } = data;
  const [params] = useSearchParams();

  const preCourseId = params.get("courseId");
  const preAssignmentId = params.get("assignmentId");

  const [selectedCourse, setSelectedCourseRaw] = useState<string>(() =>
    pickInitialCourse(data, preAssignmentId, preCourseId),
  );
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(() => {
    if (preAssignmentId && assignments.some((a) => a.id === preAssignmentId)) {
      return preAssignmentId;
    }
    return null;
  });

  const setSelectedCourse = useCallback((courseId: string) => {
    setSelectedCourseRaw(courseId);
    setSelectedAssignmentId(null);
  }, []);

  const { data: participants } = useAsync(
    () =>
      selectedCourse
        ? courseRepo.getParticipants(selectedCourse).then((r) => r.students)
        : Promise.resolve([]),
    [selectedCourse],
  );
  const students = useMemo(() => participants ?? [], [participants]);

  const filteredAssignments = useMemo(
    () =>
      assignments
        .filter((a) => a.courseId === selectedCourse)
        .filter((a) => !selectedAssignmentId || a.id === selectedAssignmentId),
    [assignments, selectedCourse, selectedAssignmentId],
  );

  const metrics = useMemo(
    () =>
      computeAssignmentMetrics({
        data,
        students,
        selectedCourseId: selectedCourse,
        selectedAssignmentId,
      }),
    [data, students, selectedCourse, selectedAssignmentId],
  );

  const overall = useMemo(
    () => computeOverallMetrics(metrics, filteredAssignments.length),
    [metrics, filteredAssignments.length],
  );

  const gradebook = useMemo(
    () =>
      computeGradebook({
        data,
        students,
        selectedCourseId: selectedCourse,
        selectedAssignmentId,
      }),
    [data, students, selectedCourse, selectedAssignmentId],
  );

  const handleExportCSV = () => {
    const course = courses.find((c) => c.id === selectedCourse);
    exportGradebookCsv({
      courseTitle: course?.name ?? "course",
      assignments: filteredAssignments,
      gradebook,
      studentHeader: t("teacher.analytics.csvStudentHeader"),
      finalGradeHeader: t("teacher.analytics.csvFinalGrade"),
    });
  };

  const assignmentFilterName = selectedAssignmentId
    ? (assignments.find((a) => a.id === selectedAssignmentId)?.title ?? "")
    : null;

  return (
    <AppShell title={t("teacher.analytics.title")}>
      <Breadcrumbs items={[{ label: t("teacher.analytics.breadcrumb") }]} />
      <PageHeader title={t("teacher.analytics.title")} subtitle={t("teacher.analytics.subtitle")} />

      <CourseSelectorCard
        courses={courses.map((c) => ({ id: c.id, title: c.name }))}
        value={selectedCourse}
        onChange={setSelectedCourse}
      />

      {assignmentFilterName && (
        <AssignmentFilterChip
          assignmentName={assignmentFilterName}
          onClear={() => setSelectedAssignmentId(null)}
        />
      )}

      <OverallMetricsRow overall={overall} studentCount={students.length} />
      <ChartsRow metrics={metrics} />
      <PerAssignmentTable metrics={metrics} />
      <GradebookCard
        assignments={filteredAssignments}
        gradebook={gradebook}
        canExport={gradebook.length > 0 && filteredAssignments.length > 0}
        onExport={handleExportCSV}
      />
    </AppShell>
  );
}

function AssignmentFilterChip({
  assignmentName,
  onClear,
}: {
  assignmentName: string;
  onClear: () => void;
}) {
  const { t } = useTranslation();
  return (
    <div className="mb-4 flex items-center gap-2 bg-info-light border border-info rounded-md px-4 py-2">
      <span className="text-13 text-foreground">
        {t("teacher.analytics.filteredByAssignment")} <strong>{assignmentName}</strong>
      </span>
      <button
        onClick={onClear}
        className="ml-auto inline-flex items-center gap-1 px-2 py-1 text-13 text-brand-primary hover:bg-brand-primary-lighter rounded-sm"
      >
        <X className="w-3.5 h-3.5" />
        {t("teacher.analytics.clearAssignmentFilter")}
      </button>
    </div>
  );
}
