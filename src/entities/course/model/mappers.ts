import type { CourseInfoDto, CourseStatus } from "@/shared/api";

import type { DemoCourse } from "./types";

const ARCHIVED_STATUSES: CourseStatus[] = ["Canceled", "Deleted", "Finished"];

export function isArchivedStatus(status: CourseStatus): boolean {
  return ARCHIVED_STATUSES.includes(status);
}

export function mapDtoToCourse(dto: CourseInfoDto): DemoCourse {
  const archived = isArchivedStatus(dto.status);
  return {
    id: String(dto.id),
    name: dto.name,
    title: dto.name,
    code: "",
    teacherId: "",
    orgId: "",
    enrollmentCount: dto.studentCount,
    homeworkCount: dto.homeworkCount,
    status: archived ? "archived" : "active",
    backendStatus: dto.status,
    archived,
    createdAt: new Date(),
  };
}
