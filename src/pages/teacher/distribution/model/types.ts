export type OverallStatus = "not-started" | "in-progress" | "completed";
export type ReviewerStatus = "pending" | "draft" | "submitted";

export interface AssignedReviewer {
  id: string;
  name: string;
  status: ReviewerStatus;
}

export interface DistributionRow {
  submissionId: string;
  anonymousId: string;
  authorName: string;
  assignedReviewers: AssignedReviewer[];
  overallStatus: OverallStatus;
}
