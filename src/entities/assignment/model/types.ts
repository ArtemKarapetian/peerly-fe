import type { HomeworkStatus } from "@/shared/api";

export interface Assignment {
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
  rubricId: string | null;
  discrepancyThreshold?: number;
  archived?: boolean;
}

export interface TeacherAssignmentDetail {
  assignment: Assignment;
  submittedCount: number;
}

export interface CreateAssignmentInput {
  title: string;
  description?: string;
  rubricId?: string | null;
  dueDate: Date | string;
  reviewDeadline: Date | string;
  reviewCount: number;
  discrepancyThreshold?: number;
}
