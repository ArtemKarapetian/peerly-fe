import {
  BarChart3,
  CheckCircle,
  Download,
  FileText,
  MessageSquare,
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
  Pie,
  PieChart,
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
import { userRepo } from "@/entities/user";
import { workRepo } from "@/entities/work";

import { AppShell } from "@/widgets/app-shell/AppShell.tsx";

interface GradebookEntry {
  studentId: string;
  studentName: string;
  scores: Record<string, number | null>;
  finalScore: number | null;
}

export default function TeacherAnalyticsPage() {
  const { t } = useTranslation();
  const { data, isLoading, error, refetch } = useAsync(
    async () => {
      const [courses, assignments, submissions, reviews, allUsers] = await Promise.all([
        courseRepo.getAll(),
        assignmentRepo.getAll(),
        workRepo.getAll(),
        reviewRepo.getAll(),
        userRepo.getAll(),
      ]);
      const users = allUsers.filter((u) => u.role === "Student");
      return { courses, assignments, submissions, reviews, users };
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
  users: Awaited<ReturnType<typeof userRepo.getAll>>;
}

function AnalyticsContent({ data }: { data: ContentData }) {
  const { t } = useTranslation();
  const { courses, assignments, submissions, reviews, users } = data;
  const [params] = useSearchParams();

  const preAssignment = params.get("assignmentId") ?? "all";

  const [selectedCourse, setSelectedCourse] = useState<string>(() => {
    if (preAssignment !== "all") {
      const a = assignments.find((x) => x.id === preAssignment);
      if (a) return a.courseId;
    }
    return courses[0]?.id ?? "";
  });

  const courseAssignments = useMemo(
    () => assignments.filter((a) => a.courseId === selectedCourse),
    [assignments, selectedCourse],
  );

  const initialAssignmentForCourse = courseAssignments.some((a) => a.id === preAssignment)
    ? preAssignment
    : "all";
  const [selectedAssignment, setSelectedAssignment] = useState<string>(initialAssignmentForCourse);

  const assignmentAnalytics = courseAssignments.map((assignment) => {
    const assignmentSubmissions = submissions.filter((s) => s.assignmentId === assignment.id);
    const completed = assignmentSubmissions.filter((s) => s.status === "submitted");
    const completionRate = users.length > 0 ? (completed.length / users.length) * 100 : 0;

    const assignmentReviews = reviews.filter((r) =>
      assignmentSubmissions.some((s) => s.id === r.submissionId),
    );
    const expectedReviews = completed.length * (assignment.reviewCount || 0);
    const submittedReviews = assignmentReviews.filter((r) => r.status === "submitted");
    const reviewCompletionRate =
      expectedReviews > 0 ? (submittedReviews.length / expectedReviews) * 100 : 0;

    const scores = submittedReviews.flatMap((r) => Object.values(r.scores));
    const avgScore = scores.length > 0 ? scores.reduce((s, v) => s + v, 0) / scores.length : 0;
    const avgCommentLength =
      submittedReviews.length > 0
        ? submittedReviews.reduce((s, r) => s + r.comment.length, 0) / submittedReviews.length
        : 0;

    return {
      id: assignment.id,
      title: assignment.title,
      completionRate,
      reviewCompletionRate,
      avgScore,
      avgCommentLength,
      submissionsCount: completed.length,
      reviewsCount: submittedReviews.length,
    };
  });

  const overall = {
    totalAssignments: courseAssignments.length,
    avgCompletionRate: average(assignmentAnalytics.map((a) => a.completionRate)),
    avgReviewCompletionRate: average(assignmentAnalytics.map((a) => a.reviewCompletionRate)),
    avgScore: average(assignmentAnalytics.map((a) => a.avgScore).filter((v) => v > 0)),
    avgCommentLength: average(
      assignmentAnalytics.map((a) => a.avgCommentLength).filter((v) => v > 0),
    ),
  };

  const gradebook: GradebookEntry[] = users.map((student) => {
    const scores: Record<string, number | null> = {};
    const earned: number[] = [];

    for (const assignment of courseAssignments) {
      const submission = submissions.find(
        (s) => s.assignmentId === assignment.id && s.studentId === student.id,
      );
      if (!submission || submission.status !== "submitted") {
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
      const avg = subReviews.reduce((s, v) => s + v, 0) / subReviews.length;
      const rounded = Math.round(avg * 10) / 10;
      scores[assignment.id] = rounded;
      earned.push(rounded);
    }
    return {
      studentId: student.id,
      studentName: student.name,
      scores,
      finalScore: earned.length > 0 ? Math.round(average(earned) * 10) / 10 : null,
    };
  });

  const completionChartData = assignmentAnalytics.map((a) => ({
    name: a.title.length > 20 ? a.title.substring(0, 20) + "…" : a.title,
    [t("teacher.analytics.submissionsSubmitted")]: Math.round(a.completionRate),
    [t("teacher.analytics.reviewsCompleted")]: Math.round(a.reviewCompletionRate),
  }));

  const allCourseScores = courseAssignments
    .flatMap((a) => submissions.filter((s) => s.assignmentId === a.id))
    .flatMap((s) => reviews.filter((r) => r.submissionId === s.id && r.status === "submitted"))
    .flatMap((r) => Object.values(r.scores))
    .filter((v): v is number => typeof v === "number" && v > 0 && v <= 5);

  const buckets = { "1-2": 0, "2-3": 0, "3-4": 0, "4-5": 0 };
  for (const v of allCourseScores) {
    if (v <= 2) buckets["1-2"]++;
    else if (v <= 3) buckets["2-3"]++;
    else if (v <= 4) buckets["3-4"]++;
    else buckets["4-5"]++;
  }
  const scoreDistributionData = [
    { name: "1–2", value: buckets["1-2"], fill: "var(--destructive)" },
    { name: "2–3", value: buckets["2-3"], fill: "var(--warning)" },
    { name: "3–4", value: buckets["3-4"], fill: "var(--warning)" },
    { name: "4–5", value: buckets["4-5"], fill: "var(--success)" },
  ];
  const hasDistribution = allCourseScores.length > 0;

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
    link.download = `gradebook_${course?.title ?? "course"}_${
      new Date().toISOString().split("T")[0]
    }.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <AppShell title={t("teacher.analytics.title")}>
      <Breadcrumbs items={[{ label: t("teacher.analytics.breadcrumb") }]} />
      <PageHeader title={t("teacher.analytics.title")} subtitle={t("teacher.analytics.subtitle")} />

      <div className="bg-card border-2 border-border rounded-[20px] p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-[13px] font-medium text-muted-foreground mb-2 uppercase tracking-wide">
              {t("teacher.analytics.courseLabel")}
            </label>
            <select
              value={selectedCourse}
              onChange={(e) => {
                setSelectedCourse(e.target.value);
                setSelectedAssignment("all");
              }}
              className="w-full px-4 py-3 border-2 border-border rounded-[12px] text-[15px] bg-background focus:border-brand-primary focus:outline-none"
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-[13px] font-medium text-muted-foreground mb-2 uppercase tracking-wide">
              {t("teacher.analytics.assignmentLabel")}
            </label>
            <select
              value={selectedAssignment}
              onChange={(e) => setSelectedAssignment(e.target.value)}
              className="w-full px-4 py-3 border-2 border-border rounded-[12px] text-[15px] bg-background focus:border-brand-primary focus:outline-none"
            >
              <option value="all">{t("teacher.analytics.allAssignments")}</option>
              {courseAssignments.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <MetricCard
          icon={<FileText className="w-4 h-4 text-brand-primary" />}
          label={t("teacher.analytics.assignmentsCount")}
          value={String(overall.totalAssignments)}
        />
        <MetricCard
          icon={<CheckCircle className="w-4 h-4 text-success" />}
          label={t("teacher.analytics.submissionRate")}
          value={`${Math.round(overall.avgCompletionRate)}%`}
        />
        <MetricCard
          icon={<TrendingUp className="w-4 h-4 text-brand-primary" />}
          label={t("teacher.analytics.avgScore")}
          value={overall.avgScore > 0 ? `${overall.avgScore.toFixed(1)}/5` : "—"}
        />
        <MetricCard
          icon={<Users className="w-4 h-4 text-brand-primary" />}
          label={t("teacher.analytics.studentsCount")}
          value={String(users.length)}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-card border-2 border-border rounded-[20px] p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-brand-primary" />
            <h2 className="text-[18px] font-medium text-foreground">
              {t("teacher.analytics.completionByAssignment")}
            </h2>
          </div>
          {completionChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={completionChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
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
                  dataKey={t("teacher.analytics.submissionsSubmitted")}
                  fill="var(--brand-primary)"
                  radius={[8, 8, 0, 0]}
                />
                <Bar
                  dataKey={t("teacher.analytics.reviewsCompleted")}
                  fill="var(--success)"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              {t("teacher.analytics.noDataToDisplay")}
            </div>
          )}
        </div>

        <div className="bg-card border-2 border-border rounded-[20px] p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-brand-primary" />
            <h2 className="text-[18px] font-medium text-foreground">
              {t("teacher.analytics.scoreDistribution")}
            </h2>
          </div>
          {hasDistribution ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={scoreDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                  outerRadius={100}
                  dataKey="value"
                >
                  {scoreDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              {t("teacher.analytics.noDataToDisplay")}
            </div>
          )}
        </div>
      </div>

      <div className="bg-card border-2 border-border rounded-[20px] p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="w-5 h-5 text-brand-primary" />
          <h2 className="text-[18px] font-medium text-foreground">
            {t("teacher.analytics.reviewQualityIndicators")}
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          <div>
            <p className="text-[13px] text-muted-foreground mb-2">
              {t("teacher.analytics.avgCommentLength")}
            </p>
            <p className="text-[28px] font-medium text-foreground">
              {overall.avgCommentLength > 0 ? Math.round(overall.avgCommentLength) : "—"}
            </p>
            <p className="text-[12px] text-muted-foreground">{t("teacher.analytics.characters")}</p>
          </div>
          <div>
            <p className="text-[13px] text-muted-foreground mb-2">
              {t("teacher.analytics.reviewCompletion")}
            </p>
            <p className="text-[28px] font-medium text-success">
              {Math.round(overall.avgReviewCompletionRate)}%
            </p>
            <p className="text-[12px] text-muted-foreground">{t("teacher.analytics.ofExpected")}</p>
          </div>
          <div>
            <p className="text-[13px] text-muted-foreground mb-2">
              {t("teacher.analytics.averageScoreLabel")}
            </p>
            <p className="text-[28px] font-medium text-brand-primary">
              {overall.avgScore > 0 ? overall.avgScore.toFixed(2) : "—"}
            </p>
            <p className="text-[12px] text-muted-foreground">{t("teacher.analytics.outOf")}</p>
          </div>
        </div>
      </div>

      <div className="bg-card border-2 border-border rounded-[20px] p-6">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-brand-primary" />
            <h2 className="text-[18px] font-medium text-foreground">
              {t("teacher.analytics.gradebook")}
            </h2>
          </div>
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
            <h3 className="text-[18px] font-medium text-foreground mb-2">
              {t("teacher.analytics.noGradebookData")}
            </h3>
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
                      {assignment.title.length > 15
                        ? assignment.title.substring(0, 15) + "…"
                        : assignment.title}
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

function MetricCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-card border-2 border-border rounded-[12px] p-4">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-[12px] text-muted-foreground uppercase tracking-wide">{label}</span>
      </div>
      <p className="text-[24px] font-medium text-foreground">{value}</p>
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

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((s, v) => s + v, 0) / values.length;
}
