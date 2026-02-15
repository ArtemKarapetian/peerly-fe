export interface DemoSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  content: string;
  files: string[];
  submittedAt: Date;
  status: "draft" | "submitted" | "reviewed";
}
