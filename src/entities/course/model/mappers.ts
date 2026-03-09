import type { ApiCourse, ApiCreateCoursePayload } from "./api.types";
import type { CreateCourseInput, DemoCourse } from "./types";

export function mapApiCourse(api: ApiCourse): DemoCourse {
  return {
    id: api.course_id,
    name: api.name,
    title: api.name,
    code: api.code,
    teacherId: api.teacher_id,
    orgId: api.org_id ?? "",
    enrollmentCount: api.enrollment_count ?? 0,
    status: api.status,
    createdAt: new Date(api.created_at),
  };
}

export function mapCourseToPayload(input: CreateCourseInput): ApiCreateCoursePayload {
  return {
    name: input.title,
    code: input.code,
    teacher_id: input.instructorId,
    semester: input.semester,
    description: input.description,
    status: input.archived ? "archived" : "active",
  };
}
