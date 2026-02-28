import { useState } from "react";
import { AppShell } from "@/widgets/app-shell/AppShell.tsx";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs.tsx";
import { ROUTES } from "@/shared/config/routes.ts";
import {
  GitBranch,
  UserPlus,
  Lock,
  Unlock,
  Bell,
  X,
  Clock,
  AlertCircle,
  CheckCircle,
  EyeOff,
  MoreVertical,
} from "lucide-react";
import { courseRepo } from "@/entities/course";
import { userRepo } from "@/entities/user";
import { workRepo } from "@/entities/work";
import { reviewRepo } from "@/entities/review";
import { assignmentRepo } from "@/entities/assignment";

/**
 * TeacherDistributionPage - Распределение рецензий
 *
 * Управление распределением рецензий:
 * - Фильтрация по курсу и заданию
 * - Таблица с информацией о распределении
 * - Ручные действия: переназначение, добавление рецензента, блокировка, напоминание
 * - Детальный просмотр распределения в drawer
 */

interface DistributionRow {
  id: string;
  submissionId: string;
  anonymousId: string;
  authorName: string;
  isAnonymous: boolean;
  assignedReviewers: Array<{
    id: string;
    name: string;
    status: "pending" | "draft" | "submitted";
  }>;
  overallStatus: "not-started" | "in-progress" | "completed";
  lastActivity: Date;
  isLocked: boolean;
}

interface DistributionHistory {
  id: string;
  action: string;
  performedBy: string;
  timestamp: Date;
  details: string;
}

