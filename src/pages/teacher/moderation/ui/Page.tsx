import {
  Shield,
  AlertTriangle,
  MessageSquare,
  Trash2,
  GitBranch,
  Eye,
  EyeOff,
  CheckCircle,
  Filter,
  ChevronUp,
} from "lucide-react";
import { JSX, useState } from "react";
import { useTranslation } from "react-i18next";

import { useAsync } from "@/shared/lib/useAsync";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs.tsx";
import { ErrorBanner } from "@/shared/ui/ErrorBanner";
import { PageHeader } from "@/shared/ui/PageHeader";
import { PageSkeleton } from "@/shared/ui/PageSkeleton";

import { assignmentRepo } from "@/entities/assignment";
import { reviewRepo } from "@/entities/review";
import { userRepo } from "@/entities/user";
import { workRepo } from "@/entities/work";

import { AppShell } from "@/widgets/app-shell/AppShell.tsx";

/**
 * TeacherModerationPage - Модерация рецензий
 *
 * Управление помеченными рецензиями:
 * - Очередь помеченных рецензий с разными типами флагов
 * - Предпросмотр рецензий с оценками и комментариями
 * - Действия: снять флаг, запросить переписывание, скрыть, переназначить
 * - Bulk-действия для выбранных рецензий
 */

type FlagType = "toxicity" | "too-short" | "spam" | "collusion";

interface FlaggedReview {
  id: string;
  reviewId: string;
  submissionId: string;
  assignmentTitle: string;
  reviewerName: string;
  revieweeName: string;
  flagType: FlagType;
  flagReason: string;
  flaggedBy: string;
  flaggedAt: Date;
  scores: Record<string, number>;
  comment: string;
  status: "pending" | "dismissed" | "hidden";
}

export default function TeacherModerationPage() {
  const { t } = useTranslation();
  const { data, isLoading, error, refetch } = useAsync(async () => {
    const [users, assignments, reviews, submissions] = await Promise.all([
      userRepo.getAll(),
      assignmentRepo.getAll(),
      reviewRepo.getAll(),
      workRepo.getAll(),
    ]);
    return { users, assignments, reviews, submissions };
  }, []);

  if (isLoading)
    return (
      <AppShell title={t("teacher.moderation.title")}>
        <PageSkeleton />
      </AppShell>
    );
  if (error)
    return (
      <AppShell title={t("teacher.moderation.title")}>
        <ErrorBanner message={error.message} onRetry={refetch} />
      </AppShell>
    );

  return <ModerationContent data={data!} />;
}

