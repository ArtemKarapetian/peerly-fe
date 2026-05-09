import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { PageHeader } from "@/shared/ui/PageHeader";

import { AppShell } from "@/widgets/app-shell/AppShell.tsx";
import { ReviewCard, ReviewFilters } from "@/widgets/reviews-inbox";
import type { ReviewFilter } from "@/widgets/reviews-inbox";

import { useAssignedReviewsInbox } from "../model/queries";

const TWO_DAYS_MS = 2 * 24 * 60 * 60 * 1000;

export default function ReviewsInboxPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data, isLoading } = useAssignedReviewsInbox();
  const reviews = data ?? [];

  const [filter, setFilter] = useState<ReviewFilter>("all");
  const [now] = useState(() => Date.now());

  const isDeadlineSoon = useCallback((ts: number) => ts > now && ts - now < TWO_DAYS_MS, [now]);

  const filtered = filter === "all" || filter === "not_started" ? reviews : [];

  const counts = {
    all: reviews.length,
    notStarted: reviews.length,
    drafts: 0,
    submitted: 0,
  };

  const handleClick = (id: string) => {
    setTimeout(() => {
      void navigate(`/student/reviews/${id}`);
    }, 0);
  };

  const isEmpty = filtered.length === 0;

  return (
    <AppShell title={t("student.reviews.title")}>
      <PageHeader title={t("student.reviews.title")} subtitle={t("student.reviews.subtitle")} />

      <ReviewFilters filter={filter} counts={counts} onFilterChange={setFilter} />

      {isLoading && <p className="text-[14px] text-text-tertiary">{t("common.loading")}</p>}

      {!isLoading && isEmpty && (
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

      {!isLoading && !isEmpty && (
        <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 gap-4">
          {filtered.map((review) => (
            <ReviewCard
              key={review.id}
              id={review.id}
              courseName={review.courseName}
              taskTitle={review.taskTitle}
              studentName={t("student.reviews.anonymousAuthor")}
              reviewDeadline={review.reviewDeadline}
              status={review.status}
              isDeadlineSoon={isDeadlineSoon(review.reviewDeadlineTimestamp)}
              onClick={() => handleClick(review.id)}
            />
          ))}
        </div>
      )}
    </AppShell>
  );
}
