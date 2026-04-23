import type { CreateHomeworkRequestBody, HomeworkInfoDto, HomeworkStatus } from "@/shared/api";

import type { CreateAssignmentInput, DemoAssignment } from "./types";

function uiStatus(raw: HomeworkStatus): DemoAssignment["status"] {
  if (raw === "Draft") return "draft";
  if (raw === "Finished" || raw === "Confirmed" || raw === "Deleted") return "closed";
  return "published";
}

export function mapHomeworkToAssignment(
  dto: HomeworkInfoDto,
  context: { courseId?: string; groupId?: string } = {},
): DemoAssignment {
  return {
    id: String(dto.id),
    courseId: context.courseId ?? "",
    groupId: context.groupId,
    title: dto.name,
    description: dto.description ?? "",
    dueDate: new Date(dto.deadline),
    reviewDeadline: dto.reviewDeadline ? new Date(dto.reviewDeadline) : undefined,
    reviewCount: dto.amountOfReviewers ?? 0,
    status: uiStatus(dto.status),
    backendStatus: dto.status,
    checklist: dto.checklist,
    discrepancyThreshold: dto.discrepancyThreshold,
    archived: dto.status === "Deleted",
  };
}

export function mapInputToCreateBody(input: CreateAssignmentInput): CreateHomeworkRequestBody {
  const deadline = input.dueDate instanceof Date ? input.dueDate.toISOString() : input.dueDate;
  const reviewDeadline =
    input.reviewDeadline instanceof Date
      ? input.reviewDeadline.toISOString()
      : input.reviewDeadline;

  return {
    name: input.title,
    amountOfReviewers: input.reviewCount,
    description: input.description,
    checklist: input.checklist ?? "",
    deadline,
    reviewDeadline,
    discrepancyThreshold: input.discrepancyThreshold ?? 0,
  };
}
