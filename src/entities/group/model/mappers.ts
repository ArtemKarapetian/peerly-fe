import type { GroupDto, ListParticipantsResponse } from "@/shared/api";
import { logger } from "@/shared/lib/logger";

import type { DemoGroup, GroupParticipants } from "./types";

export function mapDtoToGroup(dto: GroupDto): DemoGroup {
  if (dto.id === undefined || dto.id === null) {
    logger.warn("[group/mapDtoToGroup] missing id in DTO", dto);
  }
  return {
    id: String(dto.id),
    name: typeof dto.name === "string" ? dto.name : "",
    studentCount: Number(dto.studentCount ?? 0),
  };
}

export function mapParticipants(
  dto: Partial<ListParticipantsResponse> | null | undefined,
): GroupParticipants {
  if (dto == null) {
    logger.warn("[group/mapParticipants] null/undefined response");
    return { students: [], teachers: [] };
  }
  const studentsRaw = dto.students;
  const teachersRaw = dto.teachers;
  if (!Array.isArray(studentsRaw)) {
    logger.warn("[group/mapParticipants] students is not an array", studentsRaw);
  }
  if (!Array.isArray(teachersRaw)) {
    logger.warn("[group/mapParticipants] teachers is not an array", teachersRaw);
  }
  const students = Array.isArray(studentsRaw) ? studentsRaw : [];
  const teachers = Array.isArray(teachersRaw) ? teachersRaw : [];
  return {
    students: students
      .filter((s) => s && s.studentId !== undefined && s.studentId !== null)
      .map((s) => ({
        id: String(s.studentId),
        name: typeof s.name === "string" ? s.name : "",
        email: typeof s.email === "string" ? s.email : "",
      })),
    teachers: teachers
      .filter((t) => t && t.teacherId !== undefined && t.teacherId !== null)
      .map((t) => ({
        id: String(t.teacherId),
        name: typeof t.name === "string" ? t.name : "",
        email: typeof t.email === "string" ? t.email : "",
      })),
  };
}
