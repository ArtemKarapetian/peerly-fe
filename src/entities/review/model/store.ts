/**
 * reviewStore - Mock state management for reviews
 *
 * Features:
 * - Store all reviews with status (not_started / draft / submitted)
 * - Update review status and data
 * - Persist in memory (would be replaced with API calls)
 */

export interface Review {
  id: string;
  taskTitle: string;
  courseName: string;
  courseId: string;
  taskId: string;
  studentName: string; // e.g., "Student #1" or real name
  isAnonymous: boolean;
  reviewDeadline: string;
  reviewDeadlineTimestamp: number;
  status: "not_started" | "draft" | "submitted";
  // Draft data
  scores?: Record<string, { score: number | null; comment: string }>;
  overallComment?: string;
  submittedAt?: string;
}
