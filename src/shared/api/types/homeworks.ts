import type { Id } from "./common";
import type { FileDto } from "./files";

export type HomeworkStatus =
  | "draft"
  | "published"
  | "inReview"
  | "finished"
  | "deleted"
  | "confirmed";

export interface HomeworkDto {
  id: Id;
  name: string;
  status: HomeworkStatus;
  deadline: string;
  reviewDeadline?: string;
  description?: string;
  checklist?: string;
  amountOfReviewers?: number;
  discrepancyThreshold?: number;
  files?: FileDto[];
}

export interface CreateHomeworkRequestBody {
  name: string;
  amountOfReviewers: number;
  description?: string;
  checklist: string;
  deadline: string;
  reviewDeadline: string;
  discrepancyThreshold: number;
}

export type UpdateDraftHomeworkRequestBody = CreateHomeworkRequestBody;

export interface CreateHomeworkResponse {
  homeworkId: Id;
}

export interface PostponeDeadlinesRequestBody {
  deadline: string;
  reviewDeadline: string;
}

export interface ListHomeworksResponse {
  homeworks: HomeworkDto[];
}

export interface GetStudentHomeworkResponse {
  homework: HomeworkDto;
  submittedHomeworkId: Id | null;
  files: FileDto[];
}

export interface GetTeacherHomeworkResponse {
  homework: HomeworkDto;
  submittedCount: number;
  files: FileDto[];
}

export interface AssignedReviewDto {
  submittedHomeworkId: Id;
  studentName: string;
  studentId: Id;
}

export interface ListAssignedReviewsResponse {
  assignedReviews: AssignedReviewDto[];
}
