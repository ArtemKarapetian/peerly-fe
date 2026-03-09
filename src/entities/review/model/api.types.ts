/** Backend response types for reviews (snake_case) */

export interface ApiReview {
  review_id: string;
  submission_id: string;
  reviewer_id: string;
  scores: Record<string, number>;
  comment: string;
  submitted_at?: string;
  status: "pending" | "draft" | "submitted";
}

export interface ApiUpdateReviewPayload {
  scores: Record<string, number>;
  comment: string;
  status: "draft" | "submitted";
}
