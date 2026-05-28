import { useTranslation } from "react-i18next";

import type { ReviewAssignment } from "@/entities/review/model/types.ts";

import { ReviewCard } from "./ReviewCard.tsx";

interface ReviewGroupBlockProps {
  title: string;
  reviews: ReviewAssignment[];
  now: number;
  twoDaysMs: number;
  onReviewClick: (reviewId: string) => void;
}

export function ReviewGroupBlock({
  title,
  reviews,
  now,
  twoDaysMs,
  onReviewClick,
}: ReviewGroupBlockProps) {
  const { t } = useTranslation();
  return (
    <div>
      <div className="mb-4 pb-3 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-xl desktop:text-2xl font-medium text-foreground tracking-[-0.5px]">
            {title}
          </h2>
          <span className="text-sm text-muted-foreground">
            {t("widget.reviewList.review", { count: reviews.length })}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 gap-4">
        {reviews.map((review) => (
          <ReviewCard
            key={review.id}
            id={review.id}
            courseName={review.courseName}
            taskTitle={review.taskTitle}
            studentName={
              review.isAnonymous
                ? t("widget.reviewList.anonymousAuthor")
                : t("widget.reviewList.studentLabel")
            }
            reviewDeadline={review.reviewDeadline}
            status={review.status}
            isDeadlineSoon={
              review.reviewDeadlineTimestamp - now < twoDaysMs &&
              review.reviewDeadlineTimestamp > now
            }
            onClick={() => onReviewClick(review.id)}
          />
        ))}
      </div>
    </div>
  );
}
