import type { CourseStatus } from "@/shared/api";

export interface CourseTeacher {
  id: string;
  name: string;
  email: string;
}

export interface DemoCourse {
  id: string;
  name: string;
  title: string;
  description: string;
  code: string;
  teachers: CourseTeacher[];
  enrollmentCount: number;
  status: "active" | "archived";
  backendStatus: CourseStatus;
  homeworkCount: number;
  archived?: boolean;
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