export default function TeacherDistributionPage() {
  const courses = courseRepo.getAll();
  const users = userRepo.getAll();
  const submissions = workRepo.getAll();
  const reviews = reviewRepo.getAll();

  const [selectedCourse, setSelectedCourse] = useState<string>(courses[0]?.id || "");
  const [selectedAssignment, setSelectedAssignment] = useState<string>("");
  const [selectedDistribution, setSelectedDistribution] = useState<DistributionRow | null>(null);
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [showAddReviewerModal, setShowAddReviewerModal] = useState(false);
  const [activeRowAction, setActiveRowAction] = useState<string | null>(null);

  // Get assignments for selected course
  const assignments = selectedCourse ? assignmentRepo.getByCourse(selectedCourse) : [];

  // Generate distribution data
  const generateDistributions = (): DistributionRow[] => {
    if (!selectedAssignment) return [];

    const assignmentSubmissions = submissions.filter((s) => s.assignmentId === selectedAssignment);

    return assignmentSubmissions.map((submission, idx) => {
      const author = users.find((u) => u.id === submission.studentId);
      const submissionReviews = reviews.filter((r) => r.submissionId === submission.id);

      const assignedReviewers = submissionReviews.map((review) => {
        const reviewer = users.find((u) => u.id === review.reviewerId);
        return {
          id: review.reviewerId,
          name: reviewer?.name || "Unknown",
          status: review.status,
        };
      });

      const completedReviews = assignedReviewers.filter((r) => r.status === "submitted").length;
      let overallStatus: "not-started" | "in-progress" | "completed" = "not-started";
      if (completedReviews === assignedReviewers.length && assignedReviewers.length > 0) {
        overallStatus = "completed";
      } else if (completedReviews > 0) {
        overallStatus = "in-progress";
      }

      return {
        id: `dist-${submission.id}`,
        submissionId: submission.id,
        anonymousId: `SUB-${String(idx + 1).padStart(3, "0")}`,
        authorName: author?.name || "Unknown",
        isAnonymous: Math.random() > 0.5, // Demo: random anonymity
        assignedReviewers,
        overallStatus,
        lastActivity: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        isLocked: Math.random() > 0.8, // Demo: some are locked
      };
    });
  };

  const distributions = generateDistributions();

  const getStatusBadge = (status: "not-started" | "in-progress" | "completed") => {
    switch (status) {
      case "completed":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#e8f5e9] text-[#4caf50] rounded-[6px] text-[12px] font-medium">
            <CheckCircle className="w-3 h-3" />
            Завершено
          </span>
        );
      case "in-progress":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#fff4e5] text-[#ff9800] rounded-[6px] text-[12px] font-medium">
            <Clock className="w-3 h-3" />В процессе
          </span>
        );
      case "not-started":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#f5f5f5] text-[#767692] rounded-[6px] text-[12px] font-medium">
            <AlertCircle className="w-3 h-3" />
            Не начато
          </span>
        );
    }
  };

  const getReviewerStatusBadge = (status: "pending" | "draft" | "submitted") => {
    switch (status) {
      case "submitted":
        return (
          <span className="inline-flex px-1.5 py-0.5 bg-[#e8f5e9] text-[#4caf50] rounded-[4px] text-[11px] font-medium">
            ✓
          </span>
        );
      case "draft":
        return (
          <span className="inline-flex px-1.5 py-0.5 bg-[#fff4e5] text-[#ff9800] rounded-[4px] text-[11px] font-medium">
            ⋯
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex px-1.5 py-0.5 bg-[#f5f5f5] text-[#767692] rounded-[4px] text-[11px] font-medium">
            ○
          </span>
        );
    }
  };

  const handleReassignReviewer = (distributionId: string) => {
    const dist = distributions.find((d) => d.id === distributionId);
    setSelectedDistribution(dist || null);
    setShowReassignModal(true);
    setActiveRowAction(null);
  };

  const handleAddReviewer = (distributionId: string) => {
    const dist = distributions.find((d) => d.id === distributionId);
    setSelectedDistribution(dist || null);
    setShowAddReviewerModal(true);
    setActiveRowAction(null);
  };

  const handleToggleLock = (distributionId: string) => {
    alert(`Toggle lock for ${distributionId}`);
    setActiveRowAction(null);
  };

  const handleNudgeReviewer = (distributionId: string) => {
    alert(`Напоминание отправлено рецензентам для ${distributionId}`);
    setActiveRowAction(null);
  };

  const handleRowClick = (distribution: DistributionRow) => {
    setSelectedDistribution(distribution);
  };

  // Demo history with fixed dates
  const mockHistory: DistributionHistory[] = [
    {
      id: "h1",
      action: "Распределение создано",
      performedBy: "Система (автоматически)",
      timestamp: new Date("2024-02-10"),
      details: "Автоматическое распределение на основе алгоритма round-robin",
    },
    {
      id: "h2",
      action: "Рецензент назначен",
      performedBy: "Иванов П.С.",
      timestamp: new Date("2024-02-11"),
      details: "Добавлен дополнительный рецензент вручную",
    },
    {
      id: "h3",
      action: "Напоминание отправлено",
      performedBy: "Иванов П.С.",
      timestamp: new Date("2024-02-13"),
      details: "Уведомление отправлено рецензентам",
    },
    {
      id: "h4",
      action: "Рецензия отправлена",
      performedBy: "Студент #1",
      timestamp: new Date("2024-02-14"),
      details: "Рецензия успешно отправлена",
    },
  ];

  return (
    <AppShell title="Распределение рецензий">
      <Breadcrumbs
        items={[
          { label: "Дашборд преподавателя", href: ROUTES.teacherDashboard },
          { label: "Распределение" },
        ]}
      />

      <div className="mt-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-[32px] font-medium text-[#21214f] tracking-[-0.5px] mb-2">
            Распределение рецензий
          </h1>
          <p className="text-[16px] text-[#767692]">
            Управление распределением peer-review между студентами
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white border-2 border-[#e6e8ee] rounded-[20px] p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Course Filter */}
            <div>
              <label className="block text-[13px] font-medium text-[#767692] mb-2 uppercase tracking-wide">
                Курс
              </label>
              <select
                value={selectedCourse}
                onChange={(e) => {
                  setSelectedCourse(e.target.value);
                  setSelectedAssignment("");
                }}
                className="w-full px-4 py-3 border-2 border-[#e6e8ee] rounded-[12px] text-[15px] text-[#21214f] focus:border-[#5b8def] focus:outline-none transition-colors"
              >
                <option value="">Выберите курс</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name} ({course.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Assignment Filter */}
            <div>
              <label className="block text-[13px] font-medium text-[#767692] mb-2 uppercase tracking-wide">
                Задание
              </label>
              <select
                value={selectedAssignment}
                onChange={(e) => setSelectedAssignment(e.target.value)}
                disabled={!selectedCourse}
                className="w-full px-4 py-3 border-2 border-[#e6e8ee] rounded-[12px] text-[15px] text-[#21214f] focus:border-[#5b8def] focus:outline-none transition-colors disabled:bg-[#f5f5f5] disabled:cursor-not-allowed"
              >
                <option value="">Выберите задание</option>
                {assignments.map((assignment) => (
                  <option key={assignment.id} value={assignment.id}>
                    {assignment.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Distribution Table / Cards */}
        {selectedAssignment ? (
          <>
            {/* Desktop/Tablet Table (≥800px) */}
            <div className="hidden md:block bg-white border-2 border-[#e6e8ee] rounded-[20px] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-[#e6e8ee]">
                      <th className="text-left px-6 py-4 text-[13px] font-medium text-[#767692] uppercase tracking-wide">
                        Работа
                      </th>
                      <th className="text-left px-6 py-4 text-[13px] font-medium text-[#767692] uppercase tracking-wide">
                        Автор
                      </th>
                      <th className="text-left px-6 py-4 text-[13px] font-medium text-[#767692] uppercase tracking-wide">
                        Назначенные рецензенты
                      </th>
                      <th className="text-left px-6 py-4 text-[13px] font-medium text-[#767692] uppercase tracking-wide">
                        Статус
                      </th>
                      <th className="text-left px-6 py-4 text-[13px] font-medium text-[#767692] uppercase tracking-wide">
                        Активность
                      </th>
                      <th className="text-right px-6 py-4 text-[13px] font-medium text-[#767692] uppercase tracking-wide">
                        Действия
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {distributions.map((dist, index) => (
                      <tr
                        key={dist.id}
                        className={`
                          border-b border-[#e6e8ee] last:border-0 hover:bg-[#e9f5ff] transition-colors cursor-pointer
                          ${index % 2 === 0 ? "bg-white" : "bg-[#fafbfc]"}
                        `}
                        onClick={() => handleRowClick(dist)}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="text-[15px] font-medium text-[#21214f]">
                              {dist.anonymousId}
                            </span>
                            {dist.isLocked && <Lock className="w-4 h-4 text-[#d4183d]" />}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {dist.isAnonymous ? (
                              <>
                                <EyeOff className="w-4 h-4 text-[#767692]" />
                                <span className="text-[14px] text-[#767692] italic">Скрыто</span>
                              </>
                            ) : (
                              <span className="text-[14px] text-[#21214f]">{dist.authorName}</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-2">
                            {dist.assignedReviewers.map((reviewer) => (
                              <div key={reviewer.id} className="flex items-center gap-1">
                                <span className="text-[13px] text-[#21214f]">{reviewer.name}</span>
                                {getReviewerStatusBadge(reviewer.status)}
                              </div>
                            ))}
                            {dist.assignedReviewers.length === 0 && (
                              <span className="text-[13px] text-[#767692] italic">
                                Нет рецензентов
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">{getStatusBadge(dist.overallStatus)}</td>
                        <td className="px-6 py-4">
                          <span className="text-[13px] text-[#767692]">
                            {dist.lastActivity.toLocaleDateString("ru-RU")}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2 relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveRowAction(activeRowAction === dist.id ? null : dist.id);
                              }}
                              className="p-2 hover:bg-[#e9f5ff] rounded-[8px] transition-colors"
                              title="Действия"
                            >
                              <MoreVertical className="w-4 h-4 text-[#767692]" />
                            </button>

                            {/* Actions Dropdown */}
                            {activeRowAction === dist.id && (
                              <div
                                className="absolute right-0 top-full mt-1 bg-white border-2 border-[#e6e8ee] rounded-[12px] shadow-lg z-10 min-w-[200px]"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button
                                  onClick={() => handleReassignReviewer(dist.id)}
                                  className="w-full flex items-center gap-2 px-4 py-3 hover:bg-[#f9f9f9] text-left transition-colors first:rounded-t-[10px]"
                                >
                                  <GitBranch className="w-4 h-4 text-[#5b8def]" />
                                  <span className="text-[14px] text-[#21214f]">Переназначить</span>
                                </button>
                                <button
                                  onClick={() => handleAddReviewer(dist.id)}
                                  className="w-full flex items-center gap-2 px-4 py-3 hover:bg-[#f9f9f9] text-left transition-colors border-t border-[#e6e8ee]"
                                >
                                  <UserPlus className="w-4 h-4 text-[#4caf50]" />
                                  <span className="text-[14px] text-[#21214f]">
                                    Добавить рецензента
                                  </span>
                                </button>
                                <button
                                  onClick={() => handleToggleLock(dist.id)}
                                  className="w-full flex items-center gap-2 px-4 py-3 hover:bg-[#f9f9f9] text-left transition-colors border-t border-[#e6e8ee]"
                                >
                                  {dist.isLocked ? (
                                    <>
                                      <Unlock className="w-4 h-4 text-[#ff9800]" />
                                      <span className="text-[14px] text-[#21214f]">
                                        Разблокировать
                                      </span>
                                    </>
                                  ) : (
                                    <>
                                      <Lock className="w-4 h-4 text-[#d4183d]" />
                                      <span className="text-[14px] text-[#21214f]">
                                        Заблокировать
                                      </span>
                                    </>
                                  )}
                                </button>
                                <button
                                  onClick={() => handleNudgeReviewer(dist.id)}
                                  className="w-full flex items-center gap-2 px-4 py-3 hover:bg-[#f9f9f9] text-left transition-colors border-t border-[#e6e8ee] last:rounded-b-[10px]"
                                >
                                  <Bell className="w-4 h-4 text-[#5b8def]" />
                                  <span className="text-[14px] text-[#21214f]">Напомнить</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {distributions.length === 0 && (
                <div className="text-center py-12">
                  <GitBranch className="w-12 h-12 text-[#d7d7d7] mx-auto mb-3" />
                  <p className="text-[15px] text-[#767692]">Нет данных о распределении</p>
                </div>
              )}
            </div>

            {/* Mobile Cards (<800px) */}
            <div className="block md:hidden space-y-3">
              {distributions.map((dist) => (
                <div
                  key={dist.id}
                  className="bg-white border-2 border-[#e6e8ee] rounded-[20px] p-4 hover:border-[#5b8def] transition-colors cursor-pointer"
                  onClick={() => handleRowClick(dist)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[16px] font-medium text-[#21214f]">
                        {dist.anonymousId}
                      </span>
                      {dist.isLocked && <Lock className="w-4 h-4 text-[#d4183d]" />}
                    </div>
                    {getStatusBadge(dist.overallStatus)}
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-2 text-[13px]">
                      <span className="text-[#767692]">Автор:</span>
                      {dist.isAnonymous ? (
                        <span className="text-[#767692] italic flex items-center gap-1">
                          <EyeOff className="w-3 h-3" />
                          Скрыто
                        </span>
                      ) : (
                        <span className="text-[#21214f]">{dist.authorName}</span>
                      )}
                    </div>

                    <div>
                      <span className="text-[13px] text-[#767692] block mb-1">Рецензенты:</span>
                      <div className="flex flex-wrap gap-2">
                        {dist.assignedReviewers.map((reviewer) => (
                          <div key={reviewer.id} className="flex items-center gap-1 text-[12px]">
                            <span className="text-[#21214f]">{reviewer.name}</span>
                            {getReviewerStatusBadge(reviewer.status)}
                          </div>
                        ))}
                        {dist.assignedReviewers.length === 0 && (
                          <span className="text-[12px] text-[#767692] italic">Нет рецензентов</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-[13px]">
                      <Clock className="w-3 h-3 text-[#767692]" />
                      <span className="text-[#767692]">
                        {dist.lastActivity.toLocaleDateString("ru-RU")}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-[#e6e8ee]">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReassignReviewer(dist.id);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#f9f9f9] hover:bg-[#e9f5ff] rounded-[8px] transition-colors text-[13px] text-[#21214f]"
                    >
                      <GitBranch className="w-4 h-4" />
                      Переназначить
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddReviewer(dist.id);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#f9f9f9] hover:bg-[#e9f5ff] rounded-[8px] transition-colors text-[13px] text-[#21214f]"
                    >
                      <UserPlus className="w-4 h-4" />
                      Добавить
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveRowAction(activeRowAction === dist.id ? null : dist.id);
                      }}
                      className="px-3 py-2 bg-[#f9f9f9] hover:bg-[#e9f5ff] rounded-[8px] transition-colors"
                    >
                      <MoreVertical className="w-4 h-4 text-[#767692]" />
                    </button>
                  </div>

                  {/* Mobile Actions Menu */}
                  {activeRowAction === dist.id && (
                    <div className="mt-3 pt-3 border-t border-[#e6e8ee] space-y-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleLock(dist.id);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 hover:bg-[#f9f9f9] rounded-[8px] transition-colors text-[13px] text-[#21214f]"
                      >
                        {dist.isLocked ? (
                          <>
                            <Unlock className="w-4 h-4 text-[#ff9800]" />
                            Разблокировать
                          </>
                        ) : (
                          <>
                            <Lock className="w-4 h-4 text-[#d4183d]" />
                            Заблокировать
                          </>
                        )}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNudgeReviewer(dist.id);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 hover:bg-[#f9f9f9] rounded-[8px] transition-colors text-[13px] text-[#21214f]"
                      >
                        <Bell className="w-4 h-4 text-[#5b8def]" />
                        Напомнить рецензентам
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {distributions.length === 0 && (
                <div className="bg-white border-2 border-[#e6e8ee] rounded-[20px] p-12 text-center">
                  <GitBranch className="w-12 h-12 text-[#d7d7d7] mx-auto mb-3" />
                  <p className="text-[15px] text-[#767692]">Нет данных о распределении</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="bg-white border-2 border-[#e6e8ee] rounded-[20px] p-12 text-center">
            <GitBranch className="w-12 h-12 text-[#d7d7d7] mx-auto mb-3" />
            <p className="text-[15px] text-[#767692]">
              Выберите курс и задание для просмотра распределения
            </p>
          </div>
        )}
      </div>

      {/* Distribution Detail Drawer */}
      {selectedDistribution && (
        <div
          className="fixed inset-0 bg-black/30 z-50 flex items-center justify-end"
          onClick={() => setSelectedDistribution(null)}
        >
          <div
            className="bg-white h-full w-full md:w-[600px] shadow-2xl overflow-y-auto animate-slide-in-right"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="sticky top-0 bg-white border-b-2 border-[#e6e8ee] px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h2 className="text-[20px] font-medium text-[#21214f]">
                  {selectedDistribution.anonymousId}
                </h2>
                <p className="text-[13px] text-[#767692] mt-1">Детали распределения</p>
              </div>
              <button
                onClick={() => setSelectedDistribution(null)}
                className="p-2 hover:bg-[#f9f9f9] rounded-[8px] transition-colors"
              >
                <X className="w-5 h-5 text-[#767692]" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="p-6 space-y-6">
              {/* Summary Card */}
              <div className="bg-[#f9f9f9] border-2 border-[#e6e8ee] rounded-[12px] p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[12px] text-[#767692] uppercase tracking-wide mb-1">
                      Работа
                    </p>
                    <p className="text-[15px] font-medium text-[#21214f]">
                      {selectedDistribution.anonymousId}
                    </p>
                  </div>
                  <div>
                    <p className="text-[12px] text-[#767692] uppercase tracking-wide mb-1">
                      Статус
                    </p>
                    {getStatusBadge(selectedDistribution.overallStatus)}
                  </div>
                  <div>
                    <p className="text-[12px] text-[#767692] uppercase tracking-wide mb-1">Автор</p>
                    {selectedDistribution.isAnonymous ? (
                      <p className="text-[14px] text-[#767692] italic flex items-center gap-1">
                        <EyeOff className="w-3 h-3" />
                        Скрыто
                      </p>
                    ) : (
                      <p className="text-[14px] text-[#21214f]">
                        {selectedDistribution.authorName}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-[12px] text-[#767692] uppercase tracking-wide mb-1">
                      Активность
                    </p>
                    <p className="text-[14px] text-[#21214f]">
                      {selectedDistribution.lastActivity.toLocaleDateString("ru-RU")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Assigned Reviewers */}
              <div>
                <h3 className="text-[16px] font-medium text-[#21214f] mb-3">
                  Назначенные рецензенты ({selectedDistribution.assignedReviewers.length})
                </h3>
                <div className="space-y-2">
                  {selectedDistribution.assignedReviewers.map((reviewer) => (
                    <div
                      key={reviewer.id}
                      className="flex items-center justify-between p-3 bg-[#f9f9f9] rounded-[8px]"
                    >
                      <span className="text-[14px] text-[#21214f]">{reviewer.name}</span>
                      {getReviewerStatusBadge(reviewer.status)}
                    </div>
                  ))}
                  {selectedDistribution.assignedReviewers.length === 0 && (
                    <p className="text-[14px] text-[#767692] italic py-2">
                      Рецензенты не назначены
                    </p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div>
                <h3 className="text-[16px] font-medium text-[#21214f] mb-3">Действия</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleReassignReviewer(selectedDistribution.id)}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-[#5b8def] text-white rounded-[12px] hover:bg-[#4a7de8] transition-colors"
                  >
                    <GitBranch className="w-4 h-4" />
                    Переназначить
                  </button>
                  <button
                    onClick={() => handleAddReviewer(selectedDistribution.id)}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-[#4caf50] text-white rounded-[12px] hover:bg-[#45a049] transition-colors"
                  >
                    <UserPlus className="w-4 h-4" />
                    Добавить
                  </button>
                  <button
                    onClick={() => handleToggleLock(selectedDistribution.id)}
                    className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-[#e6e8ee] rounded-[12px] hover:bg-[#f9f9f9] transition-colors"
                  >
                    {selectedDistribution.isLocked ? (
                      <>
                        <Unlock className="w-4 h-4 text-[#ff9800]" />
                        <span className="text-[14px] text-[#21214f]">Разблокировать</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 text-[#d4183d]" />
                        <span className="text-[14px] text-[#21214f]">Заблокировать</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleNudgeReviewer(selectedDistribution.id)}
                    className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-[#e6e8ee] rounded-[12px] hover:bg-[#f9f9f9] transition-colors"
                  >
                    <Bell className="w-4 h-4 text-[#5b8def]" />
                    <span className="text-[14px] text-[#21214f]">Напомнить</span>
                  </button>
                </div>
              </div>

              {/* History */}
              <div>
                <h3 className="text-[16px] font-medium text-[#21214f] mb-3">История изменений</h3>
                <div className="space-y-3">
                  {mockHistory.map((item, _index) => (
                    <div
                      key={item.id}
                      className="relative pl-6 pb-4 border-l-2 border-[#e6e8ee] last:border-0 last:pb-0"
                    >
                      <div className="absolute left-[-5px] top-0 w-2 h-2 bg-[#5b8def] rounded-full" />
                      <div className="mb-1">
                        <span className="text-[14px] font-medium text-[#21214f]">
                          {item.action}
                        </span>
                      </div>
                      <p className="text-[13px] text-[#767692] mb-1">{item.details}</p>
                      <div className="flex items-center gap-2 text-[12px] text-[#767692]">
                        <span>{item.performedBy}</span>
                        <span>•</span>
                        <span>{item.timestamp.toLocaleString("ru-RU")}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reassign Reviewer Modal */}
      {showReassignModal && selectedDistribution && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowReassignModal(false)}
        >
          <div
            className="bg-white rounded-[20px] max-w-[500px] w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[20px] font-medium text-[#21214f]">Переназначить рецензента</h2>
              <button
                onClick={() => setShowReassignModal(false)}
                className="p-1 hover:bg-[#f9f9f9] rounded transition-colors"
              >
                <X className="w-5 h-5 text-[#767692]" />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-[14px] text-[#767692] mb-4">
                Работа:{" "}
                <strong className="text-[#21214f]">{selectedDistribution.anonymousId}</strong>
              </p>

              {/* Current Reviewers */}
              <div className="mb-4">
                <label className="block text-[13px] font-medium text-[#767692] mb-2 uppercase tracking-wide">
                  Текущие рецензенты
                </label>
                <div className="space-y-2">
                  {selectedDistribution.assignedReviewers.map((reviewer) => (
                    <div
                      key={reviewer.id}
                      className="flex items-center gap-2 p-2 bg-[#f9f9f9] rounded-[8px]"
                    >
                      <input type="radio" name="reviewer-to-replace" id={reviewer.id} />
                      <label
                        htmlFor={reviewer.id}
                        className="flex-1 text-[14px] text-[#21214f] cursor-pointer"
                      >
                        {reviewer.name}
                      </label>
                      {getReviewerStatusBadge(reviewer.status)}
                    </div>
                  ))}
                </div>
              </div>

              {/* New Reviewer */}
              <div>
                <label className="block text-[13px] font-medium text-[#767692] mb-2 uppercase tracking-wide">
                  Новый рецензент
                </label>
                <select className="w-full px-4 py-3 border-2 border-[#e6e8ee] rounded-[12px] text-[15px] text-[#21214f] focus:border-[#5b8def] focus:outline-none transition-colors">
                  <option value="">Выберите студента</option>
                  {users
                    .filter((u) => u.role === "Student")
                    .map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowReassignModal(false)}
                className="flex-1 px-4 py-3 border-2 border-[#e6e8ee] rounded-[12px] hover:bg-[#f9f9f9] transition-colors text-[15px] text-[#21214f]"
              >
                Отмена
              </button>
              <button
                onClick={() => {
                  alert("Рецензент переназначен");
                  setShowReassignModal(false);
                }}
                className="flex-1 px-4 py-3 bg-[#5b8def] text-white rounded-[12px] hover:bg-[#4a7de8] transition-colors text-[15px]"
              >
                Переназначить
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Reviewer Modal */}
      {showAddReviewerModal && selectedDistribution && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowAddReviewerModal(false)}
        >
          <div
            className="bg-white rounded-[20px] max-w-[500px] w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[20px] font-medium text-[#21214f]">Добавить рецензента</h2>
              <button
                onClick={() => setShowAddReviewerModal(false)}
                className="p-1 hover:bg-[#f9f9f9] rounded transition-colors"
              >
                <X className="w-5 h-5 text-[#767692]" />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-[14px] text-[#767692] mb-4">
                Работа:{" "}
                <strong className="text-[#21214f]">{selectedDistribution.anonymousId}</strong>
              </p>

              <div>
                <label className="block text-[13px] font-medium text-[#767692] mb-2 uppercase tracking-wide">
                  Выберите студента
                </label>
                <select className="w-full px-4 py-3 border-2 border-[#e6e8ee] rounded-[12px] text-[15px] text-[#21214f] focus:border-[#5b8def] focus:outline-none transition-colors">
                  <option value="">Выберите студента</option>
                  {users
                    .filter((u) => u.role === "Student")
                    .map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                </select>
              </div>

              <div className="mt-4 p-3 bg-[#e9f5ff] border border-[#5b8def] rounded-[8px]">
                <p className="text-[13px] text-[#21214f]">
                  ℹ️ Новый рецензент получит уведомление о назначении
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowAddReviewerModal(false)}
                className="flex-1 px-4 py-3 border-2 border-[#e6e8ee] rounded-[12px] hover:bg-[#f9f9f9] transition-colors text-[15px] text-[#21214f]"
              >
                Отмена
              </button>
              <button
                onClick={() => {
                  alert("Рецензент добавлен");
                  setShowAddReviewerModal(false);
                }}
                className="flex-1 px-4 py-3 bg-[#4caf50] text-white rounded-[12px] hover:bg-[#45a049] transition-colors text-[15px]"
              >
                Добавить
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
