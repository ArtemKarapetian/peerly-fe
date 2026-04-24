import type { CourseStatus } from "@/shared/api";

export interface DemoCourse {
  id: string;
  name: string;
  title: string; // Display title (alias of name for UI compatibility)
  code: string; // Deprecated on BE — left as empty string
  teacherId: string; // Not returned by BE — left empty
  enrollmentCount: number; // From studentCount
  status: "active" | "archived";
  /** Raw backend status (Draft / InProgress / Finished / Canceled / Deleted). */
  backendStatus: CourseStatus;
  homeworkCount: number;
  archived?: boolean; // Legacy boolean alias
  assignmentIds?: string[];
  createdAt: Date;
}

export interface CreateCourseInput {
  title: string;
  code?: string; // Unused on BE
  instructorId?: string;
  description?: string;
  archived?: boolean;
}
