/** Backend response types for courses (snake_case) */

export interface ApiCourse {
  course_id: string;
  name: string;
  code: string;
  teacher_id: string;
  org_id?: string;
  enrollment_count?: number;
  status: "active" | "archived";
  created_at: string;
}

export interface ApiCreateCoursePayload {
  name: string;
  code: string;
  teacher_id: string;
  semester?: string;
  description?: string;
  status?: "active" | "archived";
}
