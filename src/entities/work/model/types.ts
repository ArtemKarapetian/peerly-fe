import { type SubmissionStatus } from "@/shared/api";

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName?: string;
  content: string;
  files: WorkFile[];
  submittedAt?: Date;
  /** UI status — projected from backendStatus. */
  status: "draft" | "submitted" | "reviewed";
  backendStatus?: SubmissionStatus;
  studentMark?: number | null;
  teacherMark?: number | null;
  finalMark?: number | null;
}

export interface WorkFile {
  id: string;
  name: string;
  size: number;
}
