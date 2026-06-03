import {
  fileFromDto,
  type SubmittedHomeworkDto,
  type SubmittedHomeworkOverviewDto,
} from "@/shared/api";

import type { Submission } from "./types";

export function mapDtoToSubmission(
  dto: SubmittedHomeworkDto,
  context: { assignmentId?: string; studentId?: string } = {},
): Submission {
  return {
    id: String(dto.id),
    assignmentId: context.assignmentId ?? "",
    studentId: context.studentId ?? "",
    content: dto.comment ?? "",
    files: (dto.files ?? []).map(fileFromDto),
    status: "submitted",
  };
}

export function mapOverviewToSubmission(
  dto: SubmittedHomeworkOverviewDto,
  context: { assignmentId?: string } = {},
): Submission {
  const reviewed = dto.reviewersMark != null || dto.teacherMark != null;
  return {
    id: String(dto.id),
    assignmentId: context.assignmentId ?? "",
    studentId: String(dto.student.studentId),
    studentName: dto.student.name,
    content: "",
    files: [],
    status: reviewed ? "reviewed" : "submitted",
    backendStatus: reviewed ? "reviewed" : "submitted",
    studentMark: dto.reviewersMark,
    teacherMark: dto.teacherMark,
  };
}
