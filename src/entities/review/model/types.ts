export interface DemoReview {
  id: string;
  submissionId: string;
  reviewerId: string;
  scores: Record<string, number>;
  comment: string;
  submittedAt?: Date;
  status: "pending" | "draft" | "submitted";
}
