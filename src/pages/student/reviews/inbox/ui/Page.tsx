import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";

import { PageHeader } from "@/shared/ui/PageHeader";

import { useReviewStore } from "@/entities/review/api/reviewRepo.mock.ts";

import { AppShell } from "@/widgets/app-shell/AppShell.tsx";
import { ReviewCard, ReviewFilters } from "@/widgets/reviews-inbox";
import type { ReviewFilter } from "@/widgets/reviews-inbox";

export default function ReviewsInboxPage() {
  const { t } = useTranslation();
  const { reviews } = useReviewStore();
  const [filter, setFilter] = useState<ReviewFilter>("all");

  const filteredReviews = reviews.filter((review) => {
    if (filter === "all") return true;
    if (filter === "not_started") return review.status === "not_started";
    if (filter === "drafts") return review.status === "draft";
    if (filter === "submitted") return review.status === "submitted";
    return true;
  });

  const handleReviewClick = (reviewId: string) => {
    setTimeout(() => {
      window.location.hash = `/reviews/${reviewId}`;
    }, 0);
  };

  const [now] = useState(() => Date.now());
  const twoDays = 2 * 24 * 60 * 60 * 1000;

  const isDeadlineSoon = useCallback(
    (deadlineTimestamp: number) => {
      return deadlineTimestamp - now < twoDays && deadlineTimestamp > now;
    },
    [now],
  );

  const counts = {
    all: reviews.length,
    notStarted: reviews.filter((r) => r.status === "not_started").length,
    drafts: reviews.filter((r) => r.status === "draft").length,
    submitted: reviews.filter((r) => r.status === "submitted").length,
  };

  const isEmpty = filteredReviews.length === 0;

  return (
    <AppShell title={t("student.reviews.title")}>
      <PageHeader title={t("student.reviews.title")} subtitle={t("student.reviews.subtitle")} />

      <ReviewFilters filter={filter} counts={counts} onFilterChange={setFilter} />

      {isEmpty && (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="bg-muted rounded-[20px] p-8 max-w-[480px] text-center">
            <div className="mb-4">
              <div className="w-16 h-16 bg-brand-primary-lighter rounded-full mx-auto flex items-center justify-center">
                <span className="text-[32px]">📝</span>
              </div>
            </div>
            <h2 className="text-[24px] font-medium text-foreground mb-3 tracking-[-0.5px]">
              {filter === "all" && t("student.reviews.noAssigned")}
              {filter === "not_started" && t("student.reviews.noToStart")}
              {filter === "drafts" && t("student.reviews.noDrafts")}
              {filter === "submitted" && t("student.reviews.noSubmitted")}
            </h2>
            <p className="text-[16px] text-muted-foreground leading-[1.5]">
              {filter === "all" && t("student.reviews.willAppear")}
              {filter === "not_started" && t("student.reviews.allStarted")}
              {filter === "drafts" && t("student.reviews.noDraftReviews")}
              {filter === "submitted" && t("student.reviews.notSubmittedYet")}
            </p>
          </div>
        </div>
      )}

      {!isEmpty && (
        <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 gap-4">
          {filteredReviews.map((review) => (
            <ReviewCard
              key={review.id}
              id={review.id}
              courseName={review.courseName}
              taskTitle={review.taskTitle}
              studentName={
                review.isAnonymous
                  ? t("student.reviews.anonymousAuthor")
                  : t("widget.reviewList.studentLabel")
              }
              reviewDeadline={review.reviewDeadline}
              status={review.status}
              isDeadlineSoon={isDeadlineSoon(review.reviewDeadlineTimestamp)}
              onClick={() => handleReviewClick(review.id)}
            />
          ))}
        </div>
      )}
    </AppShell>
  );
}
