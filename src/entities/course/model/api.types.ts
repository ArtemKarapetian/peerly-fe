/**
 * Backend response types for courses (mirror of gateway DTOs).
 *
 * Re-exported from the shared API layer — kept here only as a local alias
 * so the entity's mapper imports don't spread to application code.
 */

export type {
  CourseInfoDto,
  CourseStatus,
  CreateCourseRequestBody,
  UpdateCourseRequestBody,
} from "@/shared/api";
