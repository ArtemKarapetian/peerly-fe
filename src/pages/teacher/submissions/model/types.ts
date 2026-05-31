import type { assignmentRepo } from "@/entities/assignment";
import type { userRepo } from "@/entities/user";
import type { workRepo } from "@/entities/work";

export type StatusFilter = "all" | "draft" | "submitted" | "late";
export type RowStatus = Exclude<StatusFilter, "all">;

export interface SubmissionsRawData {
  users: Awaited<ReturnType<typeof userRepo.getAll>>;
  assignments: Awaited<ReturnType<typeof assignmentRepo.getAll>>;
  submissions: Awaited<ReturnType<typeof workRepo.getAll>>;
}

export interface SubmissionRow {
  sub: SubmissionsRawData["submissions"][number];
  assignment: SubmissionsRawData["assignments"][number] | undefined;
  studentName: string;
  status: RowStatus;
}
