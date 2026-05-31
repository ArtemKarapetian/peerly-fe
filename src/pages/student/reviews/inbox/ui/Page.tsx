import { useState, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { AdvancedPagination } from "@/shared/ui/advanced-pagination";
import { ErrorBanner } from "@/shared/ui/ErrorBanner";
import { PageHeader } from "@/shared/ui/PageHeader";
import { PageSkeleton } from "@/shared/ui/PageSkeleton";
import { usePagination } from "@/shared/ui/simple-pagination";

import { AppShell } from "@/widgets/app-shell";
import {
  ReviewCard,
  ReviewFilters,
  ReviewSort,
  useAssignedReviewsInbox,
} from "@/widgets/reviews-inbox";
import type { ReviewFilter, ReviewSortDirection } from "@/widgets/reviews-inbox";

const TWO_DAYS_MS = 2 * 24 * 60 * 60 * 1000;
const PAGE_SIZE = 9;

export default function ReviewsInboxPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data, isLoading, error, refetch } = useAssignedReviewsInbox();
  const reviews = data ?? [];

  const [filter, setFilter] = useState<ReviewFilter>("all");
  const [sortDirection, setSortDirection] = useState<ReviewSortDirection>("asc");
  const [now] = useState(() => Date.now());

  const isDeadlineSoon = useCallback((ts: number) => ts > now && ts - now < TWO_DAYS_MS, [now]);

  const notStarted = reviews.filter((r) => r.status === "not_started");
  const submitted = reviews.filter((r) => r.status === "submitted");

  const filtered = filter === "all" ? reviews : filter === "not_started" ? notStarted : submitted;

  const sorted = useMemo(() => {
    const sign = sortDirection === "asc" ? 1 : -1;
    return [...filtered].sort(
      (a, b) => sign * (a.reviewDeadlineTimestamp - b.reviewDeadlineTimestamp),
    );
  }, [filtered, sortDirection]);

  const { currentPage, totalPages, currentItems, setCurrentPage } = usePagination(
    sorted,
    PAGE_SIZE,
  );

  const counts = {
    all: reviews.length,
    notStarted: notStarted.length,
    submitted: submitted.length,
  };

  const handleClick = (id: string) => {
    setTimeout(() => {
      void navigate(`/student/reviews/${id}`);
    }, 0);
  };

  const isEmpty = sorted.length === 0;

  return (
    <AppShell title={t("student.reviews.title")}>
      <PageHeader title={t("student.reviews.title")} subtitle={t("student.reviews.subtitle")} />

      <div className="flex items-center justify-between gap-3 flex-wrap mb-6">
        <ReviewFilters filter={filter} counts={counts} onFilterChange={setFilter} />
        <ReviewSort
          direction={sortDirection}
          onToggle={() => setSortDirection((d) => (d === "asc" ? "desc" : "asc"))}
        />
      </div>

      {isLoading && <PageSkeleton />}

      {!isLoading && error && <ErrorBanner error={error} onRetry={() => void refetch()} />}

      {!isLoading && !error && isEmpty && (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="bg-muted rounded-xl p-8 max-w-[480px] text-center">
            <div className="mb-4">
              <div className="w-16 h-16 bg-brand-primary-lighter rounded-full mx-auto flex items-center justify-center">
                <span className="text-page-h1">📝</span>
              </div>
            </div>
            <h2 className="text-2xl font-medium text-foreground mb-3 tracking-[-0.5px]">
              {filter === "all" && t("student.reviews.noAssigned")}
              {filter === "not_started" && t("student.reviews.noToStart")}
              {filter === "submitted" && t("student.reviews.noSubmitted")}
            </h2>
            <p className="text-base text-muted-foreground leading-[1.5]">
              {filter === "all" && t("student.reviews.willAppear")}
              {filter === "not_started" && t("student.reviews.allStarted")}
              {filter === "submitted" && t("student.reviews.notSubmittedYet")}
            </p>
          </div>
        </div>
      )}

      {!isLoading && !error && !isEmpty && (
        <>
          <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 gap-4">
            {currentItems.map((review) => (
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

          {totalPages > 1 && (
            <AdvancedPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              className="mt-6"
            />
          )}
        </>
      )}
    </AppShell>
  );
}
