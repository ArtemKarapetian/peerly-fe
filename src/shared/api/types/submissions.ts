import type { Id } from "./common";
import type { FileDto } from "./files";

export type SubmissionStatus = "draft" | "submitted" | "inReview" | "reviewed" | "finished";

export interface SubmittedHomeworkDto {
  id: Id;
  comment: string;
  files: FileDto[];
}

export interface SubmittedHomeworkOverviewDto {
  id: Id;
  studentId: Id;
  studentName: string;
  submissionStatus: SubmissionStatus;
  studentMark: number | null;
  teacherMark: number | null;
}

export interface SubmittedReviewDto {
  id: Id;
  mark: number;
  comment: string;
}

export interface TeacherSubmittedReviewDto {
  id: Id;
  mark: number;
  comment: string;
  reviewerId?: Id;
  reviewerName?: string;
}

export interface SubmissionForReviewDto {
  submittedHomeworkId: Id;
  comment: string;
  files: FileDto[];
  checklist: string;
  submittedReviewId?: Id;
}

export interface GetSubmittedHomeworkResponse {
  submittedHomework: SubmittedHomeworkDto;
  submittedReviews: SubmittedReviewDto[];
  finalMark: number | null;
}

export interface GetTeacherSubmittedHomeworkResponse {
  submittedHomework: SubmittedHomeworkDto;
  submittedReviews: TeacherSubmittedReviewDto[];
}

export interface CreateSubmittedHomeworkRequestBody {
  comment: string;
}

export interface CreateSubmittedHomeworkResponse {
  submittedHomeworkId: Id;
}

export interface UpdateSubmittedHomeworkRequestBody {
  comment: string;
}

export interface CorrectMarkRequestBody {
  teacherMark: number;
}

export interface ListSubmissionsOverviewResponse {
  submissions: SubmittedHomeworkOverviewDto[];
}
