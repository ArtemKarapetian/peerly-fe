import { ReviewCard } from "./ReviewCard.tsx";

import { ReviewAssignment } from "@/entities/review/model/types.ts";

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
  if (reviews.length === 0) {
    return null;
  }

  // Group reviews
  const groupedReviews = groupBy === "course" ? groupByCourse(reviews) : groupByDeadline(reviews);

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
                {group.reviews.length} {group.reviews.length === 1 ? "рецензия" : "рецензии"}
              </span>
            </div>
          </div>

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 gap-4">
            {group.reviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
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
function groupByDeadline(reviews: ReviewAssignment[]) {
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
      title: "⚠️ Просрочено",
      reviews: groups.overdue.sort((a, b) => b.reviewDeadlineTimestamp - a.reviewDeadlineTimestamp),
    });
  }

  if (groups.today.length > 0) {
    result.push({
      key: "today",
      title: "Сегодня",
      reviews: groups.today.sort((a, b) => a.reviewDeadlineTimestamp - b.reviewDeadlineTimestamp),
    });
  }

  if (groups.tomorrow.length > 0) {
    result.push({
      key: "tomorrow",
      title: "Завтра",
      reviews: groups.tomorrow.sort(
        (a, b) => a.reviewDeadlineTimestamp - b.reviewDeadlineTimestamp,
      ),
    });
  }

  if (groups.thisWeek.length > 0) {
    result.push({
      key: "thisWeek",
      title: "На этой неделе",
      reviews: groups.thisWeek.sort(
        (a, b) => a.reviewDeadlineTimestamp - b.reviewDeadlineTimestamp,
      ),
    });
  }

  if (groups.later.length > 0) {
    result.push({
      key: "later",
      title: "Позже",
      reviews: groups.later.sort((a, b) => a.reviewDeadlineTimestamp - b.reviewDeadlineTimestamp),
    });
  }

  return result;
}
