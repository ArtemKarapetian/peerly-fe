import {
  getSession,
  http,
  paged,
  type CreateGroupRequestBody,
  type CreateGroupResponse,
  type GetGroupResponse,
  type ListGroupsResponse,
  type ListParticipantsResponse,
  type UpdateGroupRequestBody,
} from "@/shared/api";

import { mapDtoToGroup, mapParticipants } from "../model/mappers";
import type {
  CreateGroupInput,
  DemoGroup,
  GroupParticipants,
  UpdateGroupInput,
} from "../model/types";

function rolePrefix(): "student" | "teacher" {
  return getSession()?.role === "Teacher" ? "teacher" : "student";
}

export const groupHttpRepo = {
  listForCourse: async (courseId: string): Promise<DemoGroup[]> => {
    const prefix = rolePrefix();
    const path =
      prefix === "teacher"
        ? `/teacher/courses/${courseId}/groups`
        : `/student/courses/${courseId}/groups`;
    const res = await http.get<ListGroupsResponse>(paged(path));
    return (res?.groupInfos ?? []).map(mapDtoToGroup);
  },

  getById: async (groupId: string): Promise<DemoGroup | undefined> => {
    const prefix = rolePrefix();
    const path = prefix === "teacher" ? `/teacher/groups/${groupId}` : `/student/groups/${groupId}`;
    try {
      const res = await http.get<GetGroupResponse>(path);
      return mapDtoToGroup(res.groupInfo);
    } catch {
      return undefined;
    }
  },

  getParticipants: async (groupId: string): Promise<GroupParticipants> => {
    const res = await http.get<ListParticipantsResponse>(`/groups/${groupId}/participants`);
    return mapParticipants(res);
  },

  create: async (input: CreateGroupInput): Promise<DemoGroup> => {
    const body: CreateGroupRequestBody = { courseId: input.courseId, name: input.name };
    const res = await http.post<CreateGroupResponse>("/groups", body);
    return { id: String(res.groupId), name: input.name, studentCount: 0 };
  },

  update: async (groupId: string, input: UpdateGroupInput): Promise<void> => {
    const body: UpdateGroupRequestBody = { name: input.name };
    await http.put<void>(`/groups/${groupId}`, body);
  },

  delete: async (groupId: string): Promise<void> => {
    await http.delete<void>(`/groups/${groupId}`);
  },

  addStudent: async (groupId: string, studentId: string): Promise<void> => {
    await http.put<void>(`/groups/${groupId}/students`, { studentId });
  },

  addTeacher: async (groupId: string, teacherId: string): Promise<void> => {
    await http.put<void>(`/groups/${groupId}/teachers`, { teacherId });
  },
};
