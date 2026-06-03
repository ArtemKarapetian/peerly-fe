import { describe, it, expect } from "vitest";

import type { SubmittedHomeworkDto, SubmittedHomeworkOverviewDto } from "@/shared/api";

import { mapDtoToSubmission, mapOverviewToSubmission } from "./mappers";

describe("mapDtoToSubmission", () => {
  const dto: SubmittedHomeworkDto = {
    id: "sub-1",
    comment: "My answer",
    files: [
      { id: "f-1", name: "answer.pdf", size: 1024 },
      { id: "f-2", name: "extra.txt", size: 16 },
    ],
  };

  it("maps fields, projects files and sets submitted status", () => {
    const result = mapDtoToSubmission(dto, { assignmentId: "hw-1", studentId: "st-1" });

    expect(result.id).toBe("sub-1");
    expect(result.assignmentId).toBe("hw-1");
    expect(result.studentId).toBe("st-1");
    expect(result.content).toBe("My answer");
    expect(result.files).toHaveLength(2);
    expect(result.files[0]).toEqual({ id: "f-1", name: "answer.pdf", size: 1024 });
    expect(result.status).toBe("submitted");
    expect(result.submittedAt).toBeUndefined();
  });

  it("defaults context fields to empty strings", () => {
    const result = mapDtoToSubmission({ ...dto, files: [] });
    expect(result.assignmentId).toBe("");
    expect(result.studentId).toBe("");
    expect(result.files).toEqual([]);
  });
});

describe("mapOverviewToSubmission", () => {
  const baseOverview: SubmittedHomeworkOverviewDto = {
    id: "sub-9",
    student: { studentId: "st-9", email: "petr@x", name: "Petr" },
    reviewCount: 3,
    reviewersMark: 80,
    hasDiscrepancy: false,
    teacherMark: null,
  };

  it("maps nested student + forwards reviewers mark as studentMark", () => {
    const result = mapOverviewToSubmission(baseOverview, { assignmentId: "hw-9" });
    expect(result.id).toBe("sub-9");
    expect(result.assignmentId).toBe("hw-9");
    expect(result.studentId).toBe("st-9");
    expect(result.studentName).toBe("Petr");
    expect(result.studentMark).toBe(80);
    expect(result.teacherMark).toBeNull();
    expect(result.content).toBe("");
    expect(result.files).toEqual([]);
  });

  it("marks status reviewed when a reviewers/teacher mark exists", () => {
    expect(mapOverviewToSubmission(baseOverview).status).toBe("reviewed");
  });

  it("marks status submitted when no marks exist", () => {
    const noMarks = { ...baseOverview, reviewersMark: null, teacherMark: null };
    expect(mapOverviewToSubmission(noMarks).status).toBe("submitted");
  });
});
