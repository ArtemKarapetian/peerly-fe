import type { HomeworkStatus } from "@/shared/api";

export interface DemoAssignment {
  id: string;
  courseId: string;
  groupId?: string;
  title: string;
  description: string;
  dueDate: Date;
  reviewDeadline?: Date;
  reviewCount: number;
  /** UI status — a simplified projection of `backendStatus`. */
  status: "draft" | "published" | "closed";
  backendStatus: HomeworkStatus;
  checklist?: string;
  discrepancyThreshold?: number;
  archived?: boolean;
  rubricId?: string;
}

export interface CreateAssignmentInput {
  title: string;
  description?: string;
  checklist?: string;
  dueDate: Date | string;
  reviewDeadline: Date | string;
  reviewCount: number;
  discrepancyThreshold?: number;
}
