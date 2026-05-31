import type { CourseStatus } from "@/shared/api";

export interface CourseTeacher {
  id: string;
  name: string;
  email: string;
}

export interface Course {
  id: string;
  name: string;
  description: string;
  teachers: CourseTeacher[];
  enrollmentCount: number;
  status: "draft" | "active" | "archived";
  backendStatus: CourseStatus;
  homeworkCount: number;
  archived?: boolean;
}

export interface CreateCourseInput {
  title: string;
  description?: string;
}
