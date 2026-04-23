import {
  BarChart3,
  Download,
  FileText,
  TrendingUp,
  MessageSquare,
  AlertTriangle,
  Shield,
  Code,
  CheckCircle,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
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

/**
 * TeacherAnalyticsPage - Отчёты и аналитика
 *
 * Секции:
 * - Аналитика заданий: завершённость, завершённость рецензий, распределение оценок
 * - Индикаторы качества: средняя длина комментария, процент помеченных рецензий
 * - Сводка по плагинам (плагиат/линтер) по заданиям
 * - Таблица журнала оценок по курсам с экспортом в CSV/PDF
 */

interface GradebookEntry {
  studentId: string;
  studentName: string;
  scores: Record<string, number | null>; // assignmentId -> score
  finalScore: number;
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

  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [selectedAssignment, setSelectedAssignment] = useState<string>("all");

  if (isLoading)
    return (
      <AppShell title={t("teacher.analytics.title")}>
        <PageSkeleton />
      </AppShell>
    );
  if (error)
    return (
      <AppShell title={t("teacher.analytics.title")}>
        <ErrorBanner message={error.message} onRetry={refetch} />
      </AppShell>
    );

  const { courses, assignments, submissions, reviews, users } = data!;

  // Set default selected course if not set yet
  const effectiveCourse = selectedCourse || courses[0]?.id || "";

  // Generate analytics data
  const courseAssignments = assignments.filter((a) =>
    courses.find((c) => c.id === effectiveCourse)?.assignmentIds?.includes(a.id),
  );

  const assignmentAnalytics = courseAssignments.map((assignment) => {
    const assignmentSubmissions = submissions.filter((s) => s.assignmentId === assignment.id);
    const totalStudents = users.length;
    const completedSubmissions = assignmentSubmissions.filter(
      (s) => s.status === "submitted",
    ).length;
    const completionRate = totalStudents > 0 ? (completedSubmissions / totalStudents) * 100 : 0;

    const assignmentReviews = reviews.filter((r) =>
      assignmentSubmissions.some((s) => s.id === r.submissionId),
    );
    const expectedReviews = completedSubmissions * 3; // 3 reviews per work
    const completedReviews = assignmentReviews.length;
    const reviewCompletionRate =
      expectedReviews > 0 ? (completedReviews / expectedReviews) * 100 : 0;

    // Calculate average scores
    const allScores = assignmentReviews.flatMap((r) => Object.values(r.scores));
    const avgScore =
      allScores.length > 0
        ? allScores.reduce((sum, score) => sum + score, 0) / allScores.length
        : 0;

    // Calculate average comment length
    const avgCommentLength =
      assignmentReviews.length > 0
        ? assignmentReviews.reduce((sum, r) => sum + r.comment.length, 0) / assignmentReviews.length
        : 0;

    // Demo flagged rate (5-15%)
    const flaggedRate = 5 + Math.random() * 10;

    // Demo plagiarism stats
    const plagiarismHigh = Math.floor(completedSubmissions * (0.05 + Math.random() * 0.1));
    const plagiarismMedium = Math.floor(completedSubmissions * (0.1 + Math.random() * 0.15));
    const plagiarismLow = completedSubmissions - plagiarismHigh - plagiarismMedium;

    // Demo linter stats
    const lintFailed = Math.floor(completedSubmissions * (0.1 + Math.random() * 0.2));
    const lintWarning = Math.floor(completedSubmissions * (0.2 + Math.random() * 0.3));
    const lintPassed = completedSubmissions - lintFailed - lintWarning;

    return {
      id: assignment.id,
      title: assignment.title,
      completionRate,
      reviewCompletionRate,
      avgScore,
      avgCommentLength,
      flaggedRate,
      totalSubmissions: completedSubmissions,
      totalReviews: completedReviews,
      plagiarism: { high: plagiarismHigh, medium: plagiarismMedium, low: plagiarismLow },
      linter: { failed: lintFailed, warning: lintWarning, passed: lintPassed },
    };
  });

  // Overall course analytics
  const overallAnalytics = {
    totalAssignments: courseAssignments.length,
    avgCompletionRate:
      assignmentAnalytics.length > 0
        ? assignmentAnalytics.reduce((sum, a) => sum + a.completionRate, 0) /
          assignmentAnalytics.length
        : 0,
    avgReviewCompletionRate:
      assignmentAnalytics.length > 0
        ? assignmentAnalytics.reduce((sum, a) => sum + a.reviewCompletionRate, 0) /
          assignmentAnalytics.length
        : 0,
    avgScore:
      assignmentAnalytics.length > 0
        ? assignmentAnalytics.reduce((sum, a) => sum + a.avgScore, 0) / assignmentAnalytics.length
        : 0,
    avgCommentLength:
      assignmentAnalytics.length > 0
        ? assignmentAnalytics.reduce((sum, a) => sum + a.avgCommentLength, 0) /
          assignmentAnalytics.length
        : 0,
    avgFlaggedRate:
      assignmentAnalytics.length > 0
        ? assignmentAnalytics.reduce((sum, a) => sum + a.flaggedRate, 0) /
          assignmentAnalytics.length
        : 0,
  };

  // Gradebook data
  const generateGradebook = (): GradebookEntry[] => {
    return users.map((student) => {
      const scores: Record<string, number | null> = {};
      let totalScore = 0;
      let gradedAssignments = 0;

      courseAssignments.forEach((assignment) => {
        const submission = submissions.find(
          (s) => s.assignmentId === assignment.id && s.studentId === student.id,
        );

        if (submission && submission.status === "submitted") {
          const studentReviews = reviews.filter((r) => r.submissionId === submission.id);
          if (studentReviews.length > 0) {
            const allScores = studentReviews.flatMap((r) => Object.values(r.scores));
            const avgScore = allScores.reduce((sum, s) => sum + s, 0) / allScores.length;
            scores[assignment.id] = Math.round(avgScore * 10) / 10;
            totalScore += avgScore;
            gradedAssignments++;
          } else {
            scores[assignment.id] = null; // Submitted but not reviewed yet
          }
        } else {
          scores[assignment.id] = null; // Not submitted
        }
      });

      const finalScore = gradedAssignments > 0 ? totalScore / gradedAssignments : 0;

      return {
        studentId: student.id,
        studentName: student.name,
        scores,
        finalScore: Math.round(finalScore * 10) / 10,
      };
    });
  };

  const gradebook = generateGradebook();

  // Chart data
  const completionChartData = assignmentAnalytics.map((a) => ({
    name: a.title.length > 20 ? a.title.substring(0, 20) + "..." : a.title,
    [t("teacher.analytics.submissionsSubmitted")]: Math.round(a.completionRate),
    [t("teacher.analytics.reviewsCompleted")]: Math.round(a.reviewCompletionRate),
  }));

  const scoreDistributionData = [
    { name: "1-2", value: Math.floor(Math.random() * 10) + 5, fill: "var(--error)" },
    { name: "2-3", value: Math.floor(Math.random() * 15) + 10, fill: "var(--warning)" },
    { name: "3-4", value: Math.floor(Math.random() * 25) + 20, fill: "var(--warning)" },
    { name: "4-5", value: Math.floor(Math.random() * 30) + 35, fill: "var(--success)" },
  ];

  // Export functions
  const handleExportCSV = () => {
    const course = courses.find((c) => c.id === effectiveCourse);

    // Build CSV content
    const headers = [
      t("teacher.analytics.csvStudentHeader"),
      ...courseAssignments.map((a) => a.title),
      t("teacher.analytics.csvFinalGrade"),
    ];
    const rows = gradebook.map((entry) => [
      entry.studentName,
      ...courseAssignments.map((a) => entry.scores[a.id]?.toString() || "-"),
      entry.finalScore.toString(),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `gradebook_${course?.title || "course"}_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  const handleExportPDF = () => {
    alert(t("teacher.analytics.pdfExportMsg"));
  };

  const selectedAnalytics =
    selectedAssignment === "all"
      ? null
      : assignmentAnalytics.find((a) => a.id === selectedAssignment);

  return (
    <AppShell title={t("teacher.analytics.title")}>
      <Breadcrumbs items={[{ label: t("teacher.analytics.breadcrumb") }]} />

      <PageHeader title={t("teacher.analytics.title")} subtitle={t("teacher.analytics.subtitle")} />

      <div>
        {/* Course Selector */}
        <div className="bg-card border-2 border-border rounded-[20px] p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-[13px] font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                {t("teacher.analytics.courseLabel")}
              </label>
              <select
                value={effectiveCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full px-4 py-3 border-2 border-border rounded-[12px] text-[15px] text-foreground focus:border-brand-primary focus:outline-none transition-colors"
              >
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title} ({course.code})
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
                className="w-full px-4 py-3 border-2 border-border rounded-[12px] text-[15px] text-foreground focus:border-brand-primary focus:outline-none transition-colors"
              >
                <option value="all">{t("teacher.analytics.allAssignments")}</option>
                {courseAssignments.map((assignment) => (
                  <option key={assignment.id} value={assignment.id}>
                    {assignment.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Overall Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-card border-2 border-border rounded-[12px] p-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-brand-primary" />
              <span className="text-[12px] text-muted-foreground uppercase tracking-wide">
                {t("teacher.analytics.assignmentsCount")}
              </span>
            </div>
            <p className="text-[24px] font-medium text-foreground">
              {overallAnalytics.totalAssignments}
            </p>
          </div>
          <div className="bg-card border-2 border-border rounded-[12px] p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-success" />
              <span className="text-[12px] text-muted-foreground uppercase tracking-wide">
                {t("teacher.analytics.submissionRate")}
              </span>
            </div>
            <p className="text-[24px] font-medium text-foreground">
              {Math.round(overallAnalytics.avgCompletionRate)}%
            </p>
          </div>
          <div className="bg-card border-2 border-border rounded-[12px] p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-brand-primary" />
              <span className="text-[12px] text-muted-foreground uppercase tracking-wide">
                {t("teacher.analytics.avgScore")}
              </span>
            </div>
            <p className="text-[24px] font-medium text-foreground">
              {overallAnalytics.avgScore.toFixed(1)}/5
            </p>
          </div>
          <div className="bg-card border-2 border-border rounded-[12px] p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-brand-primary" />
              <span className="text-[12px] text-muted-foreground uppercase tracking-wide">
                {t("teacher.analytics.studentsCount")}
              </span>
            </div>
            <p className="text-[24px] font-medium text-foreground">{users.length}</p>
          </div>
        </div>

        {/* Assignment Analytics Charts */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Completion Rates */}
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

          {/* Score Distribution */}
          <div className="bg-card border-2 border-border rounded-[20px] p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-brand-primary" />
              <h2 className="text-[18px] font-medium text-foreground">
                {t("teacher.analytics.scoreDistribution")}
              </h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={scoreDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
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
          </div>
        </div>

        {/* Quality Indicators */}
        <div className="bg-card border-2 border-border rounded-[20px] p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="w-5 h-5 text-brand-primary" />
            <h2 className="text-[18px] font-medium text-foreground">
              {t("teacher.analytics.reviewQualityIndicators")}
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-[13px] text-muted-foreground mb-2">
                {t("teacher.analytics.avgCommentLength")}
              </p>
              <p className="text-[28px] font-medium text-foreground">
                {Math.round(overallAnalytics.avgCommentLength)}
              </p>
              <p className="text-[12px] text-muted-foreground">
                {t("teacher.analytics.characters")}
              </p>
            </div>
            <div>
              <p className="text-[13px] text-muted-foreground mb-2">
                {t("teacher.analytics.flaggedReviewPercent")}
              </p>
              <p className="text-[28px] font-medium text-warning">
                {overallAnalytics.avgFlaggedRate.toFixed(1)}%
              </p>
              <p className="text-[12px] text-muted-foreground">
                {t("teacher.analytics.needAttention")}
              </p>
            </div>
            <div>
              <p className="text-[13px] text-muted-foreground mb-2">
                {t("teacher.analytics.reviewCompletion")}
              </p>
              <p className="text-[28px] font-medium text-success">
                {Math.round(overallAnalytics.avgReviewCompletionRate)}%
              </p>
              <p className="text-[12px] text-muted-foreground">
                {t("teacher.analytics.ofExpected")}
              </p>
            </div>
            <div>
              <p className="text-[13px] text-muted-foreground mb-2">
                {t("teacher.analytics.averageScoreLabel")}
              </p>
              <p className="text-[28px] font-medium text-brand-primary">
                {overallAnalytics.avgScore.toFixed(2)}
              </p>
              <p className="text-[12px] text-muted-foreground">{t("teacher.analytics.outOf")}</p>
            </div>
          </div>
        </div>

        {/* Plugin Reports Summary */}
        {selectedAnalytics ? (
          <div className="bg-card border-2 border-border rounded-[20px] p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-brand-primary" />
              <h2 className="text-[18px] font-medium text-foreground">
                {t("teacher.analytics.pluginSummaryFor", { name: selectedAnalytics.title })}
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Plagiarism Summary */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-4 h-4 text-muted-foreground" />
                  <h3 className="text-[15px] font-medium text-foreground">
                    {t("teacher.analytics.plagiarismCheck")}
                  </h3>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-error-light border border-error rounded-[8px]">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-error" />
                      <span className="text-[14px] text-foreground">
                        {t("teacher.analytics.highRisk")}
                      </span>
                    </div>
                    <span className="text-[16px] font-medium text-error">
                      {selectedAnalytics.plagiarism.high}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-warning-light border border-warning rounded-[8px]">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-warning" />
                      <span className="text-[14px] text-foreground">
                        {t("teacher.analytics.mediumRisk")}
                      </span>
                    </div>
                    <span className="text-[16px] font-medium text-warning">
                      {selectedAnalytics.plagiarism.medium}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-success-light border border-success rounded-[8px]">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-success" />
                      <span className="text-[14px] text-foreground">
                        {t("teacher.analytics.lowRisk")}
                      </span>
                    </div>
                    <span className="text-[16px] font-medium text-success">
                      {selectedAnalytics.plagiarism.low}
                    </span>
                  </div>
                </div>
              </div>

              {/* Linter Summary */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Code className="w-4 h-4 text-muted-foreground" />
                  <h3 className="text-[15px] font-medium text-foreground">
                    {t("teacher.analytics.codeCheck")}
                  </h3>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-error-light border border-error rounded-[8px]">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-error" />
                      <span className="text-[14px] text-foreground">
                        {t("teacher.analytics.errors")}
                      </span>
                    </div>
                    <span className="text-[16px] font-medium text-error">
                      {selectedAnalytics.linter.failed}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-warning-light border border-warning rounded-[8px]">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-warning" />
                      <span className="text-[14px] text-foreground">
                        {t("teacher.analytics.warnings")}
                      </span>
                    </div>
                    <span className="text-[16px] font-medium text-warning">
                      {selectedAnalytics.linter.warning}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-success-light border border-success rounded-[8px]">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-success" />
                      <span className="text-[14px] text-foreground">
                        {t("teacher.analytics.noErrors")}
                      </span>
                    </div>
                    <span className="text-[16px] font-medium text-success">
                      {selectedAnalytics.linter.passed}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-card border-2 border-border rounded-[20px] p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-brand-primary" />
              <h2 className="text-[18px] font-medium text-foreground">
                {t("teacher.analytics.pluginSummary")}
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {assignmentAnalytics.slice(0, 4).map((analytics) => (
                <div key={analytics.id} className="p-4 border-2 border-border rounded-[12px]">
                  <h3 className="text-[14px] font-medium text-foreground mb-3">
                    {analytics.title}
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-[12px]">
                    <div>
                      <p className="text-muted-foreground mb-1">
                        {t("teacher.analytics.plagiarismHigh")}
                      </p>
                      <p className="text-[16px] font-medium text-error">
                        {analytics.plagiarism.high}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">
                        {t("teacher.analytics.linterErrors")}
                      </p>
                      <p className="text-[16px] font-medium text-error">
                        {analytics.linter.failed}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Gradebook */}
        <div className="bg-card border-2 border-border rounded-[20px] p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-brand-primary" />
              <h2 className="text-[18px] font-medium text-foreground">
                {t("teacher.analytics.gradebook")}
              </h2>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-2 px-4 py-2 bg-success text-primary-foreground rounded-[12px] hover:bg-success transition-colors text-[14px]"
              >
                <Download className="w-4 h-4" />
                {t("teacher.analytics.exportCSV")}
              </button>
              <button
                onClick={handleExportPDF}
                className="flex items-center gap-2 px-4 py-2 border-2 border-brand-primary text-brand-primary rounded-[12px] hover:bg-info-light transition-colors text-[14px]"
              >
                <Download className="w-4 h-4" />
                {t("teacher.analytics.exportPDF")}
              </button>
            </div>
          </div>

          {/* Gradebook Table */}
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
                        ? assignment.title.substring(0, 15) + "..."
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
                    className={`border-b border-border hover:bg-surface-hover transition-colors ${
                      index % 2 === 0 ? "bg-card" : "bg-muted"
                    }`}
                  >
                    <td className="p-3 text-[14px] text-foreground font-medium sticky left-0 bg-inherit">
                      {entry.studentName}
                    </td>
                    {courseAssignments.map((assignment) => {
                      const score = entry.scores[assignment.id];
                      return (
                        <td key={assignment.id} className="p-3 text-center">
                          {score !== null ? (
                            <span
                              className={`inline-flex items-center justify-center w-12 h-8 rounded-[6px] text-[14px] font-medium ${
                                score >= 4
                                  ? "bg-success-light text-success"
                                  : score >= 3
                                    ? "bg-warning-light text-warning"
                                    : "bg-error-light text-error"
                              }`}
                            >
                              {score.toFixed(1)}
                            </span>
                          ) : (
                            <span className="text-text-tertiary text-[14px]">—</span>
                          )}
                        </td>
                      );
                    })}
                    <td className="p-3 text-center bg-muted">
                      <span
                        className={`inline-flex items-center justify-center w-14 h-9 rounded-[8px] text-[15px] font-medium ${
                          entry.finalScore >= 4
                            ? "bg-success text-primary-foreground"
                            : entry.finalScore >= 3
                              ? "bg-warning text-primary-foreground"
                              : entry.finalScore > 0
                                ? "bg-destructive text-primary-foreground"
                                : "bg-border text-muted-foreground"
                        }`}
                      >
                        {entry.finalScore > 0 ? entry.finalScore.toFixed(1) : "—"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {gradebook.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-text-tertiary mx-auto mb-3" />
              <h3 className="text-[18px] font-medium text-foreground mb-2">
                {t("teacher.analytics.noGradebookData")}
              </h3>
              <p className="text-[14px] text-muted-foreground">
                {t("teacher.analytics.selectCourseWithData")}
              </p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
