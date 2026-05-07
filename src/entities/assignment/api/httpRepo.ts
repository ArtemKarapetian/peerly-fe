import {
  type CourseDto,
  type CreateHomeworkResponse,
  type HomeworkDto,
  type PostponeDeadlinesRequestBody,
  type UpdateDraftHomeworkRequestBody,
  getSession,
  http,
  paged,
} from "@/shared/api";

import { mapHomeworkToAssignment, mapInputToCreateBody } from "../model/mappers";
import type { CreateAssignmentInput, DemoAssignment } from "../model/types";

type RawListCourses = { courseInfos: CourseDto[] };
type RawListHomeworks = { homeworkInfos: HomeworkDto[] };
type RawGetTeacherHomework = { homeworkInfo: HomeworkDto };
type RawGetStudentHomework = { homeworkInfo: HomeworkDto };

function rolePrefix(): "student" | "teacher" {
  return getSession()?.role === "Teacher" ? "teacher" : "student";
}

async function fetchCourseHomeworks(courseId: string): Promise<HomeworkDto[]> {
  const prefix = rolePrefix();
  const path =
    prefix === "teacher"
      ? `/teacher/courses/${courseId}/homeworks`
      : `/student/courses/${courseId}/homeworks`;
  const raw = await http.get<RawListHomeworks>(paged(path));
  return raw.homeworkInfos;
}

export const assignmentHttpRepo = {
  /**
   * Aggregate endpoint the BE does not expose — fan out over the user's
   * courses. Used by dashboards that need every assignment the user can
   * see.
   */
  getAll: async (): Promise<DemoAssignment[]> => {
    const prefix = rolePrefix();
    const raw = await http.get<RawListCourses>(paged(`/${prefix}/courses`));
    const lists = await Promise.all(
      raw.courseInfos.map(async (c) => {
        try {
          const hws = await fetchCourseHomeworks(String(c.id));
          return hws.map((h) => mapHomeworkToAssignment(h, { courseId: String(c.id) }));
        } catch {
          return [] as DemoAssignment[];
        }
      }),
    );
    return lists.flat();
  },

  getByCourse: async (courseId: string): Promise<DemoAssignment[]> => {
    const hws = await fetchCourseHomeworks(courseId);
    return hws.map((h) => mapHomeworkToAssignment(h, { courseId }));
  },

  getById: async (homeworkId: string): Promise<DemoAssignment | undefined> => {
    const prefix = rolePrefix();
    try {
      if (prefix === "teacher") {
        const raw = await http.get<RawGetTeacherHomework>(`/teacher/homeworks/${homeworkId}`);
        return mapHomeworkToAssignment(raw.homeworkInfo);
      }
      const raw = await http.get<RawGetStudentHomework>(`/student/homeworks/${homeworkId}`);
      return mapHomeworkToAssignment(raw.homeworkInfo);
    } catch {
      return undefined;
    }
  },

  createForCourse: async (
    courseId: string,
    input: CreateAssignmentInput,
  ): Promise<{ homeworkId: string }> => {
    const res = await http.post<CreateHomeworkResponse>(
      `/courses/${courseId}/homeworks`,
      mapInputToCreateBody(input),
    );
    return { homeworkId: String(res.homeworkId) };
  },

  createForGroup: async (
    groupId: string,
    input: CreateAssignmentInput,
  ): Promise<{ homeworkId: string }> => {
    const res = await http.post<CreateHomeworkResponse>(
      `/groups/${groupId}/homeworks`,
      mapInputToCreateBody(input),
    );
    return { homeworkId: String(res.homeworkId) };
  },

  updateDraft: async (homeworkId: string, input: CreateAssignmentInput): Promise<void> => {
    const body: UpdateDraftHomeworkRequestBody = mapInputToCreateBody(input);
    await http.put<void>(`/homeworks/${homeworkId}`, body);
  },

  postponeDeadlines: async (
    homeworkId: string,
    deadline: Date | string,
    reviewDeadline: Date | string,
  ): Promise<void> => {
    const body: PostponeDeadlinesRequestBody = {
      deadline: deadline instanceof Date ? deadline.toISOString() : deadline,
      reviewDeadline:
        reviewDeadline instanceof Date ? reviewDeadline.toISOString() : reviewDeadline,
    };
    await http.put<void>(`/homeworks/${homeworkId}/deadlines`, body);
  },

  publish: async (homeworkId: string): Promise<void> => {
    await http.put<void>(`/homeworks/${homeworkId}/publish`);
  },

  confirm: async (homeworkId: string): Promise<void> => {
    await http.put<void>(`/homeworks/${homeworkId}/confirm`);
  },

  delete: async (homeworkId: string): Promise<void> => {
    await http.delete<void>(`/homeworks/${homeworkId}`);
  },

  archive: async (homeworkId: string, archived: boolean): Promise<void> => {
    if (archived) await http.delete<void>(`/homeworks/${homeworkId}`);
  },
};
