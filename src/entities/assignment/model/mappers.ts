import type { CreateHomeworkRequestBody, HomeworkDto, HomeworkStatus } from "@/shared/api";

import type { CreateAssignmentInput, DemoAssignment } from "./types";

function uiStatus(raw: HomeworkStatus): DemoAssignment["status"] {
  if (raw === "draft") return "draft";
  if (raw === "finished" || raw === "confirmed" || raw === "deleted") return "closed";
  return "published";
}

export function mapHomeworkToAssignment(
  dto: HomeworkDto,
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
    rubricId: dto.rubricId != null ? String(dto.rubricId) : null,
    discrepancyThreshold: dto.discrepancyThreshold,
    archived: dto.status === "deleted",
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
    rubricId: input.rubricId != null ? Number(input.rubricId) : null,
    deadline,
    reviewDeadline,
    discrepancyThreshold: input.discrepancyThreshold ?? 0,
  };
}
