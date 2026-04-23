import type { GroupInfoDto, ListParticipantsResponse } from "@/shared/api";

import type { DemoGroup, GroupParticipants } from "./types";

export function mapDtoToGroup(dto: GroupInfoDto): DemoGroup {
  return {
    id: String(dto.id),
    name: dto.name,
    courseId: String(dto.courseId),
  };
}

export function mapParticipants(dto: ListParticipantsResponse): GroupParticipants {
  return {
    students: dto.students.map((s) => ({ id: String(s.id), userName: s.userName })),
    teachers: dto.teachers.map((s) => ({ id: String(s.id), userName: s.userName })),
  };
}
