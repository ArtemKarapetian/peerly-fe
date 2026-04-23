import type {
  AssignedReviewInfoDto,
  SubmittedReviewInfoDto,
  TeacherSubmittedReviewInfoDto,
} from "@/shared/api";

import type { DemoReview, ReviewAssignment } from "./types";

export function mapDtoToReview(
  dto: SubmittedReviewInfoDto | TeacherSubmittedReviewInfoDto,
  context: { submissionId?: string; reviewerId?: string } = {},
): DemoReview {
  const reviewerId =
    "reviewerId" in dto && dto.reviewerId ? String(dto.reviewerId) : (context.reviewerId ?? "");
  return {
    id: String(dto.id),
    submissionId: context.submissionId ?? "",
    reviewerId,
    scores: { overall: dto.mark },
    comment: dto.comment,
    status: "submitted",
  };
}

export function mapAssignedToReview(
  dto: AssignedReviewInfoDto,
  homework: {
    id: string;
    title: string;
    courseName: string;
    courseId: string;
    reviewDeadline?: Date;
    submittedAt?: Date;
  },
): ReviewAssignment {
  return {
    id: String(dto.submittedHomeworkId),
    taskTitle: homework.title,
    courseName: homework.courseName,
    courseId: homework.courseId,
    taskId: homework.id,
    reviewDeadline: homework.reviewDeadline?.toLocaleString("ru-RU") ?? "",
    reviewDeadlineTimestamp: homework.reviewDeadline?.getTime() ?? 0,
    status: "not_started",
    isAnonymous: true,
    workSubmittedAt: homework.submittedAt?.toISOString(),
  };
}
