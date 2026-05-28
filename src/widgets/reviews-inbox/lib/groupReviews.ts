import type { ReviewAssignment } from "@/entities/review/model/types.ts";

export interface ReviewGroup {
  key: string;
  title: string;
  reviews: ReviewAssignment[];
}

export function groupByCourse(reviews: ReviewAssignment[]): ReviewGroup[] {
  const grouped = new Map<string, ReviewAssignment[]>();
  for (const review of reviews) {
    const list = grouped.get(review.courseName) ?? [];
    list.push(review);
    grouped.set(review.courseName, list);
  }
  return Array.from(grouped.entries()).map(([courseName, courseReviews]) => ({
    key: courseName,
    title: courseName,
    reviews: courseReviews.sort((a, b) => a.reviewDeadlineTimestamp - b.reviewDeadlineTimestamp),
  }));
}

type TFn = (key: string) => string;

const DAY_MS = 24 * 60 * 60 * 1000;

export function groupByDeadline(reviews: ReviewAssignment[], t: TFn): ReviewGroup[] {
  const now = Date.now();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTs = today.getTime();
  const tomorrowTs = todayTs + DAY_MS;
  const dayAfterTomorrowTs = tomorrowTs + DAY_MS;
  const weekTs = todayTs + 7 * DAY_MS;

  const buckets = {
    overdue: [] as ReviewAssignment[],
    today: [] as ReviewAssignment[],
    tomorrow: [] as ReviewAssignment[],
    thisWeek: [] as ReviewAssignment[],
    later: [] as ReviewAssignment[],
  };

  for (const review of reviews) {
    const deadline = review.reviewDeadlineTimestamp;
    if (deadline < now) buckets.overdue.push(review);
    else if (deadline < tomorrowTs) buckets.today.push(review);
    else if (deadline < dayAfterTomorrowTs) buckets.tomorrow.push(review);
    else if (deadline < weekTs) buckets.thisWeek.push(review);
    else buckets.later.push(review);
  }

  const sortAsc = (a: ReviewAssignment, b: ReviewAssignment) =>
    a.reviewDeadlineTimestamp - b.reviewDeadlineTimestamp;
  const sortDesc = (a: ReviewAssignment, b: ReviewAssignment) =>
    b.reviewDeadlineTimestamp - a.reviewDeadlineTimestamp;

  const result: ReviewGroup[] = [];
  if (buckets.overdue.length > 0) {
    result.push({
      key: "overdue",
      title: `⚠️ ${t("widget.reviewList.overdue")}`,
      reviews: buckets.overdue.sort(sortDesc),
    });
  }
  if (buckets.today.length > 0) {
    result.push({
      key: "today",
      title: t("widget.reviewList.today"),
      reviews: buckets.today.sort(sortAsc),
    });
  }
  if (buckets.tomorrow.length > 0) {
    result.push({
      key: "tomorrow",
      title: t("widget.reviewList.tomorrow"),
      reviews: buckets.tomorrow.sort(sortAsc),
    });
  }
  if (buckets.thisWeek.length > 0) {
    result.push({
      key: "thisWeek",
      title: t("widget.reviewList.thisWeek"),
      reviews: buckets.thisWeek.sort(sortAsc),
    });
  }
  if (buckets.later.length > 0) {
    result.push({
      key: "later",
      title: t("widget.reviewList.later"),
      reviews: buckets.later.sort(sortAsc),
    });
  }
  return result;
}
