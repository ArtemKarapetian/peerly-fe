export type ExtensionType = "submission" | "review" | "both";
export type ExtensionStatus = "manual" | "requested" | "approved" | "denied";

export interface Extension {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  type: ExtensionType;
  submissionDeadlineOverride?: string; // ISO date string
  reviewDeadlineOverride?: string; // ISO date string
  reason: string;
  status: ExtensionStatus;
  requestedAt?: string; // ISO date string
  processedAt?: string; // ISO date string
  processedBy?: string; // teacher id
  notifyStudent: boolean;
}
