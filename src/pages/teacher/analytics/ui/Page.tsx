import {
  Activity,
  AlertTriangle,
  BarChart3,
  Download,
  FileText,
  TrendingUp,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useAsync } from "@/shared/lib/useAsync";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs.tsx";
import { ErrorBanner } from "@/shared/ui/ErrorBanner";
import { PageHeader } from "@/shared/ui/PageHeader";
import { PageSkeleton } from "@/shared/ui/PageSkeleton";

import { assignmentRepo } from "@/entities/assignment";
import { courseRepo } from "@/entities/course";
import { reviewRepo } from "@/entities/review";
import { workRepo } from "@/entities/work";

import { AppShell } from "@/widgets/app-shell/AppShell.tsx";

interface GradebookEntry {
  studentId: string;
  studentName: string;
  scores: Record<string, number | null>;
  finalScore: number | null;
}

interface AssignmentMetrics {
  id: string;
  title: string;
  shortTitle: string;
  submissionRate: number;
  reviewCompletionRate: number;
  avgScore: number;
  avgDiscrepancy: number;
  hasDiscrepancyData: boolean;
}

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

interface ContentData {
  courses: Awaited<ReturnType<typeof courseRepo.getAll>>;
  assignments: Awaited<ReturnType<typeof assignmentRepo.getAll>>;
  submissions: Awaited<ReturnType<typeof workRepo.getAll>>;
  reviews: Awaited<ReturnType<typeof reviewRepo.getAll>>;
}

