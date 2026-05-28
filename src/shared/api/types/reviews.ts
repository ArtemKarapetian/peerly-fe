import type { Id } from "./common";
import type { SubmissionForReviewDto, TeacherSubmittedReviewDto } from "./submissions";

export interface GetSubmittedReviewResponse {
  submittedReview: TeacherSubmittedReviewDto;
}

export interface GetAssignedReviewResponse {
  submission: SubmissionForReviewDto;
}

export interface CreateSubmittedReviewRequestBody {
  mark: number;
  comment: string;
}

export interface CreateSubmittedReviewResponse {
  reviewId: Id;
}

export interface UpdateSubmittedReviewRequestBody {
  mark: number;
  comment: string;
}
