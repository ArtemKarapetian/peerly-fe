import { describe, it, expect } from "vitest";

import type {
  SubmissionStatus,
  SubmittedHomeworkDto,
  SubmittedHomeworkOverviewDto,
} from "@/shared/api";

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
    expect(result.submittedAt).toBeInstanceOf(Date);
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
    studentId: "st-9",
    studentName: "Petr",
    submissionStatus: "submitted",
    studentMark: 80,
    teacherMark: null,
  };

  it("maps fields and forwards marks + studentName", () => {
    const result = mapOverviewToSubmission(baseOverview, { assignmentId: "hw-9" });
    expect(result.id).toBe("sub-9");
    expect(result.assignmentId).toBe("hw-9");
    expect(result.studentId).toBe("st-9");
    expect(result.studentName).toBe("Petr");
    expect(result.studentMark).toBe(80);
    expect(result.teacherMark).toBeNull();
    expect(result.backendStatus).toBe("submitted");
    expect(result.content).toBe("");
    expect(result.files).toEqual([]);
  });

  it.each<[SubmissionStatus, "draft" | "submitted" | "reviewed"]>([
    ["draft", "draft"],
    ["submitted", "submitted"],
    ["inReview", "submitted"],
    ["reviewed", "reviewed"],
    ["finished", "reviewed"],
  ])("projects backend status %s to ui status %s", (be, ui) => {
    const result = mapOverviewToSubmission({ ...baseOverview, submissionStatus: be });
    expect(result.status).toBe(ui);
  });
});
