import { useState } from "react";
import { useTranslation } from "react-i18next";

import { ReviewAssignment } from "@/entities/review/model/types.ts";

import { ReviewCard } from "./ReviewCard.tsx";

/**
 * ReviewList - Список назначенных рецензий с группировкой
 *
 * Features:
 * - Group by course or by deadline
 * - Display count in group headers
 * - Responsive grid layout
 */

export type GroupBy = "course" | "deadline";

interface ReviewListProps {
  reviews: ReviewAssignment[];
  groupBy: GroupBy;
  onReviewClick: (reviewId: string) => void;
}

export function ReviewList({ reviews, groupBy, onReviewClick }: ReviewListProps) {
  const [now] = useState(() => Date.now());
  const { t } = useTranslation();

  if (reviews.length === 0) {
    return null;
  }

  const twoDays = 2 * 24 * 60 * 60 * 1000;

  // Group reviews
  const groupedReviews =
    groupBy === "course" ? groupByCourse(reviews) : groupByDeadline(reviews, t);

  return (
    <div className="space-y-8">
      {groupedReviews.map((group) => (
        <div key={group.key}>
          {/* Group Header */}
          <div className="mb-4 pb-3 border-b border-[#e6e8ee]">
            <div className="flex items-center justify-between">
              <h2 className="text-[20px] desktop:text-[24px] font-medium text-[#21214f] tracking-[-0.5px]">
                {group.title}
              </h2>
              <span className="text-[14px] text-[#767692]">
                {group.reviews.length}{" "}
                {group.reviews.length === 1
                  ? t("widget.reviewList.reviewOne")
                  : t("widget.reviewList.reviewFew")}
              </span>
            </div>
          </div>

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 gap-4">
            {group.reviews.map((review) => (
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
                  review.reviewDeadlineTimestamp - now < twoDays &&
                  review.reviewDeadlineTimestamp > now
                }
                onClick={() => onReviewClick(review.id)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// Helper: Group by course
function groupByCourse(reviews: ReviewAssignment[]) {
  const grouped = new Map<string, ReviewAssignment[]>();

  reviews.forEach((review) => {
    const key = review.courseName;
    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key)!.push(review);
  });

  return Array.from(grouped.entries()).map(([courseName, reviews]) => ({
    key: courseName,
    title: courseName,
    reviews: reviews.sort((a, b) => a.reviewDeadlineTimestamp - b.reviewDeadlineTimestamp),
  }));
}

// Helper: Group by deadline
function groupByDeadline(reviews: ReviewAssignment[], t: (key: string) => string) {
  const now = Date.now();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTimestamp = today.getTime();
  const tomorrowTimestamp = todayTimestamp + 24 * 60 * 60 * 1000;
  const weekTimestamp = todayTimestamp + 7 * 24 * 60 * 60 * 1000;

  const groups = {
    overdue: [] as ReviewAssignment[],
    today: [] as ReviewAssignment[],
    tomorrow: [] as ReviewAssignment[],
    thisWeek: [] as ReviewAssignment[],
    later: [] as ReviewAssignment[],
  };

  reviews.forEach((review) => {
    const deadline = review.reviewDeadlineTimestamp;

    if (deadline < now) {
      groups.overdue.push(review);
    } else if (deadline < tomorrowTimestamp) {
      groups.today.push(review);
    } else if (deadline < tomorrowTimestamp + 24 * 60 * 60 * 1000) {
      groups.tomorrow.push(review);
    } else if (deadline < weekTimestamp) {
      groups.thisWeek.push(review);
    } else {
      groups.later.push(review);
    }
  });

  const result = [];

  if (groups.overdue.length > 0) {
    result.push({
      key: "overdue",
      title: `⚠️ ${t("widget.reviewList.overdue")}`,
      reviews: groups.overdue.sort((a, b) => b.reviewDeadlineTimestamp - a.reviewDeadlineTimestamp),
    });
  }

  if (groups.today.length > 0) {
    result.push({
      key: "today",
      title: t("widget.reviewList.today"),
      reviews: groups.today.sort((a, b) => a.reviewDeadlineTimestamp - b.reviewDeadlineTimestamp),
    });
  }

  if (groups.tomorrow.length > 0) {
    result.push({
      key: "tomorrow",
      title: t("widget.reviewList.tomorrow"),
      reviews: groups.tomorrow.sort(
        (a, b) => a.reviewDeadlineTimestamp - b.reviewDeadlineTimestamp,
      ),
    });
  }

  if (groups.thisWeek.length > 0) {
    result.push({
      key: "thisWeek",
      title: t("widget.reviewList.thisWeek"),
      reviews: groups.thisWeek.sort(
        (a, b) => a.reviewDeadlineTimestamp - b.reviewDeadlineTimestamp,
      ),
    });
  }

  if (groups.later.length > 0) {
    result.push({
      key: "later",
      title: t("widget.reviewList.later"),
      reviews: groups.later.sort((a, b) => a.reviewDeadlineTimestamp - b.reviewDeadlineTimestamp),
    });
  }

  return result;
}
