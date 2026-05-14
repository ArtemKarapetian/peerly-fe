import { describe, it, expect } from "vitest";

import type { HomeworkDto, HomeworkStatus } from "@/shared/api";

import { mapHomeworkToAssignment, mapInputToCreateBody } from "./mappers";
import type { CreateAssignmentInput } from "./types";

const baseDto: HomeworkDto = {
  id: "hw-1",
  name: "Linear Algebra HW1",
  status: "published",
  deadline: "2026-04-01T23:59:00Z",
  reviewDeadline: "2026-04-08T23:59:00Z",
  description: "Solve all problems.",
  checklist: "- prove theorem 1\n- prove theorem 2",
  amountOfReviewers: 3,
  discrepancyThreshold: 2,
};

describe("mapHomeworkToAssignment", () => {
  it("maps all fields including context, dates and review count", () => {
    const result = mapHomeworkToAssignment(baseDto, { courseId: "c-1", groupId: "g-2" });

    expect(result.id).toBe("hw-1");
    expect(result.courseId).toBe("c-1");
    expect(result.groupId).toBe("g-2");
    expect(result.title).toBe("Linear Algebra HW1");
    expect(result.description).toBe("Solve all problems.");
    expect(result.dueDate).toBeInstanceOf(Date);
    expect(result.dueDate.toISOString()).toBe("2026-04-01T23:59:00.000Z");
    expect(result.reviewDeadline?.toISOString()).toBe("2026-04-08T23:59:00.000Z");
    expect(result.reviewCount).toBe(3);
    expect(result.checklist).toBe("- prove theorem 1\n- prove theorem 2");
    expect(result.discrepancyThreshold).toBe(2);
    expect(result.backendStatus).toBe("published");
    expect(result.status).toBe("published");
    expect(result.archived).toBe(false);
  });

  it("defaults missing optional fields when context is empty", () => {
    const minimal: HomeworkDto = {
      id: "hw-2",
      name: "Quiz",
      status: "draft",
      deadline: "2026-05-01T00:00:00Z",
    };
    const result = mapHomeworkToAssignment(minimal);

    expect(result.courseId).toBe("");
    expect(result.groupId).toBeUndefined();
    expect(result.description).toBe("");
    expect(result.reviewDeadline).toBeUndefined();
    expect(result.reviewCount).toBe(0);
    expect(result.status).toBe("draft");
    expect(result.archived).toBe(false);
  });

  it.each<[HomeworkStatus, "draft" | "published" | "closed"]>([
    ["draft", "draft"],
    ["published", "published"],
    ["inReview", "published"],
    ["finished", "closed"],
    ["confirmed", "closed"],
    ["deleted", "closed"],
  ])("projects backend status %s to ui status %s", (backend, ui) => {
    const result = mapHomeworkToAssignment({ ...baseDto, status: backend });
    expect(result.status).toBe(ui);
    expect(result.backendStatus).toBe(backend);
  });

  it("marks deleted homework as archived", () => {
    const result = mapHomeworkToAssignment({ ...baseDto, status: "deleted" });
    expect(result.archived).toBe(true);
  });
});

describe("mapInputToCreateBody", () => {
  it("serialises Date deadlines to ISO strings", () => {
    const input: CreateAssignmentInput = {
      title: "HW2",
      description: "do it",
      checklist: "step 1",
      dueDate: new Date("2026-06-01T12:00:00Z"),
      reviewDeadline: new Date("2026-06-08T12:00:00Z"),
      reviewCount: 4,
      discrepancyThreshold: 5,
    };

    const body = mapInputToCreateBody(input);

    expect(body.name).toBe("HW2");
    expect(body.amountOfReviewers).toBe(4);
    expect(body.description).toBe("do it");
    expect(body.checklist).toBe("step 1");
    expect(body.deadline).toBe("2026-06-01T12:00:00.000Z");
    expect(body.reviewDeadline).toBe("2026-06-08T12:00:00.000Z");
    expect(body.discrepancyThreshold).toBe(5);
  });

  it("passes through string deadlines unchanged and defaults checklist + threshold", () => {
    const input: CreateAssignmentInput = {
      title: "HW3",
      dueDate: "2026-07-01T00:00:00Z",
      reviewDeadline: "2026-07-08T00:00:00Z",
      reviewCount: 2,
    };

    const body = mapInputToCreateBody(input);

    expect(body.deadline).toBe("2026-07-01T00:00:00Z");
    expect(body.reviewDeadline).toBe("2026-07-08T00:00:00Z");
    expect(body.checklist).toBe("");
    expect(body.discrepancyThreshold).toBe(0);
    expect(body.description).toBeUndefined();
  });
});
