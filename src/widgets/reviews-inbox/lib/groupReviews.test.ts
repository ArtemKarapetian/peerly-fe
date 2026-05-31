import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { ReviewAssignment } from "@/entities/review/model/types.ts";

import { groupByCourse, groupByDeadline } from "./groupReviews";

const NOW = new Date("2026-06-01T12:00:00Z").getTime();
const DAY = 24 * 60 * 60 * 1000;

function review(id: string, courseName: string, deadlineTs: number): ReviewAssignment {
  return {
    id,
    taskTitle: `task-${id}`,
    courseName,
    courseId: `c-${courseName}`,
    taskId: `t-${id}`,
    reviewDeadline: new Date(deadlineTs).toISOString(),
    reviewDeadlineTimestamp: deadlineTs,
    status: "not_started",
    isAnonymous: false,
  };
}

describe("groupByCourse", () => {
  it("groups items by courseName", () => {
    const groups = groupByCourse([
      review("a", "Algebra", NOW + DAY),
      review("b", "Geometry", NOW + DAY),
      review("c", "Algebra", NOW + 2 * DAY),
    ]);
    expect(groups).toHaveLength(2);
    const algebra = groups.find((g) => g.key === "Algebra")!;
    expect(algebra.reviews.map((r) => r.id)).toEqual(["a", "c"]);
  });

  it("sorts each group by deadline ASC", () => {
    const groups = groupByCourse([
      review("late", "A", NOW + 5 * DAY),
      review("early", "A", NOW + DAY),
    ]);
    expect(groups[0].reviews.map((r) => r.id)).toEqual(["early", "late"]);
  });
});

describe("groupByDeadline", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(NOW));
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  const t = (key: string) => key;

  it("buckets into overdue / today / tomorrow / thisWeek / later", () => {
    const todayMidnight = new Date(NOW);
    todayMidnight.setHours(0, 0, 0, 0);
    const todayMidnightTs = todayMidnight.getTime();

    const groups = groupByDeadline(
      [
        review("overdue", "X", NOW - 5 * DAY),
        review("today", "X", NOW + 5 * 60 * 60 * 1000),
        review("tomorrow", "X", todayMidnightTs + DAY + 60 * 1000),
        review("thisWeek", "X", todayMidnightTs + 3 * DAY),
        review("later", "X", todayMidnightTs + 30 * DAY),
      ],
      t,
    );

    expect(groups.map((g) => g.key)).toEqual(["overdue", "today", "tomorrow", "thisWeek", "later"]);
    expect(groups[0].reviews[0].id).toBe("overdue");
    expect(groups[1].reviews[0].id).toBe("today");
  });

  it("skips empty buckets", () => {
    const groups = groupByDeadline([review("later-only", "X", NOW + 30 * DAY)], t);
    expect(groups.map((g) => g.key)).toEqual(["later"]);
  });

  it("sorts overdue descending (most recent first), others ascending", () => {
    const groups = groupByDeadline(
      [review("overdue-old", "X", NOW - 10 * DAY), review("overdue-recent", "X", NOW - DAY)],
      t,
    );
    const overdueOrder = groups.find((g) => g.key === "overdue")!.reviews.map((r) => r.id);
    expect(overdueOrder).toEqual(["overdue-recent", "overdue-old"]);
  });
});