function AnalyticsContent({ data }: { data: ContentData }) {
  const { t } = useTranslation();
  const { courses, assignments, submissions, reviews } = data;
  const [params] = useSearchParams();

  const preAssignment = params.get("assignmentId") ?? "all";

  const [selectedCourse, setSelectedCourse] = useState<string>(() => {
    if (preAssignment !== "all") {
      const a = assignments.find((x) => x.id === preAssignment);
      if (a) return a.courseId;
    }
    return courses[0]?.id ?? "";
  });

  const { data: participants } = useAsync(
    () =>
      selectedCourse
        ? courseRepo.getParticipants(selectedCourse).then((r) => r.students)
        : Promise.resolve([]),
    [selectedCourse],
  );
  const users = participants ?? [];

  const courseAssignments = useMemo(
    () => assignments.filter((a) => a.courseId === selectedCourse),
    [assignments, selectedCourse],
  );

  const assignmentMetrics: AssignmentMetrics[] = courseAssignments.map((assignment) => {
    const assignmentSubmissions = submissions.filter((s) => s.assignmentId === assignment.id);
    const completed = assignmentSubmissions.filter(
      (s) => s.status === "submitted" || s.status === "reviewed",
    );
    const submissionRate = users.length > 0 ? (completed.length / users.length) * 100 : 0;

    const submittedReviews = reviews.filter(
      (r) => r.status === "submitted" && assignmentSubmissions.some((s) => s.id === r.submissionId),
    );
    const expectedReviews = completed.length * (assignment.reviewCount || 0);
    const reviewCompletionRate =
      expectedReviews > 0 ? (submittedReviews.length / expectedReviews) * 100 : 0;

    const scoreVals = submittedReviews.flatMap((r) => Object.values(r.scores));
    const avgScore = scoreVals.length > 0 ? mean(scoreVals) : 0;

    // Average per-submission discrepancy: max(scores per submission) − min(scores per submission)
    const discrepancies: number[] = [];
    for (const submission of completed) {
      const subReviewScores = submittedReviews
        .filter((r) => r.submissionId === submission.id)
        .map((r) => mean(Object.values(r.scores)))
        .filter((v) => Number.isFinite(v) && v > 0);
      if (subReviewScores.length >= 2) {
        discrepancies.push(Math.max(...subReviewScores) - Math.min(...subReviewScores));
      }
    }
    const avgDiscrepancy = discrepancies.length > 0 ? mean(discrepancies) : 0;

    return {
      id: assignment.id,
      title: assignment.title,
      shortTitle: truncate(assignment.title, 20),
      submissionRate,
      reviewCompletionRate,
      avgScore,
      avgDiscrepancy,
      hasDiscrepancyData: discrepancies.length > 0,
    };
  });

  const overall = {
    totalAssignments: courseAssignments.length,
    avgSubmissionRate: mean(assignmentMetrics.map((a) => a.submissionRate)),
    avgReviewCompletionRate: mean(assignmentMetrics.map((a) => a.reviewCompletionRate)),
    avgScore: mean(assignmentMetrics.map((a) => a.avgScore).filter((v) => v > 0)),
    avgDiscrepancy: mean(
      assignmentMetrics.filter((a) => a.hasDiscrepancyData).map((a) => a.avgDiscrepancy),
    ),
  };

  const gradebook: GradebookEntry[] = users.map((student) => {
    const scores: Record<string, number | null> = {};
    const earned: number[] = [];
    for (const assignment of courseAssignments) {
      const submission = submissions.find(
        (s) => s.assignmentId === assignment.id && s.studentId === student.id,
      );
      if (!submission || (submission.status !== "submitted" && submission.status !== "reviewed")) {
        scores[assignment.id] = null;
        continue;
      }
      const subReviews = reviews
        .filter((r) => r.submissionId === submission.id && r.status === "submitted")
        .flatMap((r) => Object.values(r.scores));
      if (subReviews.length === 0) {
        scores[assignment.id] = null;
        continue;
      }
      const rounded = Math.round(mean(subReviews) * 10) / 10;
      scores[assignment.id] = rounded;
      earned.push(rounded);
    }
    return {
      studentId: student.id,
      studentName: student.userName,
      scores,
      finalScore: earned.length > 0 ? Math.round(mean(earned) * 10) / 10 : null,
    };
  });

  const activityChartData = assignmentMetrics.map((a) => ({
    name: a.shortTitle,
    [t("teacher.analytics.submissionsSubmitted")]: Math.round(a.submissionRate),
    [t("teacher.analytics.reviewsCompleted")]: Math.round(a.reviewCompletionRate),
  }));

  const discrepancyChartData = assignmentMetrics
    .filter((a) => a.hasDiscrepancyData)
    .map((a) => ({
      name: a.shortTitle,
      [t("teacher.analytics.discrepancyShort")]: Math.round(a.avgDiscrepancy * 10) / 10,
    }));

  const handleExportCSV = () => {
    const course = courses.find((c) => c.id === selectedCourse);
    const headers = [
      t("teacher.analytics.csvStudentHeader"),
      ...courseAssignments.map((a) => a.title),
      t("teacher.analytics.csvFinalGrade"),
    ];
    const rows = gradebook.map((entry) => [
      entry.studentName,
      ...courseAssignments.map((a) => entry.scores[a.id]?.toString() ?? "—"),
      entry.finalScore?.toString() ?? "—",
    ]);
    const csv = [headers, ...rows]
      .map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `gradebook_${course?.title ?? "course"}_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <AppShell title={t("teacher.analytics.title")}>
      <Breadcrumbs items={[{ label: t("teacher.analytics.breadcrumb") }]} />
      <PageHeader title={t("teacher.analytics.title")} subtitle={t("teacher.analytics.subtitle")} />

      <div className="bg-card border-2 border-border rounded-[20px] p-6 mb-6">
        <label className="block text-[13px] font-medium text-muted-foreground mb-2 uppercase tracking-wide">
          {t("teacher.analytics.courseLabel")}
        </label>
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="w-full px-4 py-3 border-2 border-border rounded-[12px] text-[15px] bg-background focus:border-brand-primary focus:outline-none"
        >
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        <MetricCard
          icon={<FileText className="w-4 h-4 text-brand-primary" />}
          label={t("teacher.analytics.assignmentsCount")}
          value={String(overall.totalAssignments)}
        />
        <MetricCard
          icon={<Users className="w-4 h-4 text-brand-primary" />}
          label={t("teacher.analytics.studentsCount")}
          value={String(users.length)}
        />
        <MetricCard
          icon={<TrendingUp className="w-4 h-4 text-brand-primary" />}
          label={t("teacher.analytics.avgScore")}
          value={overall.avgScore > 0 ? `${overall.avgScore.toFixed(2)}/5` : "—"}
        />
        <MetricCard
          icon={<AlertTriangle className="w-4 h-4 text-warning" />}
          label={t("teacher.analytics.avgDiscrepancy")}
          value={overall.avgDiscrepancy > 0 ? `±${overall.avgDiscrepancy.toFixed(2)}` : "—"}
          hint={t("teacher.analytics.discrepancyHint")}
        />
        <MetricCard
          icon={<Activity className="w-4 h-4 text-success" />}
          label={t("teacher.analytics.activityLabel")}
          value={`${Math.round(overall.avgSubmissionRate)}% / ${Math.round(overall.avgReviewCompletionRate)}%`}
          hint={t("teacher.analytics.activityHint")}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <ChartCard
          icon={<BarChart3 className="w-5 h-5 text-brand-primary" />}
          title={t("teacher.analytics.activityByAssignment")}
        >
          {activityChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={activityChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                  angle={-30}
                  textAnchor="end"
                  height={70}
                />
                <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "2px solid var(--border)",
                    borderRadius: "8px",
                  }}
                />
                <Bar
                  dataKey={t("teacher.analytics.submissionsSubmitted")}
                  fill="var(--brand-primary)"
                  radius={[6, 6, 0, 0]}
                />
                <Bar
                  dataKey={t("teacher.analytics.reviewsCompleted")}
                  fill="var(--success)"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart label={t("teacher.analytics.noDataToDisplay")} />
          )}
        </ChartCard>

        <ChartCard
          icon={<AlertTriangle className="w-5 h-5 text-warning" />}
          title={t("teacher.analytics.discrepancyByAssignment")}
        >
          {discrepancyChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={discrepancyChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                  angle={-30}
                  textAnchor="end"
                  height={70}
                />
                <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "2px solid var(--border)",
                    borderRadius: "8px",
                  }}
                />
                <Bar
                  dataKey={t("teacher.analytics.discrepancyShort")}
                  fill="var(--warning)"
                  radius={[6, 6, 0, 0]}
                >
                  {discrepancyChartData.map((_, i) => (
                    <Cell key={i} fill="var(--warning)" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart label={t("teacher.analytics.noDiscrepancyData")} />
          )}
        </ChartCard>
      </div>

      <div className="bg-card border-2 border-border rounded-[20px] p-6 mb-6">
        <h2 className="text-[18px] font-medium text-foreground mb-4">
          {t("teacher.analytics.perAssignment")}
        </h2>
        {assignmentMetrics.length === 0 ? (
          <p className="text-[14px] text-muted-foreground text-center py-6">
            {t("teacher.analytics.noAssignmentsYet")}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[14px]">
              <thead>
                <tr className="text-left text-[12px] text-muted-foreground uppercase tracking-wide border-b-2 border-border">
                  <th className="p-3">{t("teacher.analytics.assignmentLabel")}</th>
                  <th className="p-3 text-right">{t("teacher.analytics.submissionRate")}</th>
                  <th className="p-3 text-right">{t("teacher.analytics.reviewCompletion")}</th>
                  <th className="p-3 text-right">{t("teacher.analytics.avgScore")}</th>
                  <th className="p-3 text-right">{t("teacher.analytics.avgDiscrepancy")}</th>
                </tr>
              </thead>
              <tbody>
                {assignmentMetrics.map((m, i) => (
                  <tr
                    key={m.id}
                    className={`border-b border-border ${i % 2 === 0 ? "bg-card" : "bg-muted"}`}
                  >
                    <td className="p-3 text-foreground">{m.title}</td>
                    <td className="p-3 text-right text-foreground">
                      {Math.round(m.submissionRate)}%
                    </td>
                    <td className="p-3 text-right text-foreground">
                      {Math.round(m.reviewCompletionRate)}%
                    </td>
                    <td className="p-3 text-right text-foreground">
                      {m.avgScore > 0 ? m.avgScore.toFixed(2) : "—"}
                    </td>
                    <td className="p-3 text-right text-foreground">
                      {m.hasDiscrepancyData ? `±${m.avgDiscrepancy.toFixed(2)}` : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-card border-2 border-border rounded-[20px] p-6">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h2 className="text-[18px] font-medium text-foreground flex items-center gap-2">
            <FileText className="w-5 h-5 text-brand-primary" />
            {t("teacher.analytics.gradebook")}
          </h2>
          <button
            onClick={handleExportCSV}
            disabled={gradebook.length === 0 || courseAssignments.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-primary-foreground rounded-[12px] hover:bg-brand-primary-hover transition-colors text-[14px] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            {t("teacher.analytics.exportCSV")}
          </button>
        </div>

        {gradebook.length === 0 || courseAssignments.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-[14px] text-muted-foreground">
              {t("teacher.analytics.selectCourseWithData")}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-border">
                  <th className="text-left p-3 text-[13px] font-medium text-muted-foreground uppercase tracking-wide sticky left-0 bg-card">
                    {t("teacher.analytics.studentHeader")}
                  </th>
                  {courseAssignments.map((assignment) => (
                    <th
                      key={assignment.id}
                      className="text-center p-3 text-[13px] font-medium text-muted-foreground uppercase tracking-wide min-w-[100px]"
                      title={assignment.title}
                    >
                      {truncate(assignment.title, 15)}
                    </th>
                  ))}
                  <th className="text-center p-3 text-[13px] font-medium text-muted-foreground uppercase tracking-wide bg-muted min-w-[100px]">
                    {t("teacher.analytics.finalGrade")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {gradebook.map((entry, index) => (
                  <tr
                    key={entry.studentId}
                    className={`border-b border-border ${index % 2 === 0 ? "bg-card" : "bg-muted"}`}
                  >
                    <td className="p-3 text-[14px] text-foreground font-medium sticky left-0 bg-inherit">
                      {entry.studentName}
                    </td>
                    {courseAssignments.map((assignment) => {
                      const score = entry.scores[assignment.id];
                      return (
                        <td key={assignment.id} className="p-3 text-center">
                          {score !== null ? (
                            <ScoreBadge value={score} />
                          ) : (
                            <span className="text-muted-foreground text-[14px]">—</span>
                          )}
                        </td>
                      );
                    })}
                    <td className="p-3 text-center bg-muted">
                      {entry.finalScore !== null ? (
                        <FinalScoreBadge value={entry.finalScore} />
                      ) : (
                        <span className="text-muted-foreground text-[14px]">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppShell>
  );
}

function ChartCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-card border-2 border-border rounded-[20px] p-6">
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h2 className="text-[18px] font-medium text-foreground">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function EmptyChart({ label }: { label: string }) {
  return (
    <div className="h-[300px] flex items-center justify-center text-[14px] text-muted-foreground text-center px-6">
      {label}
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="bg-card border-2 border-border rounded-[12px] p-4" title={hint}>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-[12px] text-muted-foreground uppercase tracking-wide">{label}</span>
      </div>
      <p className="text-[22px] font-medium text-foreground">{value}</p>
    </div>
  );
}

function ScoreBadge({ value }: { value: number }) {
  const tone =
    value >= 4
      ? "bg-success-light text-success"
      : value >= 3
        ? "bg-warning-light text-warning"
        : "bg-destructive-light text-destructive";
  return (
    <span
      className={`inline-flex items-center justify-center w-12 h-8 rounded-[6px] text-[14px] font-medium ${tone}`}
    >
      {value.toFixed(1)}
    </span>
  );
}

function FinalScoreBadge({ value }: { value: number }) {
  const tone =
    value >= 4
      ? "bg-success text-primary-foreground"
      : value >= 3
        ? "bg-warning text-primary-foreground"
        : "bg-destructive text-primary-foreground";
  return (
    <span
      className={`inline-flex items-center justify-center w-14 h-9 rounded-[8px] text-[15px] font-medium ${tone}`}
    >
      {value.toFixed(1)}
    </span>
  );
}

function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((s, v) => s + v, 0) / values.length;
}

function truncate(s: string, n: number): string {
  return s.length > n ? s.substring(0, n) + "…" : s;
}
