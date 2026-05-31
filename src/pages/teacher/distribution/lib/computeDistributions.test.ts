import { describe, expect, it } from "vitest";

import type { reviewRepo } from "@/entities/review";
import type { workRepo } from "@/entities/work";

import { computeDistributions } from "./computeDistributions";

type Sub = Awaited<ReturnType<typeof workRepo.getAll>>[number];
type Rev = Awaited<ReturnType<typeof reviewRepo.getAll>>[number];

function sub(id: string, assignmentId: string, studentId: string): Sub {
  return { id, assignmentId, studentId } as Sub;
}

function rev(id: string, submissionId: string, reviewerId: string, status: Rev["status"]): Rev {
  return { id, submissionId, reviewerId, status } as Rev;
}

const NAMES = new Map<string, string>([
  ["stu-1", "Alice"],
  ["rev-1", "Bob"],
  ["rev-2", "Carol"],
]);

const ARGS = {
  unknownReviewer: "(unknown reviewer)",
  unknownAuthor: "(unknown author)",
  nameById: NAMES,
};

describe("computeDistributions", () => {
  it("returns empty list when selectedAssignment is empty", () => {
    const result = computeDistributions({
      ...ARGS,
      submissions: [sub("s1", "a1", "stu-1")],
      reviews: [],
      selectedAssignment: "",
    });
    expect(result).toEqual([]);
  });

  it("marks rows as not-started when there are no reviews", () => {
    const result = computeDistributions({
      ...ARGS,
      submissions: [sub("s1", "a1", "stu-1")],
      reviews: [],
      selectedAssignment: "a1",
    });
    expect(result).toHaveLength(1);
    expect(result[0]!.overallStatus).toBe("not-started");
    expect(result[0]!.assignedReviewers).toEqual([]);
  });

  it("marks rows as in-progress when some reviews submitted", () => {
    const result = computeDistributions({
      ...ARGS,
      submissions: [sub("s1", "a1", "stu-1")],
      reviews: [rev("r1", "s1", "rev-1", "submitted"), rev("r2", "s1", "rev-2", "pending")],
      selectedAssignment: "a1",
    });
    expect(result[0]!.overallStatus).toBe("in-progress");
  });

  it("marks rows as completed when all reviews submitted", () => {
    const result = computeDistributions({
      ...ARGS,
      submissions: [sub("s1", "a1", "stu-1")],
      reviews: [rev("r1", "s1", "rev-1", "submitted"), rev("r2", "s1", "rev-2", "submitted")],
      selectedAssignment: "a1",
    });
    expect(result[0]!.overallStatus).toBe("completed");
  });

  it("uses unknown labels when name not found", () => {
    const result = computeDistributions({
      ...ARGS,
      submissions: [sub("s1", "a1", "stu-unknown")],
      reviews: [rev("r1", "s1", "rev-unknown", "pending")],
      selectedAssignment: "a1",
    });
    expect(result[0]!.authorName).toBe("(unknown author)");
    expect(result[0]!.assignedReviewers[0]!.name).toBe("(unknown reviewer)");
  });

  it("filters submissions by assignment", () => {
    const result = computeDistributions({
      ...ARGS,
      submissions: [sub("s1", "a1", "stu-1"), sub("s2", "a2", "stu-1")],
      reviews: [],
      selectedAssignment: "a1",
    });
    expect(result).toHaveLength(1);
    expect(result[0]!.submissionId).toBe("s1");
  });

  it("anonymizes with SUB-001, SUB-002 padding", () => {
    const result = computeDistributions({
      ...ARGS,
      submissions: [sub("s1", "a1", "stu-1"), sub("s2", "a1", "stu-1")],
      reviews: [],
      selectedAssignment: "a1",
    });
    expect(result[0]!.anonymousId).toBe("SUB-001");
    expect(result[1]!.anonymousId).toBe("SUB-002");
  });
});
