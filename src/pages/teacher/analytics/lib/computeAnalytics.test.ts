import { describe, expect, it } from "vitest";

import type { AnalyticsRawData, Student } from "../model/types";

import {
  computeAssignmentMetrics,
  computeGradebook,
  computeOverallMetrics,
  mean,
  truncate,
} from "./computeAnalytics";

const STUDENTS: Student[] = [
  { studentId: "s1", name: "Alice", email: "a@x" },
  { studentId: "s2", name: "Bob", email: "b@x" },
];

function makeRawData(): AnalyticsRawData {
  return {
    courses: [{ id: "c1", title: "Algebra" } as unknown as AnalyticsRawData["courses"][number]],
    assignments: [
      {
        id: "a1",
        courseId: "c1",
        title: "HW1",
        reviewCount: 2,
      } as unknown as AnalyticsRawData["assignments"][number],
      {
        id: "a2",
        courseId: "c1",
        title: "HW2",
        reviewCount: 2,
      } as unknown as AnalyticsRawData["assignments"][number],
      {
        id: "a3",
        courseId: "c2",
        title: "Other course",
        reviewCount: 2,
      } as unknown as AnalyticsRawData["assignments"][number],
    ],
    submissions: [],
    reviews: [],
  };
}

describe("mean", () => {
  it("returns 0 for empty input", () => {
    expect(mean([])).toBe(0);
  });
  it("computes arithmetic mean", () => {
    expect(mean([1, 2, 3])).toBe(2);
    expect(mean([10, 20])).toBe(15);
  });
});

describe("truncate", () => {
  it("keeps short strings unchanged", () => {
    expect(truncate("hi", 5)).toBe("hi");
  });
  it("trims with ellipsis when over limit", () => {
    expect(truncate("0123456789", 5)).toBe("01234…");
  });
});

describe("computeAssignmentMetrics", () => {
  it("returns empty list when there are no assignments in the course", () => {
    const data = makeRawData();
    data.assignments = [];
    const metrics = computeAssignmentMetrics({
      data,
      students: STUDENTS,
      selectedCourseId: "c1",
    });
    expect(metrics).toEqual([]);
  });

  it("computes 0% submission rate when no submissions", () => {
    const data = makeRawData();
    const metrics = computeAssignmentMetrics({
      data,
      students: STUDENTS,
      selectedCourseId: "c1",
    });
    expect(metrics).toHaveLength(2);
    expect(metrics[0].submissionRate).toBe(0);
    expect(metrics[0].reviewCompletionRate).toBe(0);
    expect(metrics[0].avgScore).toBe(0);
    expect(metrics[0].hasDiscrepancyData).toBe(false);
  });

  it("filters by selectedAssignmentId", () => {
    const data = makeRawData();
    const metrics = computeAssignmentMetrics({
      data,
      students: STUDENTS,
      selectedCourseId: "c1",
      selectedAssignmentId: "a1",
    });
    expect(metrics).toHaveLength(1);
    expect(metrics[0].id).toBe("a1");
  });

  it("ignores assignments from other courses", () => {
    const data = makeRawData();
    const metrics = computeAssignmentMetrics({
      data,
      students: STUDENTS,
      selectedCourseId: "c1",
    });
    expect(metrics.find((m) => m.id === "a3")).toBeUndefined();
  });

  it("computes submission rate from completed submissions", () => {
    const data = makeRawData();
    data.submissions = [
      {
        id: "sub1",
        assignmentId: "a1",
        studentId: "s1",
        status: "submitted",
      } as unknown as AnalyticsRawData["submissions"][number],
    ];
    const metrics = computeAssignmentMetrics({
      data,
      students: STUDENTS,
      selectedCourseId: "c1",
    });
    const a1Metric = metrics.find((m) => m.id === "a1")!;
    expect(a1Metric.submissionRate).toBe(50);
  });

  it("computes discrepancy from min/max of two review averages", () => {
    const data = makeRawData();
    data.submissions = [
      {
        id: "sub1",
        assignmentId: "a1",
        studentId: "s1",
        status: "submitted",
      } as unknown as AnalyticsRawData["submissions"][number],
    ];
    data.reviews = [
      {
        id: "r1",
        submissionId: "sub1",
        status: "submitted",
        scores: [{ criterionId: "c1", score: 5, comment: null }],
      } as unknown as AnalyticsRawData["reviews"][number],
      {
        id: "r2",
        submissionId: "sub1",
        status: "submitted",
        scores: [{ criterionId: "c1", score: 3, comment: null }],
      } as unknown as AnalyticsRawData["reviews"][number],
    ];
    const metrics = computeAssignmentMetrics({
      data,
      students: STUDENTS,
      selectedCourseId: "c1",
    });
    const a1 = metrics.find((m) => m.id === "a1")!;
    expect(a1.hasDiscrepancyData).toBe(true);
    expect(a1.avgDiscrepancy).toBe(2);
  });

  it("flags hasDiscrepancyData=false when only one review", () => {
    const data = makeRawData();
    data.submissions = [
      {
        id: "sub1",
        assignmentId: "a1",
        studentId: "s1",
        status: "submitted",
      } as unknown as AnalyticsRawData["submissions"][number],
    ];
    data.reviews = [
      {
        id: "r1",
        submissionId: "sub1",
        status: "submitted",
        scores: [{ criterionId: "c1", score: 5, comment: null }],
      } as unknown as AnalyticsRawData["reviews"][number],
    ];
    const metrics = computeAssignmentMetrics({
      data,
      students: STUDENTS,
      selectedCourseId: "c1",
    });
    expect(metrics.find((m) => m.id === "a1")!.hasDiscrepancyData).toBe(false);
  });
});

