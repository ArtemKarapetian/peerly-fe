import type { CourseDto, CourseStatus } from "@/shared/api";

import type { DemoCourse } from "./types";

const ARCHIVED_STATUSES: CourseStatus[] = ["canceled", "deleted", "finished"];

export function isArchivedStatus(status: CourseStatus): boolean {
  return ARCHIVED_STATUSES.includes(status);
}

export function mapDtoToCourse(
  dto: CourseDto,
  counts: { studentCount: number; homeworkCount: number } = { studentCount: 0, homeworkCount: 0 },
): DemoCourse {
  const archived = isArchivedStatus(dto.status);
  return {
    id: String(dto.id),
    name: dto.name,
    title: dto.name,
    code: "",
    teacherId: "",
    enrollmentCount: counts.studentCount,
    homeworkCount: counts.homeworkCount,
    status: archived ? "archived" : "active",
    backendStatus: dto.status,
    archived,
    createdAt: new Date(),
  };
}
