import {
  fileFromDto as sharedFileFromDto,
  type FileDto,
  type SubmissionStatus,
} from "@/shared/api";

export interface DemoSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName?: string;
  content: string;
  files: WorkFile[];
  submittedAt: Date;
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
  url?: string;
}

export interface ValidationCheck {
  id: string;
  name: string;
  description?: string;
  status: "passed" | "warning" | "failed";
  message?: string;
}

export function fileFromDto(f: FileDto): WorkFile {
  return sharedFileFromDto(f);
}
