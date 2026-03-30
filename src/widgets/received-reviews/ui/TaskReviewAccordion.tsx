import { ChevronDown, ChevronUp, AlertCircle, CheckCircle, Clock, FileText } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface ReviewCriterion {
  name: string;
  score: number;
  maxScore: number;
  comment?: string;
}

interface Review {
  reviewId: string;
  reviewerName: string | null;
  isAnonymous: boolean;
  submittedAt: string;
  overallComment: string;
  criteria: ReviewCriterion[];
}

interface TaskSubmission {
  taskId: string;
  courseName: string;
  taskTitle: string;
  status: "PUBLISHED" | "IN_REVIEW" | "PENDING" | "REVIEWED";
  currentScore?: number;
  maxScore?: number;
  reviewsReceived: number;
  reviewsRequired: number;
  reviews: Review[];
  allowAppeal?: boolean;
}

interface TaskReviewAccordionProps {
  tasks: TaskSubmission[];
}

function StatusBadge({
  status,
  t,
}: {
  status: TaskSubmission["status"];
  t: (key: string) => string;
}) {
  switch (status) {
    case "PUBLISHED":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-success-light text-success rounded-[8px] text-[13px] font-medium">
          <CheckCircle className="w-3.5 h-3.5" />
          {t("widget.taskReviewAccordion.published")}
        </span>
      );
    case "IN_REVIEW":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-warning-light text-warning rounded-[8px] text-[13px] font-medium">
          <Clock className="w-3.5 h-3.5" />
          {t("widget.taskReviewAccordion.inReview")}
        </span>
      );
    case "PENDING":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-muted text-muted-foreground rounded-[8px] text-[13px] font-medium">
          <Clock className="w-3.5 h-3.5" />
          {t("widget.taskReviewAccordion.pending")}
        </span>
      );
    default:
      return null;
  }
}

