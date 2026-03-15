import { useState, useCallback } from "react";

import { PageHeader } from "@/shared/ui/PageHeader";

import { useReviewStore } from "@/entities/review/api/reviewRepo.mock.ts";

import { AppShell } from "@/widgets/app-shell/AppShell.tsx";
import { ReviewCard, ReviewFilters } from "@/widgets/reviews-inbox";
import type { ReviewFilter } from "@/widgets/reviews-inbox";

export default function ReviewsInboxPage() {
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
    <AppShell title="Рецензии">
      <PageHeader title="Рецензии" subtitle="Назначенные вам работы для рецензирования" />

      <ReviewFilters filter={filter} counts={counts} onFilterChange={setFilter} />

      {isEmpty && (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="bg-[#f9f9f9] rounded-[20px] p-8 max-w-[480px] text-center">
            <div className="mb-4">
              <div className="w-16 h-16 bg-[#d2e1f8] rounded-full mx-auto flex items-center justify-center">
                <span className="text-[32px]">📝</span>
              </div>
            </div>
            <h2 className="text-[24px] font-medium text-[#21214f] mb-3 tracking-[-0.5px]">
              {filter === "all" && "Нет назначенных рецензий"}
              {filter === "not_started" && "Нет рецензий для начала"}
              {filter === "drafts" && "Нет черновиков"}
              {filter === "submitted" && "Нет отправленных рецензий"}
            </h2>
            <p className="text-[16px] text-[#767692] leading-[1.5]">
              {filter === "all" && "Когда вам назначат рецензии, они появятся здесь."}
              {filter === "not_started" && "Все ваши рецензии уже начаты или завершены."}
              {filter === "drafts" && "У вас нет черновиков рецензий."}
              {filter === "submitted" && "Вы еще не отправили ни одной рецензии."}
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
              studentName={review.isAnonymous ? "Анонимный автор" : "Студент"}
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
