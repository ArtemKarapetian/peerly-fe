export interface AssignmentFormData {
  courseId: string;
  title: string;
  description: string;
  submissionDeadline: Date | null;
  reviewDeadline: Date | null;
  rubricId: string | null;
  rubricName?: string;
  reviewsPerSubmission: number;
  status: "draft" | "published";
  createdAt: Date;
  updatedAt: Date;
}

export interface RubricOptionCriterion {
  name: string;
  description: string;
  maxScore: number;
}

export interface RubricOption {
  id: string;
  name: string;
  description: string;
  criteria: RubricOptionCriterion[];
}
