export interface DemoSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  content: string;
  files: string[];
  submittedAt: Date;
  status: "draft" | "submitted" | "reviewed";
}

export interface WorkFile {
  id: string;
  name: string;
  size: number; // bytes
  url?: string; // Download URL
}

export interface ValidationCheck {
  id: string;
  name: string;
  description?: string;
  status: "passed" | "warning" | "failed";
  message?: string;
}
