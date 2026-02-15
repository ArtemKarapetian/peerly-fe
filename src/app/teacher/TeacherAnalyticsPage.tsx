import { useState } from "react";
import { AppShell } from "@/widgets/app-shell/AppShell.tsx";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs.tsx";
import { ROUTES } from "@/shared/config/routes.ts";
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
import { demoDataStore } from "@/app/stores/demoDataStore";
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
  const courses = demoDataStore.getCourses();
  const assignments = demoDataStore.getAssignments();
  const submissions = demoDataStore.getSubmissions();
  const reviews = demoDataStore.getReviews();
  const users = demoDataStore.getUsers().filter((u) => u.role === "Student");

  const [selectedCourse, setSelectedCourse] = useState<string>(courses[0]?.id || "");
  const [selectedAssignment, setSelectedAssignment] = useState<string>("all");

  // Generate analytics data
  const courseAssignments = assignments.filter((a) =>
    courses.find((c) => c.id === selectedCourse)?.assignmentIds?.includes(a.id),
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
    "Сдано работ": Math.round(a.completionRate),
    "Завершено рецензий": Math.round(a.reviewCompletionRate),
  }));

  const scoreDistributionData = [
    { name: "1-2", value: Math.floor(Math.random() * 10) + 5, fill: "#d4183d" },
    { name: "2-3", value: Math.floor(Math.random() * 15) + 10, fill: "#ff9800" },
    { name: "3-4", value: Math.floor(Math.random() * 25) + 20, fill: "#f59e0b" },
    { name: "4-5", value: Math.floor(Math.random() * 30) + 35, fill: "#4caf50" },
  ];

  // Export functions
  const handleExportCSV = () => {
    const course = courses.find((c) => c.id === selectedCourse);

    // Build CSV content
    const headers = ["Студент", ...courseAssignments.map((a) => a.title), "Итоговая оценка"];
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
    alert("PDF экспорт: Файл будет подготовлен и отправлен на вашу почту");
  };

  const selectedAnalytics =
    selectedAssignment === "all"
      ? null
      : assignmentAnalytics.find((a) => a.id === selectedAssignment);

  return (
    <AppShell title="Отчёты и аналитика">
      <Breadcrumbs
        items={[
          { label: "Дашборд преподавателя", href: ROUTES.teacherDashboard },
          { label: "Аналитика" },
        ]}
      />

      <div className="mt-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-[32px] font-medium text-[#21214f] tracking-[-0.5px] mb-2">
            Отчёты и аналитика
          </h1>
          <p className="text-[16px] text-[#767692]">
            Анализ успеваемости и качества рецензирования
          </p>
        </div>

        {/* Course Selector */}
        <div className="bg-white border-2 border-[#e6e8ee] rounded-[20px] p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-[13px] font-medium text-[#767692] mb-2 uppercase tracking-wide">
                Курс
              </label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full px-4 py-3 border-2 border-[#e6e8ee] rounded-[12px] text-[15px] text-[#21214f] focus:border-[#5b8def] focus:outline-none transition-colors"
              >
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title} ({course.code})
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-[13px] font-medium text-[#767692] mb-2 uppercase tracking-wide">
                Задание
              </label>
              <select
                value={selectedAssignment}
                onChange={(e) => setSelectedAssignment(e.target.value)}
                className="w-full px-4 py-3 border-2 border-[#e6e8ee] rounded-[12px] text-[15px] text-[#21214f] focus:border-[#5b8def] focus:outline-none transition-colors"
              >
                <option value="all">Все задания (общая аналитика)</option>
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
          <div className="bg-white border-2 border-[#e6e8ee] rounded-[12px] p-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-[#5b8def]" />
              <span className="text-[12px] text-[#767692] uppercase tracking-wide">Заданий</span>
            </div>
            <p className="text-[24px] font-medium text-[#21214f]">
              {overallAnalytics.totalAssignments}
            </p>
          </div>
          <div className="bg-white border-2 border-[#e6e8ee] rounded-[12px] p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-[#4caf50]" />
              <span className="text-[12px] text-[#767692] uppercase tracking-wide">
                Сдача работ
              </span>
            </div>
            <p className="text-[24px] font-medium text-[#21214f]">
              {Math.round(overallAnalytics.avgCompletionRate)}%
            </p>
          </div>
          <div className="bg-white border-2 border-[#e6e8ee] rounded-[12px] p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-[#5b8def]" />
              <span className="text-[12px] text-[#767692] uppercase tracking-wide">Ср. оценка</span>
            </div>
            <p className="text-[24px] font-medium text-[#21214f]">
              {overallAnalytics.avgScore.toFixed(1)}/5
            </p>
          </div>
          <div className="bg-white border-2 border-[#e6e8ee] rounded-[12px] p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-[#5b8def]" />
              <span className="text-[12px] text-[#767692] uppercase tracking-wide">Студентов</span>
            </div>
            <p className="text-[24px] font-medium text-[#21214f]">{users.length}</p>
          </div>
        </div>

        {/* Assignment Analytics Charts */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Completion Rates */}
          <div className="bg-white border-2 border-[#e6e8ee] rounded-[20px] p-6">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-[#5b8def]" />
              <h2 className="text-[18px] font-medium text-[#21214f]">Завершённость по заданиям</h2>
            </div>
            {completionChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={completionChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e6e8ee" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "#767692", fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis tick={{ fill: "#767692", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "2px solid #e6e8ee",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="Сдано работ" fill="#5b8def" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="Завершено рецензий" fill="#4caf50" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-[#767692]">
                Нет данных для отображения
              </div>
            )}
          </div>

          {/* Score Distribution */}
          <div className="bg-white border-2 border-[#e6e8ee] rounded-[20px] p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-[#5b8def]" />
              <h2 className="text-[18px] font-medium text-[#21214f]">Распределение оценок</h2>
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
        <div className="bg-white border-2 border-[#e6e8ee] rounded-[20px] p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="w-5 h-5 text-[#5b8def]" />
            <h2 className="text-[18px] font-medium text-[#21214f]">Индикаторы качества рецензий</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-[13px] text-[#767692] mb-2">Средняя длина комментария</p>
              <p className="text-[28px] font-medium text-[#21214f]">
                {Math.round(overallAnalytics.avgCommentLength)}
              </p>
              <p className="text-[12px] text-[#767692]">символов</p>
            </div>
            <div>
              <p className="text-[13px] text-[#767692] mb-2">Процент помеченных рецензий</p>
              <p className="text-[28px] font-medium text-[#ff9800]">
                {overallAnalytics.avgFlaggedRate.toFixed(1)}%
              </p>
              <p className="text-[12px] text-[#767692]">требуют внимания</p>
            </div>
            <div>
              <p className="text-[13px] text-[#767692] mb-2">Завершённость рецензий</p>
              <p className="text-[28px] font-medium text-[#4caf50]">
                {Math.round(overallAnalytics.avgReviewCompletionRate)}%
              </p>
              <p className="text-[12px] text-[#767692]">от ожидаемых</p>
            </div>
            <div>
              <p className="text-[13px] text-[#767692] mb-2">Средний балл</p>
              <p className="text-[28px] font-medium text-[#5b8def]">
                {overallAnalytics.avgScore.toFixed(2)}
              </p>
              <p className="text-[12px] text-[#767692]">из 5.00</p>
            </div>
          </div>
        </div>

        {/* Plugin Reports Summary */}
        {selectedAnalytics ? (
          <div className="bg-white border-2 border-[#e6e8ee] rounded-[20px] p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-[#5b8def]" />
              <h2 className="text-[18px] font-medium text-[#21214f]">
                Сводка по плагинам: {selectedAnalytics.title}
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Plagiarism Summary */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-4 h-4 text-[#767692]" />
                  <h3 className="text-[15px] font-medium text-[#21214f]">Проверка плагиата</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-[#fff5f5] border border-[#d4183d] rounded-[8px]">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-[#d4183d]" />
                      <span className="text-[14px] text-[#21214f]">Высокий риск</span>
                    </div>
                    <span className="text-[16px] font-medium text-[#d4183d]">
                      {selectedAnalytics.plagiarism.high}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#fff4e5] border border-[#ff9800] rounded-[8px]">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-[#ff9800]" />
                      <span className="text-[14px] text-[#21214f]">Средний риск</span>
                    </div>
                    <span className="text-[16px] font-medium text-[#ff9800]">
                      {selectedAnalytics.plagiarism.medium}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#e8f5e9] border border-[#4caf50] rounded-[8px]">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-[#4caf50]" />
                      <span className="text-[14px] text-[#21214f]">Низкий риск</span>
                    </div>
                    <span className="text-[16px] font-medium text-[#4caf50]">
                      {selectedAnalytics.plagiarism.low}
                    </span>
                  </div>
                </div>
              </div>

              {/* Linter Summary */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Code className="w-4 h-4 text-[#767692]" />
                  <h3 className="text-[15px] font-medium text-[#21214f]">Проверка кода (линтер)</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-[#fff5f5] border border-[#d4183d] rounded-[8px]">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-[#d4183d]" />
                      <span className="text-[14px] text-[#21214f]">Ошибки</span>
                    </div>
                    <span className="text-[16px] font-medium text-[#d4183d]">
                      {selectedAnalytics.linter.failed}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#fff4e5] border border-[#ff9800] rounded-[8px]">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-[#ff9800]" />
                      <span className="text-[14px] text-[#21214f]">Предупреждения</span>
                    </div>
                    <span className="text-[16px] font-medium text-[#ff9800]">
                      {selectedAnalytics.linter.warning}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#e8f5e9] border border-[#4caf50] rounded-[8px]">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-[#4caf50]" />
                      <span className="text-[14px] text-[#21214f]">Без ошибок</span>
                    </div>
                    <span className="text-[16px] font-medium text-[#4caf50]">
                      {selectedAnalytics.linter.passed}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white border-2 border-[#e6e8ee] rounded-[20px] p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-[#5b8def]" />
              <h2 className="text-[18px] font-medium text-[#21214f]">Сводка по плагинам</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {assignmentAnalytics.slice(0, 4).map((analytics) => (
                <div key={analytics.id} className="p-4 border-2 border-[#e6e8ee] rounded-[12px]">
                  <h3 className="text-[14px] font-medium text-[#21214f] mb-3">{analytics.title}</h3>
                  <div className="grid grid-cols-2 gap-3 text-[12px]">
                    <div>
                      <p className="text-[#767692] mb-1">Плагиат (высокий)</p>
                      <p className="text-[16px] font-medium text-[#d4183d]">
                        {analytics.plagiarism.high}
                      </p>
                    </div>
                    <div>
                      <p className="text-[#767692] mb-1">Линтер (ошибки)</p>
                      <p className="text-[16px] font-medium text-[#d4183d]">
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
        <div className="bg-white border-2 border-[#e6e8ee] rounded-[20px] p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#5b8def]" />
              <h2 className="text-[18px] font-medium text-[#21214f]">Журнал оценок</h2>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-2 px-4 py-2 bg-[#4caf50] text-white rounded-[12px] hover:bg-[#45a049] transition-colors text-[14px]"
              >
                <Download className="w-4 h-4" />
                Экспорт CSV
              </button>
              <button
                onClick={handleExportPDF}
                className="flex items-center gap-2 px-4 py-2 border-2 border-[#5b8def] text-[#5b8def] rounded-[12px] hover:bg-[#e9f5ff] transition-colors text-[14px]"
              >
                <Download className="w-4 h-4" />
                Экспорт PDF
              </button>
            </div>
          </div>

          {/* Gradebook Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-[#e6e8ee]">
                  <th className="text-left p-3 text-[13px] font-medium text-[#767692] uppercase tracking-wide sticky left-0 bg-white">
                    Студент
                  </th>
                  {courseAssignments.map((assignment) => (
                    <th
                      key={assignment.id}
                      className="text-center p-3 text-[13px] font-medium text-[#767692] uppercase tracking-wide min-w-[100px]"
                      title={assignment.title}
                    >
                      {assignment.title.length > 15
                        ? assignment.title.substring(0, 15) + "..."
                        : assignment.title}
                    </th>
                  ))}
                  <th className="text-center p-3 text-[13px] font-medium text-[#767692] uppercase tracking-wide bg-[#f9f9f9] min-w-[100px]">
                    Итоговая
                  </th>
                </tr>
              </thead>
              <tbody>
                {gradebook.map((entry, index) => (
                  <tr
                    key={entry.studentId}
                    className={`border-b border-[#e6e8ee] hover:bg-[#fafbfc] transition-colors ${
                      index % 2 === 0 ? "bg-white" : "bg-[#f9f9f9]"
                    }`}
                  >
                    <td className="p-3 text-[14px] text-[#21214f] font-medium sticky left-0 bg-inherit">
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
                                  ? "bg-[#e8f5e9] text-[#4caf50]"
                                  : score >= 3
                                    ? "bg-[#fff4e5] text-[#ff9800]"
                                    : "bg-[#fff5f5] text-[#d4183d]"
                              }`}
                            >
                              {score.toFixed(1)}
                            </span>
                          ) : (
                            <span className="text-[#d7d7d7] text-[14px]">—</span>
                          )}
                        </td>
                      );
                    })}
                    <td className="p-3 text-center bg-[#f9f9f9]">
                      <span
                        className={`inline-flex items-center justify-center w-14 h-9 rounded-[8px] text-[15px] font-medium ${
                          entry.finalScore >= 4
                            ? "bg-[#4caf50] text-white"
                            : entry.finalScore >= 3
                              ? "bg-[#ff9800] text-white"
                              : entry.finalScore > 0
                                ? "bg-[#d4183d] text-white"
                                : "bg-[#e6e8ee] text-[#767692]"
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
              <FileText className="w-12 h-12 text-[#d7d7d7] mx-auto mb-3" />
              <h3 className="text-[18px] font-medium text-[#21214f] mb-2">
                Нет данных для журнала
              </h3>
              <p className="text-[14px] text-[#767692]">
                Выберите курс с заданиями и работами студентов
              </p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
