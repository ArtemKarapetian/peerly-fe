import type { Id } from "./common";

export interface GroupDto {
  id: Id;
  name: string;
  studentCount: number;
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
}

export interface AddGroupStudentRequestBody {
  studentId: Id;
}

export interface AddGroupTeacherRequestBody {
  teacherId: Id;
}

export interface ListGroupsResponse {
  groupInfos: GroupDto[];
}

export interface GetGroupResponse {
  groupInfo: GroupDto;
}
