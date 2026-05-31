import type { Id } from "./common";
import type { FileDto } from "./files";

export type CourseStatus = "draft" | "inProgress" | "finished" | "canceled" | "deleted";

export interface CourseTeacherDto {
  teacherId: Id;
  email: string;
  name: string;
}

export interface CourseDto {
  id: Id;
  name: string;
  description: string;
  status: CourseStatus;
  teachers: CourseTeacherDto[];
}

export interface ListCoursesResponse {
  courses: CourseDto[];
}

export interface GetCourseResponse {
  course: CourseDto;
  studentCount: number;
  homeworkCount: number;
  files: FileDto[];
}

export interface CreateCourseRequestBody {
  name: string;
  description: string;
}

export interface CreateCourseResponse {
  courseId: Id;
}

export interface UpdateCourseRequestBody {
  name: string;
  description?: string;
}
