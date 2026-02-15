export interface DemoReview {
  id: string;
  submissionId: string;
  reviewerId: string;
  scores: Record<string, number>;
  comment: string;
  submittedAt?: Date;
  status: "pending" | "draft" | "submitted";
}

export type ReviewStatus = "not_started" | "draft" | "submitted";

export interface ReviewAssignment {
  id: string;
  taskTitle: string;
  courseName: string;
  courseId: string;
  taskId: string;
  reviewDeadline: string; // e.g., "31 января 2026, 23:59"
  reviewDeadlineTimestamp: number; // For sorting/filtering
  status: ReviewStatus;
  isAnonymous: boolean; // Author is hidden
  workSubmittedAt?: string; // When the work was submitted
}

export interface CriterionScore {
  criterionId: string;
  score: number | null;
  comment: string;
}
export interface ReviewDraft {
  scores: CriterionScore[];
  overallComment: string;
  lastSaved: number;
}
