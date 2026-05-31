import type { assignmentRepo } from "@/entities/assignment";
import type { courseRepo } from "@/entities/course";
import type { reviewRepo } from "@/entities/review";
import type { workRepo } from "@/entities/work";

export interface GradebookEntry {
  studentId: string;
  studentName: string;
  scores: Record<string, number | null>;
  finalScore: number | null;
}

export interface AssignmentMetrics {
  id: string;
  title: string;
  shortTitle: string;
  submissionRate: number;
  reviewCompletionRate: number;
  avgScore: number;
  avgDiscrepancy: number;
  hasDiscrepancyData: boolean;
}

export interface OverallMetrics {
  totalAssignments: number;
  avgSubmissionRate: number;
  avgReviewCompletionRate: number;
  avgScore: number;
  avgDiscrepancy: number;
}

export interface AnalyticsRawData {
  courses: Awaited<ReturnType<typeof courseRepo.getAll>>;
  assignments: Awaited<ReturnType<typeof assignmentRepo.getAll>>;
  submissions: Awaited<ReturnType<typeof workRepo.getAll>>;
  reviews: Awaited<ReturnType<typeof reviewRepo.getAll>>;
}

export type Student = AnalyticsRawData["courses"] extends never[]
  ? never
  : Awaited<ReturnType<typeof courseRepo.getParticipants>>["students"][number];