function ModerationContent({
  data,
}: {
  data: {
    users: Awaited<ReturnType<typeof userRepo.getAll>>;
    assignments: Awaited<ReturnType<typeof assignmentRepo.getAll>>;
    reviews: Awaited<ReturnType<typeof reviewRepo.getAll>>;
    submissions: Awaited<ReturnType<typeof workRepo.getAll>>;
  };
}) {
  const { t } = useTranslation();
  const { users, assignments, reviews, submissions } = data;

  // Generate demo flagged reviews
  const generateFlaggedReviews = (): FlaggedReview[] => {
    const flagTypes: FlagType[] = ["toxicity", "too-short", "spam", "collusion"];
    const flagReasons: Record<FlagType, string[]> = {
      toxicity: [
        t("teacher.moderation.flagReasonToxicity1"),
        t("teacher.moderation.flagReasonToxicity2"),
        t("teacher.moderation.flagReasonToxicity3"),
      ],
      "too-short": [
        t("teacher.moderation.flagReasonShort1"),
        t("teacher.moderation.flagReasonShort2"),
        t("teacher.moderation.flagReasonShort3"),
      ],
      spam: [
        t("teacher.moderation.flagReasonSpam1"),
        t("teacher.moderation.flagReasonSpam2"),
        t("teacher.moderation.flagReasonSpam3"),
      ],
      collusion: [
        t("teacher.moderation.flagReasonCollusion1"),
        t("teacher.moderation.flagReasonCollusion2"),
        t("teacher.moderation.flagReasonCollusion3"),
      ],
    };

    return reviews.slice(0, 8).map((review, idx) => {
      const submission = submissions.find((s) => s.id === review.submissionId);
      const assignment = assignments.find((a) => a.id === submission?.assignmentId);
      const reviewer = users.find((u) => u.id === review.reviewerId);
      const reviewee = users.find((u) => u.id === submission?.studentId);
      const flagType = flagTypes[idx % flagTypes.length];

      return {
        id: `flag-${review.id}`,
        reviewId: review.id,
        submissionId: review.submissionId,
        assignmentTitle: assignment?.title || "Unknown Assignment",
        reviewerName: reviewer?.name || "Unknown Reviewer",
        revieweeName: reviewee?.name || "Unknown Student",
        flagType,
        flagReason: flagReasons[flagType][Math.floor(Math.random() * flagReasons[flagType].length)],
        flaggedBy: t("teacher.moderation.flaggedBySystem"),
        flaggedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        scores: review.scores,
        comment: review.comment,
        status: "pending",
      };
    });
  };

  const [flaggedReviews, setFlaggedReviews] = useState<FlaggedReview[]>(() =>
    generateFlaggedReviews(),
  );
  const [selectedReviews, setSelectedReviews] = useState<Set<string>>(new Set());
  const [expandedReview, setExpandedReview] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<FlagType | "all">("all");

  const getFlagTypeLabel = (type: FlagType): string => {
    const labels: Record<FlagType, string> = {
      toxicity: t("teacher.moderation.toxicity"),
      "too-short": t("teacher.moderation.tooShort"),
      spam: t("teacher.moderation.spam"),
      collusion: t("teacher.moderation.collusion"),
    };
    return labels[type];
  };

  const getFlagTypeBadge = (type: FlagType) => {
    const configs: Record<FlagType, { bg: string; text: string; icon: JSX.Element }> = {
      toxicity: {
        bg: "bg-error-light",
        text: "text-error",
        icon: <AlertTriangle className="w-3 h-3" />,
      },
      "too-short": {
        bg: "bg-warning-light",
        text: "text-warning",
        icon: <MessageSquare className="w-3 h-3" />,
      },
      spam: {
        bg: "bg-muted",
        text: "text-muted-foreground",
        icon: <Trash2 className="w-3 h-3" />,
      },
      collusion: {
        bg: "bg-warning-light",
        text: "text-warning",
        icon: <GitBranch className="w-3 h-3" />,
      },
    };

    const config = configs[type];
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 ${config.bg} ${config.text} rounded-[6px] text-[12px] font-medium`}
      >
        {config.icon}
        {getFlagTypeLabel(type)}
      </span>
    );
  };

  const filteredReviews =
    filterType === "all"
      ? flaggedReviews.filter((r) => r.status === "pending")
      : flaggedReviews.filter((r) => r.status === "pending" && r.flagType === filterType);

  const toggleSelectReview = (id: string) => {
    const newSet = new Set(selectedReviews);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedReviews(newSet);
  };

  const toggleSelectAll = () => {
    if (selectedReviews.size === filteredReviews.length) {
      setSelectedReviews(new Set());
    } else {
      setSelectedReviews(new Set(filteredReviews.map((r) => r.id)));
    }
  };

  const handleDismissFlag = (id: string) => {
    setFlaggedReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "dismissed" as const } : r)),
    );
    setExpandedReview(null);
    alert(t("teacher.moderation.flagDismissed"));
  };

  const handleRequestRewrite = (id: string) => {
    alert(t("teacher.moderation.rewriteRequested", { id }));
    setExpandedReview(null);
  };

  const handleHideReview = (id: string) => {
    setFlaggedReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "hidden" as const } : r)),
    );
    setExpandedReview(null);
    alert(t("teacher.moderation.reviewHidden"));
  };

  const handleReassignReview = (id: string) => {
    alert(t("teacher.moderation.reassignModal", { id }));
  };

  const handleBulkDismiss = () => {
    if (selectedReviews.size === 0) return;

    setFlaggedReviews((prev) =>
      prev.map((r) => (selectedReviews.has(r.id) ? { ...r, status: "dismissed" as const } : r)),
    );
    setSelectedReviews(new Set());
    alert(t("teacher.moderation.flagsDismissedCount", { count: selectedReviews.size }));
  };

  const toggleExpandReview = (id: string) => {
    setExpandedReview(expandedReview === id ? null : id);
  };

  return (
    <AppShell title={t("teacher.moderation.title")}>
      <Breadcrumbs items={[{ label: t("teacher.moderation.breadcrumb") }]} />

      <PageHeader
        title={t("teacher.moderation.title")}
        subtitle={t("teacher.moderation.subtitle")}
      />

      <div>
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-card border-2 border-border rounded-[12px] p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-error" />
              <span className="text-[12px] text-muted-foreground uppercase tracking-wide">
                {t("teacher.moderation.toxicityLabel")}
              </span>
            </div>
            <p className="text-[24px] font-medium text-foreground">
              {
                flaggedReviews.filter((r) => r.flagType === "toxicity" && r.status === "pending")
                  .length
              }
            </p>
          </div>
          <div className="bg-card border-2 border-border rounded-[12px] p-4">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-4 h-4 text-warning" />
              <span className="text-[12px] text-muted-foreground uppercase tracking-wide">
                {t("teacher.moderation.tooShortLabel")}
              </span>
            </div>
            <p className="text-[24px] font-medium text-foreground">
              {
                flaggedReviews.filter((r) => r.flagType === "too-short" && r.status === "pending")
                  .length
              }
            </p>
          </div>
          <div className="bg-card border-2 border-border rounded-[12px] p-4">
            <div className="flex items-center gap-2 mb-2">
              <Trash2 className="w-4 h-4 text-muted-foreground" />
              <span className="text-[12px] text-muted-foreground uppercase tracking-wide">
                {t("teacher.moderation.spamLabel")}
              </span>
            </div>
            <p className="text-[24px] font-medium text-foreground">
              {flaggedReviews.filter((r) => r.flagType === "spam" && r.status === "pending").length}
            </p>
          </div>
          <div className="bg-card border-2 border-border rounded-[12px] p-4">
            <div className="flex items-center gap-2 mb-2">
              <GitBranch className="w-4 h-4 text-warning" />
              <span className="text-[12px] text-muted-foreground uppercase tracking-wide">
                {t("teacher.moderation.collusionLabel")}
              </span>
            </div>
            <p className="text-[24px] font-medium text-foreground">
              {
                flaggedReviews.filter((r) => r.flagType === "collusion" && r.status === "pending")
                  .length
              }
            </p>
          </div>
        </div>

        {/* Filter and Bulk Actions Bar */}
        <div className="bg-card border-2 border-border rounded-[20px] p-4 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            {/* Filter */}
            <div className="flex items-center gap-3">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as FlagType | "all")}
                className="px-3 py-2 border-2 border-border rounded-[8px] text-[14px] text-foreground focus:border-brand-primary focus:outline-none transition-colors"
              >
                <option value="all">
                  {t("teacher.moderation.allTypesFilter")} (
                  {flaggedReviews.filter((r) => r.status === "pending").length})
                </option>
                <option value="toxicity">
                  {t("teacher.moderation.toxicityFilter")} (
                  {
                    flaggedReviews.filter(
                      (r) => r.flagType === "toxicity" && r.status === "pending",
                    ).length
                  }
                  )
                </option>
                <option value="too-short">
                  {t("teacher.moderation.tooShortFilter")} (
                  {
                    flaggedReviews.filter(
                      (r) => r.flagType === "too-short" && r.status === "pending",
                    ).length
                  }
                  )
                </option>
                <option value="spam">
                  {t("teacher.moderation.spamFilter")} (
                  {
                    flaggedReviews.filter((r) => r.flagType === "spam" && r.status === "pending")
                      .length
                  }
                  )
                </option>
                <option value="collusion">
                  {t("teacher.moderation.collusionFilter")} (
                  {
                    flaggedReviews.filter(
                      (r) => r.flagType === "collusion" && r.status === "pending",
                    ).length
                  }
                  )
                </option>
              </select>
            </div>

            {/* Bulk Actions */}
            {selectedReviews.size > 0 && (
              <div className="flex items-center gap-3">
                <span className="text-[14px] text-muted-foreground">
                  {t("teacher.moderation.selected")}{" "}
                  <strong className="text-foreground">{selectedReviews.size}</strong>
                </span>
                <button
                  onClick={handleBulkDismiss}
                  className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-primary-foreground rounded-[12px] hover:bg-brand-primary-hover transition-colors text-[14px]"
                >
                  <CheckCircle className="w-4 h-4" />
                  {t("teacher.moderation.removeAllFlags")}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Flagged Reviews Queue */}
        <div className="bg-card border-2 border-border rounded-[20px] overflow-hidden">
          {filteredReviews.length > 0 ? (
            <>
              {/* Select All Header */}
              <div className="border-b-2 border-border px-6 py-3 bg-muted">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={
                      selectedReviews.size === filteredReviews.length && filteredReviews.length > 0
                    }
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-2 border-border text-brand-primary focus:ring-2 focus:ring-ring focus:ring-offset-0"
                  />
                  <span className="text-[13px] font-medium text-muted-foreground uppercase tracking-wide">
                    {t("teacher.moderation.selectAllLabel")} ({filteredReviews.length})
                  </span>
                </label>
              </div>

              {/* Reviews List */}
              <div className="divide-y divide-border">
                {filteredReviews.map((flaggedReview) => (
                  <div key={flaggedReview.id} className="hover:bg-surface-hover transition-colors">
                    {/* Review Row */}
                    <div className="px-6 py-4">
                      <div className="flex items-start gap-4">
                        {/* Checkbox */}
                        <div className="pt-1">
                          <input
                            type="checkbox"
                            checked={selectedReviews.has(flaggedReview.id)}
                            onChange={() => toggleSelectReview(flaggedReview.id)}
                            onClick={(e) => e.stopPropagation()}
                            className="w-4 h-4 rounded border-2 border-border text-brand-primary focus:ring-2 focus:ring-ring focus:ring-offset-0"
                          />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                {getFlagTypeBadge(flaggedReview.flagType)}
                                <span className="text-[13px] text-muted-foreground">
                                  {flaggedReview.flaggedAt.toLocaleDateString()}
                                </span>
                              </div>
                              <h3 className="text-[16px] font-medium text-foreground mb-1">
                                {flaggedReview.assignmentTitle}
                              </h3>
                              <p className="text-[14px] text-muted-foreground">
                                {t("teacher.moderation.reviewer")}{" "}
                                <strong className="text-foreground">
                                  {flaggedReview.reviewerName}
                                </strong>{" "}
                                → {t("teacher.moderation.reviewee")}{" "}
                                <strong className="text-foreground">
                                  {flaggedReview.revieweeName}
                                </strong>
                              </p>
                            </div>

                            {/* Expand Button */}
                            <button
                              onClick={() => toggleExpandReview(flaggedReview.id)}
                              className="flex items-center gap-2 px-3 py-2 border-2 border-border rounded-[8px] hover:bg-info-light hover:border-brand-primary transition-colors text-[14px] text-foreground shrink-0"
                            >
                              {expandedReview === flaggedReview.id ? (
                                <>
                                  <ChevronUp className="w-4 h-4" />
                                  {t("teacher.moderation.collapse")}
                                </>
                              ) : (
                                <>
                                  <Eye className="w-4 h-4" />
                                  {t("teacher.moderation.view")}
                                </>
                              )}
                            </button>
                          </div>

                          {/* Flag Reason */}
                          <div className="flex items-start gap-2 p-3 bg-warning-light border border-warning rounded-[8px]">
                            <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <p className="text-[13px] font-medium text-foreground mb-1">
                                {t("teacher.moderation.flagReason")}
                              </p>
                              <p className="text-[13px] text-muted-foreground">
                                {flaggedReview.flagReason}
                              </p>
                              <p className="text-[12px] text-muted-foreground mt-1">
                                {t("teacher.moderation.flaggedBy")} {flaggedReview.flaggedBy}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Expanded Review Preview */}
                      {expandedReview === flaggedReview.id && (
                        <div className="mt-4 pt-4 border-t-2 border-border ml-8">
                          <div className="grid md:grid-cols-2 gap-6">
                            {/* Scores */}
                            <div>
                              <h4 className="text-[14px] font-medium text-foreground mb-3 uppercase tracking-wide">
                                {t("teacher.moderation.scoresByCriteria")}
                              </h4>
                              <div className="space-y-2">
                                {Object.entries(flaggedReview.scores).map(([criterion, score]) => (
                                  <div
                                    key={criterion}
                                    className="flex items-center justify-between p-2 bg-muted rounded-[8px]"
                                  >
                                    <span className="text-[13px] text-muted-foreground">
                                      {criterion}
                                    </span>
                                    <span className="text-[15px] font-medium text-foreground">
                                      {score}/5
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Comment */}
                            <div>
                              <h4 className="text-[14px] font-medium text-foreground mb-3 uppercase tracking-wide">
                                {t("common.comment")}
                              </h4>
                              <div className="p-4 bg-muted rounded-[12px] border-2 border-border">
                                <p className="text-[14px] text-foreground leading-relaxed">
                                  {flaggedReview.comment}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="mt-6 flex flex-wrap gap-3">
                            <button
                              onClick={() => handleDismissFlag(flaggedReview.id)}
                              className="flex items-center gap-2 px-4 py-2 bg-success text-primary-foreground rounded-[12px] hover:bg-success transition-colors text-[14px]"
                            >
                              <CheckCircle className="w-4 h-4" />
                              {t("teacher.moderation.removeFlag")}
                            </button>
                            <button
                              onClick={() => handleRequestRewrite(flaggedReview.id)}
                              className="flex items-center gap-2 px-4 py-2 border-2 border-brand-primary text-brand-primary rounded-[12px] hover:bg-info-light transition-colors text-[14px]"
                            >
                              <MessageSquare className="w-4 h-4" />
                              {t("teacher.moderation.requestRewrite")}
                            </button>
                            <button
                              onClick={() => handleHideReview(flaggedReview.id)}
                              className="flex items-center gap-2 px-4 py-2 border-2 border-warning text-warning rounded-[12px] hover:bg-warning-light transition-colors text-[14px]"
                            >
                              <EyeOff className="w-4 h-4" />
                              {t("teacher.moderation.hideReview")}
                            </button>
                            <button
                              onClick={() => handleReassignReview(flaggedReview.id)}
                              className="flex items-center gap-2 px-4 py-2 border-2 border-border text-foreground rounded-[12px] hover:bg-muted transition-colors text-[14px]"
                            >
                              <GitBranch className="w-4 h-4" />
                              {t("teacher.moderation.reassignReview")}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <Shield className="w-12 h-12 text-text-tertiary mx-auto mb-3" />
              <h3 className="text-[18px] font-medium text-foreground mb-2">
                {t("teacher.moderation.noFlaggedReviews")}
              </h3>
              <p className="text-[14px] text-muted-foreground">
                {filterType === "all"
                  ? t("teacher.moderation.allReviewsFine")
                  : `${t("teacher.moderation.noReviewsOfType")} "${getFlagTypeLabel(filterType)}"`}
              </p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
