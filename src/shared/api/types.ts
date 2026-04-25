// API DTO с гейтвея Peerly v0.4.0; id храним строками для роутинга и стабильности key

// ── Common ────────────────────────────────────────────────────────

export type Id = string;

export interface PaginationInfoQuery {
  offset: number;
  pageSize: number;
}

// ── Auth ──────────────────────────────────────────────────────────

export type Role = "Student" | "Teacher";

export interface LoginRequestBody {
  email: string;
  password: string;
}

export interface LoginResponseBody {
  userId: Id;
}

export interface RegisterRequestBody {
  email: string;
  password: string;
  userName: string;
  role: Role;
}

export interface RegisterResponseBody {
  userId: Id;
}

// ── Courses ───────────────────────────────────────────────────────

export type CourseStatus = "Draft" | "InProgress" | "Finished" | "Canceled" | "Deleted";

export interface CourseInfoDto {
  id: Id;
  name: string;
  status: CourseStatus;
  studentCount: number;
  homeworkCount: number;
}

export interface ListCoursesResponse {
  courseInfos: CourseInfoDto[];
}

export interface CreateCourseRequestBody {
  name: string;
  description: string;
}

export interface CreateCourseResponse {
  courseId: Id;
}

export interface UpdateCourseRequestBody {
  name: string;
  description?: string;
  status: CourseStatus;
}

// ── Groups ────────────────────────────────────────────────────────

export interface GroupInfoDto {
  id: Id;
  name: string;
  courseId: Id;
}

export interface CreateGroupRequestBody {
  courseId: Id;
  name: string;
}

export interface CreateGroupResponse {
  groupId: Id;
}

export interface UpdateGroupRequestBody {
  name: string;
  courseId: Id;
}

export interface AddGroupStudentRequestBody {
  studentId: Id;
}

export interface AddGroupTeacherRequestBody {
  teacherId: Id;
}

export interface ListGroupsResponse {
  groups: GroupInfoDto[];
}

// ── Participants ──────────────────────────────────────────────────

export interface StudentInfoDto {
  id: Id;
  userName: string;
}

export interface TeacherInfoDto {
  id: Id;
  userName: string;
}

export interface ListParticipantsResponse {
  students: StudentInfoDto[];
  teachers: TeacherInfoDto[];
}

// ── Homeworks ─────────────────────────────────────────────────────

export type HomeworkStatus =
  | "Draft"
  | "Published"
  | "InReview"
  | "Finished"
  | "Deleted"
  | "Confirmed";

export interface HomeworkInfoDto {
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
  homeworks: HomeworkInfoDto[];
}

export interface GetStudentHomeworkResponse {
  homework: HomeworkInfoDto;
  submittedHomework: SubmittedHomeworkInfoDto | null;
}

export interface GetTeacherHomeworkResponse {
  homework: HomeworkInfoDto;
}

export interface AssignedReviewInfoDto {
  submittedHomeworkId: Id;
  studentName: string;
  studentId: Id;
}

export interface ListAssignedReviewsResponse {
  assignedReviews: AssignedReviewInfoDto[];
}

// ── Files / Storage ───────────────────────────────────────────────

export interface FileDto {
  id: Id;
  name: string;
  size: number;
}

export function fileFromDto(f: FileDto): { id: string; name: string; size: number } {
  return { id: String(f.id), name: f.name, size: f.size };
}

export interface CreateFileRequestBody {
  storageId: string;
  fileName: string;
  fileSize: number;
}

export interface CreateFileResponse {
  fileId: Id;
}

export interface GenerateUploadUrlResponse {
  url: string;
  storageId: string;
}

export interface GenerateDownloadUrlResponse {
  url: string;
}

// ── Submissions ───────────────────────────────────────────────────

export type SubmissionStatus = "Draft" | "Submitted" | "InReview" | "Reviewed" | "Finished";

export interface SubmittedHomeworkInfoDto {
  id: Id;
  comment: string;
  files: FileDto[];
}

export interface SubmittedHomeworkOverviewInfoDto {
  id: Id;
  studentId: Id;
  studentName: string;
  submissionStatus: SubmissionStatus;
  studentMark: number | null;
  teacherMark: number | null;
}

export interface SubmittedReviewInfoDto {
  id: Id;
  mark: number;
  comment: string;
}

export interface TeacherSubmittedReviewInfoDto {
  id: Id;
  mark: number;
  comment: string;
  reviewerId?: Id;
  reviewerName?: string;
}

export interface SubmissionForReviewDto {
  id: Id;
  comment: string;
  files: FileDto[];
}

export interface GetSubmittedHomeworkResponse {
  submittedHomework: SubmittedHomeworkInfoDto;
  submittedReviews: SubmittedReviewInfoDto[];
  finalMark: number | null;
}

export interface GetTeacherSubmittedHomeworkResponse {
  submittedHomework: SubmittedHomeworkInfoDto;
  submittedReviews: TeacherSubmittedReviewInfoDto[];
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
  submissions: SubmittedHomeworkOverviewInfoDto[];
}

// ── Reviews ───────────────────────────────────────────────────────

export interface GetSubmittedReviewResponse {
  submittedReview: TeacherSubmittedReviewInfoDto;
}

export interface GetAssignedReviewResponse {
  submission: SubmissionForReviewDto;
  studentId: Id;
  studentName: string;
}

export interface CreateSubmittedReviewRequestBody {
  mark: number;
  comment: string;
}

export interface CreateSubmittedReviewResponse {
  reviewId: Id;
}

export interface UpdateSubmittedReviewRequestBody {
  mark: number;
  comment: string;
}

// ── Error (ProblemDetails) ────────────────────────────────────────

export interface ProblemDetails {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  errors?: Record<string, string[]>;
}
