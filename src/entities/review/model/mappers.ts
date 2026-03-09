import type { ApiReview } from "./api.types";
import type { DemoReview } from "./types";

export function mapApiReview(api: ApiReview): DemoReview {
  return {
    id: api.review_id,
    submissionId: api.submission_id,
    reviewerId: api.reviewer_id,
    scores: api.scores,
    comment: api.comment,
    submittedAt: api.submitted_at ? new Date(api.submitted_at) : undefined,
    status: api.status,
  };
}
