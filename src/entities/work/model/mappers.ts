import type { ApiSubmission } from "./api.types";
import type { DemoSubmission } from "./types";

export function mapApiSubmission(api: ApiSubmission): DemoSubmission {
  return {
    id: api.submission_id,
    assignmentId: api.homework_id,
    studentId: api.student_id,
    content: api.content,
    files: api.files,
    submittedAt: new Date(api.submitted_at),
    status: api.status,
  };
}
