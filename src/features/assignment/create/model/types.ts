export interface AssignmentFormData {
  courseId: string;
  groupId: string | null;
  title: string;
  description: string;
  submissionDeadline: Date | null;
  reviewDeadline: Date | null;
  rubricId: string | null;
  rubricName?: string;
  reviewsPerSubmission: number;
  discrepancyThreshold: number;
  status: "draft" | "published";
  createdAt: Date;
  updatedAt: Date;
}

export interface RubricOption {
  id: string;
  name: string;
}
