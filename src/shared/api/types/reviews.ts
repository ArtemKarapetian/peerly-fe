import type { Id } from "./common";
import type { SubmissionForReviewDto, SubmittedReviewDto } from "./submissions";

export interface GetSubmittedReviewResponse {
  submittedReview: SubmittedReviewDto;
}

export interface GetAssignedReviewResponse {
  submission: SubmissionForReviewDto;
}

export interface SubmittedReviewScoreInput {
  rubricCriterionId: number;
  score: number;
  comment?: string | null;
}

export interface CreateSubmittedReviewRequestBody {
  scores: SubmittedReviewScoreInput[];
  comment: string;
}

export interface CreateSubmittedReviewResponse {
  reviewId: Id;
}

export interface UpdateSubmittedReviewRequestBody {
  scores: SubmittedReviewScoreInput[];
  comment: string;
}
