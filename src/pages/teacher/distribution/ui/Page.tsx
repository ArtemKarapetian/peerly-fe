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
import { useState } from "react";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  // Load base data (courses, users, submissions, reviews)
  const {
    data: baseData,
    isLoading: baseLoading,
    error: baseError,
    refetch: baseRefetch,
  } = useAsync(
    async () => {
      const [courses, users, submissions, reviews] = await Promise.all([
        courseRepo.getAll(),
        userRepo.getAll(),
        workRepo.getAll(),
        reviewRepo.getAll(),
      ]);
      return { courses, users, submissions, reviews };
    },
    [],
    { onError: "redirect" },
  );

  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [selectedAssignment, setSelectedAssignment] = useState<string>("");
  const [selectedDistribution, setSelectedDistribution] = useState<DistributionRow | null>(null);
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [showAddReviewerModal, setShowAddReviewerModal] = useState(false);
  const [activeRowAction, setActiveRowAction] = useState<string | null>(null);

  // Compute effective course (default to first course once data is loaded)
  const effectiveCourse = selectedCourse || baseData?.courses[0]?.id || "";

  // Load assignments for selected course (separate useAsync with dependency)
  const { data: assignments } = useAsync(async () => {
    if (!effectiveCourse) return [];
    return assignmentRepo.getByCourse(effectiveCourse);
  }, [effectiveCourse]);

  if (baseLoading)
    return (
      <AppShell title={t("teacher.distribution.title")}>
        <PageSkeleton />
      </AppShell>
    );
  if (baseError)
    return (
      <AppShell title={t("teacher.distribution.title")}>
        <ErrorBanner message={baseError.message} onRetry={baseRefetch} />
      </AppShell>
    );

  const { courses, users, submissions, reviews } = baseData!;

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
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-success-light text-success rounded-[6px] text-[12px] font-medium">
            <CheckCircle className="w-3 h-3" />
            {t("teacher.distribution.completed")}
          </span>
        );
      case "in-progress":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-warning-light text-warning rounded-[6px] text-[12px] font-medium">
            <Clock className="w-3 h-3" />
            {t("teacher.distribution.inProgress")}
          </span>
        );
      case "not-started":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-muted text-muted-foreground rounded-[6px] text-[12px] font-medium">
            <AlertCircle className="w-3 h-3" />
            {t("teacher.distribution.notStarted")}
          </span>
        );
    }
  };

  const getReviewerStatusBadge = (status: "pending" | "draft" | "submitted") => {
    switch (status) {
      case "submitted":
        return (
          <span className="inline-flex px-1.5 py-0.5 bg-success-light text-success rounded-[4px] text-[11px] font-medium">
            ✓
          </span>
        );
      case "draft":
        return (
          <span className="inline-flex px-1.5 py-0.5 bg-warning-light text-warning rounded-[4px] text-[11px] font-medium">
            ⋯
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex px-1.5 py-0.5 bg-muted text-muted-foreground rounded-[4px] text-[11px] font-medium">
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
    alert(t("teacher.distribution.reminderSentFor", { id: distributionId }));
    setActiveRowAction(null);
  };

  const handleRowClick = (distribution: DistributionRow) => {
    setSelectedDistribution(distribution);
  };

  // Demo history with fixed dates
  const mockHistory: DistributionHistory[] = [
    {
      id: "h1",
      action: t("teacher.distribution.histDistCreated"),
      performedBy: t("teacher.distribution.histSystemAuto"),
      timestamp: new Date("2024-02-10"),
      details: t("teacher.distribution.histAutoRoundRobin"),
    },
    {
      id: "h2",
      action: t("teacher.distribution.histReviewerAssigned"),
      performedBy: t("teacher.distribution.histTeacherName"),
      timestamp: new Date("2024-02-11"),
      details: t("teacher.distribution.histAddedManually"),
    },
    {
      id: "h3",
      action: t("teacher.distribution.histReminderSent"),
      performedBy: t("teacher.distribution.histTeacherName"),
      timestamp: new Date("2024-02-13"),
      details: t("teacher.distribution.histNotificationSent"),
    },
    {
      id: "h4",
      action: t("teacher.distribution.histReviewSubmitted"),
      performedBy: t("teacher.distribution.histStudentNum"),
      timestamp: new Date("2024-02-14"),
      details: t("teacher.distribution.histReviewSuccess"),
    },
  ];

  return (
    <AppShell title={t("teacher.distribution.title")}>
      <Breadcrumbs items={[{ label: t("teacher.distribution.breadcrumb") }]} />

      <PageHeader
        title={t("teacher.distribution.title")}
        subtitle={t("teacher.distribution.subtitle")}
      />

      <div>
        {/* Filters */}
        <div className="bg-card border-2 border-border rounded-[20px] p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Course Filter */}
            <div>
              <label className="block text-[13px] font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                {t("teacher.distribution.courseLabel")}
              </label>
              <select
                value={effectiveCourse}
                onChange={(e) => {
                  setSelectedCourse(e.target.value);
                  setSelectedAssignment("");
                }}
                className="w-full px-4 py-3 border-2 border-border rounded-[12px] text-[15px] text-foreground focus:border-brand-primary focus:outline-none transition-colors"
              >
                <option value="">{t("teacher.distribution.selectCourse")}</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name} ({course.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Assignment Filter */}
            <div>
              <label className="block text-[13px] font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                {t("teacher.distribution.assignmentLabel")}
              </label>
              <select
                value={selectedAssignment}
                onChange={(e) => setSelectedAssignment(e.target.value)}
                disabled={!effectiveCourse}
                className="w-full px-4 py-3 border-2 border-border rounded-[12px] text-[15px] text-foreground focus:border-brand-primary focus:outline-none transition-colors disabled:bg-muted disabled:cursor-not-allowed"
              >
                <option value="">{t("teacher.distribution.selectAssignment")}</option>
                {(assignments || []).map((assignment) => (
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
            <div className="hidden md:block bg-card border-2 border-border rounded-[20px] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-border">
                      <th className="text-left px-6 py-4 text-[13px] font-medium text-muted-foreground uppercase tracking-wide">
                        {t("teacher.distribution.work")}
                      </th>
                      <th className="text-left px-6 py-4 text-[13px] font-medium text-muted-foreground uppercase tracking-wide">
                        {t("teacher.distribution.author")}
                      </th>
                      <th className="text-left px-6 py-4 text-[13px] font-medium text-muted-foreground uppercase tracking-wide">
                        {t("teacher.distribution.assignedReviewers")}
                      </th>
                      <th className="text-left px-6 py-4 text-[13px] font-medium text-muted-foreground uppercase tracking-wide">
                        {t("common.status")}
                      </th>
                      <th className="text-left px-6 py-4 text-[13px] font-medium text-muted-foreground uppercase tracking-wide">
                        {t("common.actions")}
                      </th>
                      <th className="text-right px-6 py-4 text-[13px] font-medium text-muted-foreground uppercase tracking-wide">
                        {t("common.actions")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {distributions.map((dist, index) => (
                      <tr
                        key={dist.id}
                        className={`
                          border-b border-border last:border-0 hover:bg-info-light transition-colors cursor-pointer
                          ${index % 2 === 0 ? "bg-card" : "bg-surface-hover"}
                        `}
                        onClick={() => handleRowClick(dist)}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="text-[15px] font-medium text-foreground">
                              {dist.anonymousId}
                            </span>
                            {dist.isLocked && <Lock className="w-4 h-4 text-error" />}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {dist.isAnonymous ? (
                              <>
                                <EyeOff className="w-4 h-4 text-muted-foreground" />
                                <span className="text-[14px] text-muted-foreground italic">
                                  {t("teacher.distribution.hidden")}
                                </span>
                              </>
                            ) : (
                              <span className="text-[14px] text-foreground">{dist.authorName}</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-2">
                            {dist.assignedReviewers.map((reviewer) => (
                              <div key={reviewer.id} className="flex items-center gap-1">
                                <span className="text-[13px] text-foreground">{reviewer.name}</span>
                                {getReviewerStatusBadge(reviewer.status)}
                              </div>
                            ))}
                            {dist.assignedReviewers.length === 0 && (
                              <span className="text-[13px] text-muted-foreground italic">
                                {t("teacher.distribution.noReviewers")}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">{getStatusBadge(dist.overallStatus)}</td>
                        <td className="px-6 py-4">
                          <span className="text-[13px] text-muted-foreground">
                            {dist.lastActivity.toLocaleDateString()}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2 relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveRowAction(activeRowAction === dist.id ? null : dist.id);
                              }}
                              className="p-2 hover:bg-info-light rounded-[8px] transition-colors"
                              title={t("teacher.distribution.actionsLabel")}
                            >
                              <MoreVertical className="w-4 h-4 text-muted-foreground" />
                            </button>

                            {/* Actions Dropdown */}
                            {activeRowAction === dist.id && (
                              <div
                                className="absolute right-0 top-full mt-1 bg-card border-2 border-border rounded-[12px] shadow-lg z-10 min-w-[200px]"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button
                                  onClick={() => handleReassignReviewer(dist.id)}
                                  className="w-full flex items-center gap-2 px-4 py-3 hover:bg-muted text-left transition-colors first:rounded-t-[10px]"
                                >
                                  <GitBranch className="w-4 h-4 text-brand-primary" />
                                  <span className="text-[14px] text-foreground">
                                    {t("teacher.distribution.reassign")}
                                  </span>
                                </button>
                                <button
                                  onClick={() => handleAddReviewer(dist.id)}
                                  className="w-full flex items-center gap-2 px-4 py-3 hover:bg-muted text-left transition-colors border-t border-border"
                                >
                                  <UserPlus className="w-4 h-4 text-success" />
                                  <span className="text-[14px] text-foreground">
                                    {t("teacher.distribution.addReviewerLabel")}
                                  </span>
                                </button>
                                <button
                                  onClick={() => handleToggleLock(dist.id)}
                                  className="w-full flex items-center gap-2 px-4 py-3 hover:bg-muted text-left transition-colors border-t border-border"
                                >
                                  {dist.isLocked ? (
                                    <>
                                      <Unlock className="w-4 h-4 text-warning" />
                                      <span className="text-[14px] text-foreground">
                                        {t("teacher.distribution.unlock")}
                                      </span>
                                    </>
                                  ) : (
                                    <>
                                      <Lock className="w-4 h-4 text-error" />
                                      <span className="text-[14px] text-foreground">
                                        {t("teacher.distribution.lock")}
                                      </span>
                                    </>
                                  )}
                                </button>
                                <button
                                  onClick={() => handleNudgeReviewer(dist.id)}
                                  className="w-full flex items-center gap-2 px-4 py-3 hover:bg-muted text-left transition-colors border-t border-border last:rounded-b-[10px]"
                                >
                                  <Bell className="w-4 h-4 text-brand-primary" />
                                  <span className="text-[14px] text-foreground">
                                    {t("teacher.distribution.remind")}
                                  </span>
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
                  <GitBranch className="w-12 h-12 text-text-tertiary mx-auto mb-3" />
                  <p className="text-[15px] text-muted-foreground">
                    {t("teacher.distribution.noDistributionData")}
                  </p>
                </div>
              )}
            </div>

            {/* Mobile Cards (<800px) */}
            <div className="block md:hidden space-y-3">
              {distributions.map((dist) => (
                <div
                  key={dist.id}
                  className="bg-card border-2 border-border rounded-[20px] p-4 hover:border-brand-primary transition-colors cursor-pointer"
                  onClick={() => handleRowClick(dist)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[16px] font-medium text-foreground">
                        {dist.anonymousId}
                      </span>
                      {dist.isLocked && <Lock className="w-4 h-4 text-error" />}
                    </div>
                    {getStatusBadge(dist.overallStatus)}
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-2 text-[13px]">
                      <span className="text-muted-foreground">
                        {t("teacher.distribution.authorLabel")}
                      </span>
                      {dist.isAnonymous ? (
                        <span className="text-muted-foreground italic flex items-center gap-1">
                          <EyeOff className="w-3 h-3" />
                          {t("teacher.distribution.hiddenShort")}
                        </span>
                      ) : (
                        <span className="text-foreground">{dist.authorName}</span>
                      )}
                    </div>

                    <div>
                      <span className="text-[13px] text-muted-foreground block mb-1">
                        {t("teacher.distribution.reviewersLabel")}
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {dist.assignedReviewers.map((reviewer) => (
                          <div key={reviewer.id} className="flex items-center gap-1 text-[12px]">
                            <span className="text-foreground">{reviewer.name}</span>
                            {getReviewerStatusBadge(reviewer.status)}
                          </div>
                        ))}
                        {dist.assignedReviewers.length === 0 && (
                          <span className="text-[12px] text-muted-foreground italic">
                            {t("teacher.distribution.noReviewers")}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-[13px]">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {dist.lastActivity.toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-border">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReassignReviewer(dist.id);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-muted hover:bg-info-light rounded-[8px] transition-colors text-[13px] text-foreground"
                    >
                      <GitBranch className="w-4 h-4" />
                      {t("teacher.distribution.reassignBtn")}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddReviewer(dist.id);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-muted hover:bg-info-light rounded-[8px] transition-colors text-[13px] text-foreground"
                    >
                      <UserPlus className="w-4 h-4" />
                      {t("teacher.distribution.addBtn")}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveRowAction(activeRowAction === dist.id ? null : dist.id);
                      }}
                      className="px-3 py-2 bg-muted hover:bg-info-light rounded-[8px] transition-colors"
                    >
                      <MoreVertical className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>

                  {/* Mobile Actions Menu */}
                  {activeRowAction === dist.id && (
                    <div className="mt-3 pt-3 border-t border-border space-y-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleLock(dist.id);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 hover:bg-muted rounded-[8px] transition-colors text-[13px] text-foreground"
                      >
                        {dist.isLocked ? (
                          <>
                            <Unlock className="w-4 h-4 text-warning" />
                            {t("teacher.distribution.unlockBtn")}
                          </>
                        ) : (
                          <>
                            <Lock className="w-4 h-4 text-error" />
                            {t("teacher.distribution.lockBtn")}
                          </>
                        )}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNudgeReviewer(dist.id);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 hover:bg-muted rounded-[8px] transition-colors text-[13px] text-foreground"
                      >
                        <Bell className="w-4 h-4 text-brand-primary" />
                        {t("teacher.distribution.remindReviewers")}
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {distributions.length === 0 && (
                <div className="bg-card border-2 border-border rounded-[20px] p-12 text-center">
                  <GitBranch className="w-12 h-12 text-text-tertiary mx-auto mb-3" />
                  <p className="text-[15px] text-muted-foreground">
                    {t("teacher.distribution.noDistributionData")}
                  </p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="bg-card border-2 border-border rounded-[20px] p-12 text-center">
            <GitBranch className="w-12 h-12 text-text-tertiary mx-auto mb-3" />
            <p className="text-[15px] text-muted-foreground">
              {t("teacher.distribution.selectToView")}
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
            className="bg-card h-full w-full md:w-[600px] shadow-2xl overflow-y-auto animate-slide-in-right"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="sticky top-0 bg-card border-b-2 border-border px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h2 className="text-[20px] font-medium text-foreground">
                  {selectedDistribution.anonymousId}
                </h2>
                <p className="text-[13px] text-muted-foreground mt-1">
                  {t("teacher.distribution.distributionDetails")}
                </p>
              </div>
              <button
                onClick={() => setSelectedDistribution(null)}
                className="p-2 hover:bg-muted rounded-[8px] transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="p-6 space-y-6">
              {/* Summary Card */}
              <div className="bg-muted border-2 border-border rounded-[12px] p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[12px] text-muted-foreground uppercase tracking-wide mb-1">
                      {t("teacher.distribution.workLabel")}
                    </p>
                    <p className="text-[15px] font-medium text-foreground">
                      {selectedDistribution.anonymousId}
                    </p>
                  </div>
                  <div>
                    <p className="text-[12px] text-muted-foreground uppercase tracking-wide mb-1">
                      {t("teacher.distribution.statusLabel")}
                    </p>
                    {getStatusBadge(selectedDistribution.overallStatus)}
                  </div>
                  <div>
                    <p className="text-[12px] text-muted-foreground uppercase tracking-wide mb-1">
                      {t("teacher.distribution.authorDrawerLabel")}
                    </p>
                    {selectedDistribution.isAnonymous ? (
                      <p className="text-[14px] text-muted-foreground italic flex items-center gap-1">
                        <EyeOff className="w-3 h-3" />
                        {t("teacher.distribution.hiddenShort")}
                      </p>
                    ) : (
                      <p className="text-[14px] text-foreground">
                        {selectedDistribution.authorName}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-[12px] text-muted-foreground uppercase tracking-wide mb-1">
                      {t("teacher.distribution.activityLabel")}
                    </p>
                    <p className="text-[14px] text-foreground">
                      {selectedDistribution.lastActivity.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Assigned Reviewers */}
              <div>
                <h3 className="text-[16px] font-medium text-foreground mb-3">
                  {t("teacher.distribution.assignedReviewersTitle")} (
                  {selectedDistribution.assignedReviewers.length})
                </h3>
                <div className="space-y-2">
                  {selectedDistribution.assignedReviewers.map((reviewer) => (
                    <div
                      key={reviewer.id}
                      className="flex items-center justify-between p-3 bg-muted rounded-[8px]"
                    >
                      <span className="text-[14px] text-foreground">{reviewer.name}</span>
                      {getReviewerStatusBadge(reviewer.status)}
                    </div>
                  ))}
                  {selectedDistribution.assignedReviewers.length === 0 && (
                    <p className="text-[14px] text-muted-foreground italic py-2">
                      {t("teacher.distribution.noReviewersAssigned")}
                    </p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div>
                <h3 className="text-[16px] font-medium text-foreground mb-3">
                  {t("teacher.distribution.actionsTitle")}
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleReassignReviewer(selectedDistribution.id)}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-brand-primary text-primary-foreground rounded-[12px] hover:bg-brand-primary-hover transition-colors"
                  >
                    <GitBranch className="w-4 h-4" />
                    {t("teacher.distribution.reassignBtn")}
                  </button>
                  <button
                    onClick={() => handleAddReviewer(selectedDistribution.id)}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-success text-primary-foreground rounded-[12px] hover:bg-success transition-colors"
                  >
                    <UserPlus className="w-4 h-4" />
                    {t("teacher.distribution.addBtn")}
                  </button>
                  <button
                    onClick={() => handleToggleLock(selectedDistribution.id)}
                    className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-border rounded-[12px] hover:bg-muted transition-colors"
                  >
                    {selectedDistribution.isLocked ? (
                      <>
                        <Unlock className="w-4 h-4 text-warning" />
                        <span className="text-[14px] text-foreground">
                          {t("teacher.distribution.unlockBtn")}
                        </span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 text-error" />
                        <span className="text-[14px] text-foreground">
                          {t("teacher.distribution.lockBtn")}
                        </span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleNudgeReviewer(selectedDistribution.id)}
                    className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-border rounded-[12px] hover:bg-muted transition-colors"
                  >
                    <Bell className="w-4 h-4 text-brand-primary" />
                    <span className="text-[14px] text-foreground">
                      {t("teacher.distribution.remind")}
                    </span>
                  </button>
                </div>
              </div>

              {/* History */}
              <div>
                <h3 className="text-[16px] font-medium text-foreground mb-3">
                  {t("teacher.distribution.changeHistory")}
                </h3>
                <div className="space-y-3">
                  {mockHistory.map((item, _index) => (
                    <div
                      key={item.id}
                      className="relative pl-6 pb-4 border-l-2 border-border last:border-0 last:pb-0"
                    >
                      <div className="absolute left-[-5px] top-0 w-2 h-2 bg-brand-primary rounded-full" />
                      <div className="mb-1">
                        <span className="text-[14px] font-medium text-foreground">
                          {item.action}
                        </span>
                      </div>
                      <p className="text-[13px] text-muted-foreground mb-1">{item.details}</p>
                      <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
                        <span>{item.performedBy}</span>
                        <span>•</span>
                        <span>{item.timestamp.toLocaleString()}</span>
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
            className="bg-card rounded-[20px] max-w-[500px] w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[20px] font-medium text-foreground">
                {t("teacher.distribution.reassignReviewer")}
              </h2>
              <button
                onClick={() => setShowReassignModal(false)}
                className="p-1 hover:bg-muted rounded transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-[14px] text-muted-foreground mb-4">
                {t("teacher.distribution.workModalLabel")}{" "}
                <strong className="text-foreground">{selectedDistribution.anonymousId}</strong>
              </p>

              {/* Current Reviewers */}
              <div className="mb-4">
                <label className="block text-[13px] font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                  {t("teacher.distribution.currentReviewers")}
                </label>
                <div className="space-y-2">
                  {selectedDistribution.assignedReviewers.map((reviewer) => (
                    <div
                      key={reviewer.id}
                      className="flex items-center gap-2 p-2 bg-muted rounded-[8px]"
                    >
                      <input type="radio" name="reviewer-to-replace" id={reviewer.id} />
                      <label
                        htmlFor={reviewer.id}
                        className="flex-1 text-[14px] text-foreground cursor-pointer"
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
                <label className="block text-[13px] font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                  {t("teacher.distribution.newReviewer")}
                </label>
                <select className="w-full px-4 py-3 border-2 border-border rounded-[12px] text-[15px] text-foreground focus:border-brand-primary focus:outline-none transition-colors">
                  <option value="">{t("teacher.distribution.selectStudent")}</option>
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
                className="flex-1 px-4 py-3 border-2 border-border rounded-[12px] hover:bg-muted transition-colors text-[15px] text-foreground"
              >
                {t("teacher.distribution.cancelBtn")}
              </button>
              <button
                onClick={() => {
                  alert(t("teacher.distribution.reviewerReassignedAlert"));
                  setShowReassignModal(false);
                }}
                className="flex-1 px-4 py-3 bg-brand-primary text-primary-foreground rounded-[12px] hover:bg-brand-primary-hover transition-colors text-[15px]"
              >
                {t("teacher.distribution.reassignBtn")}
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
            className="bg-card rounded-[20px] max-w-[500px] w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[20px] font-medium text-foreground">
                {t("teacher.distribution.addReviewer")}
              </h2>
              <button
                onClick={() => setShowAddReviewerModal(false)}
                className="p-1 hover:bg-muted rounded transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-[14px] text-muted-foreground mb-4">
                {t("teacher.distribution.workModalLabel")}{" "}
                <strong className="text-foreground">{selectedDistribution.anonymousId}</strong>
              </p>

              <div>
                <label className="block text-[13px] font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                  {t("teacher.distribution.selectStudent")}
                </label>
                <select className="w-full px-4 py-3 border-2 border-border rounded-[12px] text-[15px] text-foreground focus:border-brand-primary focus:outline-none transition-colors">
                  <option value="">{t("teacher.distribution.selectStudent")}</option>
                  {users
                    .filter((u) => u.role === "Student")
                    .map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                </select>
              </div>

              <div className="mt-4 p-3 bg-info-light border border-brand-primary rounded-[8px]">
                <p className="text-[13px] text-foreground">
                  {t("teacher.distribution.newReviewerNotified")}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowAddReviewerModal(false)}
                className="flex-1 px-4 py-3 border-2 border-border rounded-[12px] hover:bg-muted transition-colors text-[15px] text-foreground"
              >
                {t("teacher.distribution.cancelBtn")}
              </button>
              <button
                onClick={() => {
                  alert(t("teacher.distribution.reviewerAddedAlert"));
                  setShowAddReviewerModal(false);
                }}
                className="flex-1 px-4 py-3 bg-success text-primary-foreground rounded-[12px] hover:bg-success transition-colors text-[15px]"
              >
                {t("teacher.distribution.addBtn")}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