export function TaskReviewAccordion({ tasks }: TaskReviewAccordionProps) {
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set());
  const { t } = useTranslation();

  const toggleTask = (taskId: string) => {
    setExpandedTasks((prev) => {
      const next = new Set(prev);
      if (next.has(taskId)) {
        next.delete(taskId);
      } else {
        next.add(taskId);
      }
      return next;
    });
  };

  const toggleReview = (reviewId: string) => {
    setExpandedReviews((prev) => {
      const next = new Set(prev);
      if (next.has(reviewId)) {
        next.delete(reviewId);
      } else {
        next.add(reviewId);
      }
      return next;
    });
  };

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div
          key={task.taskId}
          className="bg-card border-2 border-border rounded-[16px] overflow-hidden"
        >
          {/* Task Header */}
          <div
            className="p-4 desktop:p-5 cursor-pointer hover:bg-muted transition-colors"
            onClick={() => toggleTask(task.taskId)}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-[13px] text-muted-foreground">{task.courseName}</span>
                  <span className="text-border">•</span>
                  <h3 className="text-[16px] desktop:text-[18px] font-medium text-foreground tracking-[-0.3px]">
                    {task.taskTitle}
                  </h3>
                </div>

                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <StatusBadge status={task.status} t={t} />

                  {task.status === "PUBLISHED" && task.currentScore !== undefined && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-primary-light text-foreground rounded-[8px] text-[13px] font-medium">
                      {t("widget.taskReviewAccordion.score")} {task.currentScore}/{task.maxScore}
                    </span>
                  )}

                  {task.status === "IN_REVIEW" && (
                    <span className="text-[13px] text-muted-foreground">
                      {t("widget.taskReviewAccordion.reviewing")} {task.reviewsReceived}/
                      {task.reviewsRequired}
                    </span>
                  )}

                  {task.status === "PENDING" && (
                    <span className="text-[13px] text-muted-foreground">
                      {t("widget.taskReviewAccordion.awaitingReview")}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-[14px] text-muted-foreground">
                  <FileText className="w-4 h-4" />
                  <span>
                    {task.reviewsReceived > 0
                      ? `${task.reviewsReceived} ${task.reviewsReceived === 1 ? t("widget.taskReviewAccordion.reviewOne") : t("widget.taskReviewAccordion.reviewFew")}`
                      : t("widget.taskReviewAccordion.noReviews")}
                  </span>
                </div>

                {task.status === "IN_REVIEW" && (
                  <div className="mt-3 flex items-start gap-2 text-[13px] text-muted-foreground bg-muted rounded-[8px] p-3">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{t("widget.taskReviewAccordion.resultAfterReview")}</span>
                  </div>
                )}
              </div>

              <button className="p-2 hover:bg-surface-hover rounded-[8px] transition-colors shrink-0">
                {expandedTasks.has(task.taskId) ? (
                  <ChevronUp className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                )}
              </button>
            </div>
          </div>

          {/* Expanded Content - Reviews */}
          {expandedTasks.has(task.taskId) && task.reviews.length > 0 && (
            <div className="border-t-2 border-border bg-muted p-4 desktop:p-5">
              <div className="space-y-4">
                {task.reviews.map((review) => (
                  <div
                    key={review.reviewId}
                    className="bg-card border-2 border-border rounded-[12px] overflow-hidden"
                  >
                    <div
                      className="p-4 cursor-pointer hover:bg-muted transition-colors"
                      onClick={() => toggleReview(review.reviewId)}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <span className="text-[14px] font-medium text-foreground">
                              {review.isAnonymous
                                ? t("widget.taskReviewAccordion.anonymousReviewer")
                                : review.reviewerName}
                            </span>
                            <span className="text-[12px] text-muted-foreground">
                              {review.submittedAt}
                            </span>
                          </div>
                          <p className="text-[14px] text-muted-foreground line-clamp-2">
                            {review.overallComment}
                          </p>
                        </div>

                        <button className="p-1 hover:bg-surface-hover rounded-[8px] transition-colors shrink-0">
                          {expandedReviews.has(review.reviewId) ? (
                            <ChevronUp className="w-4 h-4 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-muted-foreground" />
                          )}
                        </button>
                      </div>
                    </div>

                    {expandedReviews.has(review.reviewId) && (
                      <div className="border-t-2 border-border p-4 space-y-4">
                        <div>
                          <h4 className="text-[14px] font-medium text-foreground mb-3">
                            {t("widget.taskReviewAccordion.scoresByCriteria")}
                          </h4>
                          <div className="space-y-3">
                            {review.criteria.map((criterion, idx) => (
                              <div key={idx} className="bg-muted rounded-[8px] p-3">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-[14px] text-foreground font-medium">
                                    {criterion.name}
                                  </span>
                                  <span className="text-[14px] font-medium text-brand-primary">
                                    {criterion.score}/{criterion.maxScore}
                                  </span>
                                </div>
                                {criterion.comment && (
                                  <p className="text-[13px] text-muted-foreground leading-[1.5]">
                                    {criterion.comment}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="text-[14px] font-medium text-foreground mb-2">
                            {t("widget.taskReviewAccordion.overallComment")}
                          </h4>
                          <p className="text-[14px] text-muted-foreground leading-[1.6] bg-muted rounded-[8px] p-3">
                            {review.overallComment}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {task.allowAppeal && task.status === "PUBLISHED" && (
                <div className="mt-4 pt-4 border-t-2 border-border">
                  <button
                    onClick={() => {
                      alert(t("widget.taskReviewAccordion.requestReviewAlert"));
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-card border-2 border-brand-primary-light hover:bg-muted hover:border-brand-primary text-foreground rounded-[12px] text-[14px] font-medium transition-colors"
                  >
                    <AlertCircle className="w-4 h-4" />
                    {t("widget.taskReviewAccordion.requestReview")}
                  </button>
                </div>
              )}
            </div>
          )}

          {expandedTasks.has(task.taskId) && task.reviews.length === 0 && (
            <div className="border-t-2 border-border bg-muted p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-muted rounded-full mb-3">
                <Clock className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-[14px] text-muted-foreground">
                {t("widget.taskReviewAccordion.noReviewsYet")}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
