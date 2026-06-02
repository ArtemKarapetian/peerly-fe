export interface CriterionScore {
  criterionId: string;
  score: number;
  comment: string | null;
}

export interface Review {
  id: string;
  submissionId: string;
  reviewerId: string;
  scores: CriterionScore[];
  mark: number;
  comment: string;
  submittedAt?: Date;
  status: "pending" | "submitted";
}

export type ReviewStatus = "not_started" | "submitted";

export interface ReviewAssignment {
  id: string;
  taskTitle: string;
  courseName: string;
  courseId: string;
  taskId: string;
  reviewDeadline: string;
  reviewDeadlineTimestamp: number;
  status: ReviewStatus;
  isAnonymous: boolean;
  workSubmittedAt?: string;
}
