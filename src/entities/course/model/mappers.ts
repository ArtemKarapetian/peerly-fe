import type { CourseDto, CourseStatus, CourseTeacherDto } from "@/shared/api";

import type { CourseTeacher, Course } from "./types";

const ARCHIVED_STATUSES: CourseStatus[] = ["canceled", "deleted", "finished"];

export function isArchivedStatus(status: CourseStatus): boolean {
  return ARCHIVED_STATUSES.includes(status);
}

export function mapDtoToTeacher(t: CourseTeacherDto): CourseTeacher {
  return { id: String(t.teacherId), name: t.name, email: t.email };
}

function uiStatus(s: CourseStatus): "draft" | "active" | "archived" {
  if (isArchivedStatus(s)) return "archived";
  if (s === "draft") return "draft";
  return "active";
}

export function mapDtoToCourse(
  dto: CourseDto,
  counts: { studentCount: number; homeworkCount: number } = { studentCount: 0, homeworkCount: 0 },
): Course {
  const archived = isArchivedStatus(dto.status);
  return {
    id: String(dto.id),
    name: dto.name,
    description: dto.description ?? "",
    teachers: (dto.teachers ?? []).map(mapDtoToTeacher),
    enrollmentCount: counts.studentCount,
    homeworkCount: counts.homeworkCount,
    status: uiStatus(dto.status),
    backendStatus: dto.status,
    archived,
  };
}
