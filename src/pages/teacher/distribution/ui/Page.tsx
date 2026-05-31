import { GitBranch, Info } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

import { useAsync } from "@/shared/lib/useAsync";
import { Card, EmptyState } from "@/shared/ui";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs.tsx";
import { ErrorBanner } from "@/shared/ui/ErrorBanner";
import { PageHeader } from "@/shared/ui/PageHeader";
import { PageSkeleton } from "@/shared/ui/PageSkeleton";

import { assignmentRepo } from "@/entities/assignment";
import { courseRepo } from "@/entities/course";
import { reviewRepo } from "@/entities/review";
import { workRepo } from "@/entities/work";

import { AppShell } from "@/widgets/app-shell";

import { computeDistributions } from "../lib/computeDistributions";

import { DistributionFiltersCard } from "./DistributionFiltersCard";
import { DistributionTable } from "./DistributionTable";

export default function TeacherDistributionPage() {
  const { t } = useTranslation();
  const {
    data: baseData,
    isLoading,
    error,
    refetch,
  } = useAsync(
    async () => {
      const [courses, submissions, reviews] = await Promise.all([
        courseRepo.getAll(),
        workRepo.getAll(),
        reviewRepo.getAll(),
      ]);
      return { courses, submissions, reviews };
    },
    [],
    { onError: "redirect" },
  );

  const [params, setParams] = useSearchParams();
  const selectedCourse = params.get("courseId") ?? "";
  const selectedAssignment = params.get("assignmentId") ?? "";

  const setSelectedCourse = (v: string) => {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (v) next.set("courseId", v);
        else next.delete("courseId");
        next.delete("assignmentId");
        return next;
      },
      { replace: true },
    );
  };

  const setSelectedAssignment = (v: string) => {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (v) next.set("assignmentId", v);
        else next.delete("assignmentId");
        return next;
      },
      { replace: true },
    );
  };

  const filtersDirty = Boolean(selectedCourse) || Boolean(selectedAssignment);
  const resetFilters = () => setParams(new URLSearchParams(), { replace: true });

  const { data: assignments } = useAsync(async () => {
    if (!selectedCourse) return [];
    return assignmentRepo.getByCourse(selectedCourse);
  }, [selectedCourse]);

  const { data: participants } = useAsync(async () => {
    if (!selectedCourse) return null;
    return courseRepo.getParticipants(selectedCourse);
  }, [selectedCourse]);

  const nameById = useMemo(() => {
    const map = new Map<string, string>();
    if (!participants) return map;
    for (const s of participants.students) map.set(String(s.studentId), s.name);
    for (const tch of participants.teachers) map.set(String(tch.teacherId), tch.name);
    return map;
  }, [participants]);

  if (isLoading)
    return (
      <AppShell title={t("teacher.distribution.title")}>
        <PageSkeleton />
      </AppShell>
    );
  if (error)
    return (
      <AppShell title={t("teacher.distribution.title")}>
        <ErrorBanner error={error} onRetry={refetch} />
      </AppShell>
    );

  const { courses, submissions, reviews } = baseData!;

  const distributions = computeDistributions({
    submissions,
    reviews,
    nameById,
    selectedAssignment,
    unknownReviewer: t("teacher.distribution.unknownReviewer"),
    unknownAuthor: t("teacher.distribution.unknownAuthor"),
  });

  return (
    <AppShell title={t("teacher.distribution.title")}>
      <Breadcrumbs items={[{ label: t("teacher.distribution.breadcrumb") }]} />
      <PageHeader
        title={t("teacher.distribution.title")}
        subtitle={t("teacher.distribution.subtitle")}
      />

      <div className="bg-info-light border border-info rounded-md p-4 mb-6 flex items-start gap-3">
        <Info className="w-5 h-5 text-info shrink-0 mt-0.5" />
        <p className="text-13 text-foreground">{t("teacher.distribution.readOnlyNotice")}</p>
      </div>

      <DistributionFiltersCard
        courses={courses.map((c) => ({ id: c.id, title: c.name }))}
        assignments={assignments ?? []}
        selectedCourse={selectedCourse}
        selectedAssignment={selectedAssignment}
        filtersDirty={filtersDirty}
        onCourseChange={setSelectedCourse}
        onAssignmentChange={setSelectedAssignment}
        onReset={resetFilters}
      />

      <DistributionContent
        hasAssignment={Boolean(selectedAssignment)}
        rowsCount={distributions.length}
      >
        <DistributionTable rows={distributions} />
      </DistributionContent>
    </AppShell>
  );
}

function DistributionContent({
  hasAssignment,
  rowsCount,
  children,
}: {
  hasAssignment: boolean;
  rowsCount: number;
  children: React.ReactNode;
}) {
  const { t } = useTranslation();
  if (!hasAssignment) {
    return (
      <Card className="p-0">
        <EmptyState icon={GitBranch} message={t("teacher.distribution.pickAssignmentPrompt")} />
      </Card>
    );
  }
  if (rowsCount === 0) {
    return (
      <Card className="p-0">
        <EmptyState message={t("teacher.distribution.emptyState")} />
      </Card>
    );
  }
  return <>{children}</>;
}