describe("computeOverallMetrics", () => {
  it("averages submission and review rates", () => {
    const overall = computeOverallMetrics(
      [
        {
          id: "a",
          title: "",
          shortTitle: "",
          submissionRate: 40,
          reviewCompletionRate: 60,
          avgScore: 4,
          avgDiscrepancy: 1,
          hasDiscrepancyData: true,
        },
        {
          id: "b",
          title: "",
          shortTitle: "",
          submissionRate: 80,
          reviewCompletionRate: 100,
          avgScore: 0,
          avgDiscrepancy: 0,
          hasDiscrepancyData: false,
        },
      ],
      2,
    );
    expect(overall.totalAssignments).toBe(2);
    expect(overall.avgSubmissionRate).toBe(60);
    expect(overall.avgReviewCompletionRate).toBe(80);
    expect(overall.avgScore).toBe(4);
    expect(overall.avgDiscrepancy).toBe(1);
  });
});

describe("computeGradebook", () => {
  it("returns null score for assignments with no submission", () => {
    const data = makeRawData();
    const book = computeGradebook({
      data,
      students: STUDENTS,
      selectedCourseId: "c1",
    });
    expect(book[0].scores.a1).toBeNull();
    expect(book[0].finalScore).toBeNull();
  });

  it("filters columns when selectedAssignmentId is set", () => {
    const data = makeRawData();
    const book = computeGradebook({
      data,
      students: STUDENTS,
      selectedCourseId: "c1",
      selectedAssignmentId: "a1",
    });
    expect(Object.keys(book[0].scores)).toEqual(["a1"]);
  });

  it("computes per-student averaged final score from submitted reviews", () => {
    const data = makeRawData();
    data.submissions = [
      {
        id: "sub1",
        assignmentId: "a1",
        studentId: "s1",
        status: "submitted",
      } as unknown as AnalyticsRawData["submissions"][number],
    ];
    data.reviews = [
      {
        id: "r1",
        submissionId: "sub1",
        status: "submitted",
        scores: [
          { criterionId: "c", score: 4, comment: null },
          { criterionId: "d", score: 5, comment: null },
        ],
      } as unknown as AnalyticsRawData["reviews"][number],
    ];
    const book = computeGradebook({
      data,
      students: STUDENTS,
      selectedCourseId: "c1",
    });
    const aliceA1 = book.find((b) => b.studentId === "s1")!.scores.a1;
    expect(aliceA1).toBe(4.5);
  });
});
