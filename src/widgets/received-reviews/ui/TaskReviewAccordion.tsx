import { ChevronDown, ChevronUp, CheckCircle, Clock } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const MARK_MAX = 5;

interface Review {
  reviewId: string;
  mark: number;
  comment: string;
}

interface TaskSubmission {
  taskId: string;
  courseName: string;
  taskTitle: string;
  status: "PUBLISHED" | "IN_REVIEW" | "PENDING";
  finalMark: number | null;
  reviewsReceived: number;
  reviewsRequired: number;
  reviews: Review[];
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
  }
}

export function TaskReviewAccordion({ tasks }: TaskReviewAccordionProps) {
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());
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

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div
          key={task.taskId}
          className="bg-card border-2 border-border rounded-[16px] overflow-hidden"
        >
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

                <div className="flex flex-wrap items-center gap-3">
                  <StatusBadge status={task.status} t={t} />

                  {task.status === "PUBLISHED" && task.finalMark !== null && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-primary-light text-foreground rounded-[8px] text-[13px] font-medium">
                      {t("widget.taskReviewAccordion.finalMark")} {task.finalMark}/{MARK_MAX}
                    </span>
                  )}

                  <span className="text-[13px] text-muted-foreground">
                    {t("widget.taskReviewAccordion.reviewing")} {task.reviewsReceived}/
                    {task.reviewsRequired}
                  </span>
                </div>
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

          {expandedTasks.has(task.taskId) && task.reviews.length > 0 && (
            <div className="border-t-2 border-border bg-muted p-4 desktop:p-5">
              <ul className="space-y-3">
                {task.reviews.map((review) => (
                  <li
                    key={review.reviewId}
                    className="bg-card border border-border rounded-[12px] p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[14px] font-medium text-foreground">
                        {t("widget.taskReviewAccordion.anonymousReviewer")}
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-brand-primary-lighter text-foreground rounded-[6px] text-[13px] font-medium">
                        {t("widget.taskReviewAccordion.reviewMark")} {review.mark}/{MARK_MAX}
                      </span>
                    </div>
                    {review.comment && (
                      <p className="text-[14px] text-foreground leading-[1.5] whitespace-pre-wrap">
                        {review.comment}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
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
