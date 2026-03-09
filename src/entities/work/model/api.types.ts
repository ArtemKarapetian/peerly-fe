/** Backend response types for submissions (snake_case) */

export interface ApiSubmission {
  submission_id: string;
  homework_id: string;
  student_id: string;
  content: string;
  files: string[];
  submitted_at: string;
  status: "draft" | "submitted" | "reviewed";
}
