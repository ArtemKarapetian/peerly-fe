import type { AssignedReviewDto, SubmittedReviewDto, SubmittedReviewScoreDto } from "@/shared/api";

import type { CriterionScore, Review, ReviewAssignment } from "./types";

function mapScore(dto: SubmittedReviewScoreDto): CriterionScore {
  return {
    criterionId: String(dto.rubricCriterionId),
    score: dto.score,
    comment: dto.comment ?? null,
  };
}

export function mapDtoToReview(
  dto: SubmittedReviewDto,
  context: { submissionId?: string; reviewerId?: string } = {},
): Review {
  return {
    id: String(dto.id),
    submissionId: context.submissionId ?? "",
    reviewerId: context.reviewerId ?? "",
    scores: (dto.scores ?? []).map(mapScore),
    mark: dto.mark,
    comment: dto.comment,
    status: "submitted",
  };
}

export function mapAssignedToReview(
  dto: AssignedReviewDto,
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
