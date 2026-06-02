import type { GroupDto, ListParticipantsResponse } from "@/shared/api";

import type { Group, GroupParticipants } from "./types";

export function mapDtoToGroup(dto: GroupDto): Group {
  return {
    id: String(dto.id),
    name: dto.name,
    studentCount: dto.studentCount ?? 0,
  };
}

export function mapParticipants(dto: ListParticipantsResponse): GroupParticipants {
  return {
    students: dto.students.map((s) => ({
      id: String(s.studentId),
      name: s.name,
      email: s.email,
    })),
    teachers: dto.teachers.map((t) => ({
      id: String(t.teacherId),
      name: t.name,
      email: t.email,
    })),
  };
}
