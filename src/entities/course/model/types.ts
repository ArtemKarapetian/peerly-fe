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
  teachers: CourseTeacher[];
  enrollmentCount: number;
  status: "draft" | "active" | "archived";
  backendStatus: CourseStatus;
  homeworkCount: number;
  archived?: boolean;
  assignmentIds?: string[];
  createdAt: Date;
}

export interface CreateCourseInput {
  title: string;
  description?: string;
}
