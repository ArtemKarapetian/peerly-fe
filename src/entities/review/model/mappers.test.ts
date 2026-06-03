import { describe, it, expect } from "vitest";

import type { AssignedReviewDto, SubmittedReviewDto } from "@/shared/api";

import { mapAssignedToReview, mapDtoToReview } from "./mappers";

describe("mapDtoToReview", () => {
  it("maps a student SubmittedReviewDto with provided context", () => {
    const dto: SubmittedReviewDto = {
      id: "r-1",
      mark: 7,
      comment: "ok",
      scores: [{ id: "s-1", rubricCriterionId: "c-1", score: 7, comment: null }],
    };
    const result = mapDtoToReview(dto, { submissionId: "sub-1", reviewerId: "u-1" });

    expect(result.id).toBe("r-1");
    expect(result.submissionId).toBe("sub-1");
    expect(result.reviewerId).toBe("u-1");
    expect(result.mark).toBe(7);
    expect(result.scores).toEqual([{ criterionId: "c-1", score: 7, comment: null }]);
    expect(result.comment).toBe("ok");
    expect(result.status).toBe("submitted");
  });

  it("takes reviewerId from the context", () => {
    const dto: SubmittedReviewDto = {
      id: "r-2",
      mark: 9,
      comment: "great",
      scores: [],
    };
    const result = mapDtoToReview(dto, { reviewerId: "ctx-r" });
    expect(result.reviewerId).toBe("ctx-r");
  });

  it("falls back to empty context fields", () => {
    const dto: SubmittedReviewDto = {
      id: 3 as unknown as string,
      mark: 5,
      comment: "",
      scores: [],
    };
    const result = mapDtoToReview(dto);
    expect(result.id).toBe("3");
    expect(result.submissionId).toBe("");
    expect(result.reviewerId).toBe("");
  });
});

describe("mapAssignedToReview", () => {
  const dto: AssignedReviewDto = {
    submittedHomeworkId: "sub-9",
    studentName: "Anon",
    studentId: "st-9",
  };

  it("maps anonymous assignment with deadline formatting", () => {
    const deadline = new Date("2026-01-31T20:59:00Z");
    const submittedAt = new Date("2026-01-20T10:00:00Z");

    const result = mapAssignedToReview(dto, {
      id: "hw-1",
      title: "Title",
      courseName: "Course",
      courseId: "c-1",
      reviewDeadline: deadline,
      submittedAt,
    });

    expect(result.id).toBe("sub-9");
    expect(result.taskTitle).toBe("Title");
    expect(result.courseName).toBe("Course");
    expect(result.courseId).toBe("c-1");
    expect(result.taskId).toBe("hw-1");
    expect(result.reviewDeadlineTimestamp).toBe(deadline.getTime());
    expect(result.reviewDeadline).toBe(deadline.toLocaleString("ru-RU"));
    expect(result.workSubmittedAt).toBe(submittedAt.toISOString());
    expect(result.isAnonymous).toBe(true);
    expect(result.status).toBe("not_started");
  });

  it("handles missing deadlines and submittedAt gracefully", () => {
    const result = mapAssignedToReview(dto, {
      id: "hw-2",
      title: "T2",
      courseName: "C2",
      courseId: "c-2",
    });
    expect(result.reviewDeadline).toBe("");
    expect(result.reviewDeadlineTimestamp).toBe(0);
    expect(result.workSubmittedAt).toBeUndefined();
  });
});
