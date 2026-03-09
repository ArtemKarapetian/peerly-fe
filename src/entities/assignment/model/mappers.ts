import type { ApiHomework } from "./api.types";
import type { DemoAssignment } from "./types";

export function mapHomeworkToAssignment(api: ApiHomework): DemoAssignment {
  return {
    id: api.homework_id,
    courseId: api.course_id,
    title: api.title,
    description: api.description,
    dueDate: new Date(api.due_date),
    reviewCount: api.review_count,
    status: api.status,
    rubricId: api.rubric_id,
  };
}
