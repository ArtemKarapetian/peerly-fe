import type { SubmittedHomeworkInfoDto, SubmittedHomeworkOverviewInfoDto } from "@/shared/api";

import { fileFromDto, type DemoSubmission } from "./types";

function uiStatusFromOverview(s: SubmittedHomeworkOverviewInfoDto["submissionStatus"]) {
  if (s === "Draft") return "draft" as const;
  if (s === "Reviewed" || s === "Finished") return "reviewed" as const;
  return "submitted" as const;
}

export function mapDtoToSubmission(
  dto: SubmittedHomeworkInfoDto,
  context: { assignmentId?: string; studentId?: string } = {},
): DemoSubmission {
  return {
    id: String(dto.id),
    assignmentId: context.assignmentId ?? "",
    studentId: context.studentId ?? "",
    content: dto.comment,
    files: dto.files.map(fileFromDto),
    submittedAt: new Date(),
    status: "submitted",
  };
}

export function mapOverviewToSubmission(
  dto: SubmittedHomeworkOverviewInfoDto,
  context: { assignmentId?: string } = {},
): DemoSubmission {
  return {
    id: String(dto.id),
    assignmentId: context.assignmentId ?? "",
    studentId: String(dto.studentId),
    studentName: dto.studentName,
    content: "",
    files: [],
    submittedAt: new Date(),
    status: uiStatusFromOverview(dto.submissionStatus),
    backendStatus: dto.submissionStatus,
    studentMark: dto.studentMark,
    teacherMark: dto.teacherMark,
  };
}
