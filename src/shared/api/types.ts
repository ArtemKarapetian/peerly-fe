// ── Common ────────────────────────────────────────────────────────

export type Id = string;

export interface PaginationInfoQuery {
  offset: number;
  pageSize: number;
}

// ── Auth ──────────────────────────────────────────────────────────

// TODO BE: Admin enum в auth.proto + админский флоу в gateway.
export type Role = "Student" | "Teacher" | "Admin";

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
  name: string;
  role: Role;
}

export interface RegisterResponseBody {
  userId: Id;
}

// ── Courses ───────────────────────────────────────────────────────

export type CourseStatus = "draft" | "inProgress" | "finished" | "canceled" | "deleted";

export interface CourseTeacherDto {
  teacherId: Id;
  email: string;
  name: string;
}

export interface CourseDto {
  id: Id;
  name: string;
  description: string;
  status: CourseStatus;
  teachers: CourseTeacherDto[];
}

export interface ListCoursesResponse {
  courses: CourseDto[];
}

export interface GetCourseResponse {
  course: CourseDto;
  studentCount: number;
  homeworkCount: number;
  files: FileDto[];
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
}

// ── Groups ────────────────────────────────────────────────────────

export interface GroupDto {
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
  groups: GroupDto[];
}

// ── Participants ──────────────────────────────────────────────────

export interface StudentDto {
  studentId: Id;
  email: string;
  name: string;
}

export interface TeacherDto {
  teacherId: Id;
  email: string;
  name: string;
}

export interface ListParticipantsResponse {
  students: StudentDto[];
  teachers: TeacherDto[];
}

// ── Homeworks ─────────────────────────────────────────────────────

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
  totalStudentsCount: number;
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

// ── Reviews ───────────────────────────────────────────────────────

export interface GetSubmittedReviewResponse {
  submittedReview: TeacherSubmittedReviewDto;
}

export interface GetAssignedReviewResponse {
  submission: SubmissionForReviewDto;
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
