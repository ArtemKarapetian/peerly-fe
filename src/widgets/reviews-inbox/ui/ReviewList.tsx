import { useState } from "react";
import { useTranslation } from "react-i18next";

import type { ReviewAssignment } from "@/entities/review/model/types.ts";

import { groupByCourse, groupByDeadline } from "../lib/groupReviews";

import { ReviewGroupBlock } from "./ReviewGroupBlock";

const TWO_DAYS_MS = 2 * 24 * 60 * 60 * 1000;

export type GroupBy = "course" | "deadline";

interface ReviewListProps {
  reviews: ReviewAssignment[];
  groupBy: GroupBy;
  onReviewClick: (reviewId: string) => void;
}

export function ReviewList({ reviews, groupBy, onReviewClick }: ReviewListProps) {
  const { t } = useTranslation();
  const [now] = useState(() => Date.now());

  if (reviews.length === 0) return null;

  const groups = groupBy === "course" ? groupByCourse(reviews) : groupByDeadline(reviews, t);

  return (
    <div className="space-y-8">
      {groups.map((group) => (
        <ReviewGroupBlock
          key={group.key}
          title={group.title}
          reviews={group.reviews}
          now={now}
          twoDaysMs={TWO_DAYS_MS}
          onReviewClick={onReviewClick}
        />
      ))}
    </div>
  );
}
