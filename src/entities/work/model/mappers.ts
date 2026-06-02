import {
  fileFromDto,
  type SubmittedHomeworkDto,
  type SubmittedHomeworkOverviewDto,
} from "@/shared/api";

import type { Submission } from "./types";

function uiStatusFromOverview(s: SubmittedHomeworkOverviewDto["submissionStatus"]) {
  if (s === "draft") return "draft" as const;
  if (s === "reviewed" || s === "finished") return "reviewed" as const;
  return "submitted" as const;
}

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
  return {
    id: String(dto.id),
    assignmentId: context.assignmentId ?? "",
    studentId: String(dto.studentId),
    studentName: dto.studentName,
    content: "",
    files: [],
    status: uiStatusFromOverview(dto.submissionStatus),
    backendStatus: dto.submissionStatus,
    studentMark: dto.studentMark,
    teacherMark: dto.teacherMark,
  };
}
