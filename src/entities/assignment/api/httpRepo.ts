import {
  ApiError,
  type CourseDto,
  type CreateHomeworkResponse,
  type FileDto,
  type HomeworkDto,
  type PostponeDeadlinesRequestBody,
  type UpdateDraftHomeworkRequestBody,
  getSession,
  http,
  paged,
} from "@/shared/api";

import { mapHomeworkToAssignment, mapInputToCreateBody } from "../model/mappers";
import type { CreateAssignmentInput, Assignment, TeacherAssignmentDetail } from "../model/types";

type RawListCourses = { courseInfos: CourseDto[] };
type RawListStudentHomeworks = { studentHomeworkInfos: HomeworkDto[] };
type RawListTeacherHomeworks = { teacherHomeworkInfos: HomeworkDto[] };
type RawGetTeacherHomework = {
  teacherHomeworkInfo: HomeworkDto;
  submittedCount: number;
  files: FileDto[];
};
type RawGetStudentHomework = { studentHomeworkInfo: HomeworkDto };

function rolePrefix(): "student" | "teacher" {
  return getSession()?.role === "Teacher" ? "teacher" : "student";
}

async function findCourseIdForHomework(homeworkId: string): Promise<string | undefined> {
  try {
    const prefix = rolePrefix();
    const raw = await http.get<RawListCourses>(paged(`/${prefix}/courses`));
    for (const c of raw.courseInfos) {
      try {
        const hws = await fetchCourseHomeworks(String(c.id));
        if (hws.some((h) => String(h.id) === homeworkId)) return String(c.id);
      } catch {}
    }
  } catch {}
  return undefined;
}

async function fetchCourseHomeworks(courseId: string): Promise<HomeworkDto[]> {
  if (rolePrefix() === "teacher") {
    const raw = await http.get<RawListTeacherHomeworks>(
      paged(`/teacher/courses/${courseId}/homeworks`),
    );
    return raw.teacherHomeworkInfos;
  }
  const raw = await http.get<RawListStudentHomeworks>(
    paged(`/student/courses/${courseId}/homeworks`),
  );
  return raw.studentHomeworkInfos;
}

export const assignmentHttpRepo = {
  /**
   * Aggregate endpoint the BE does not expose — fan out over the user's
   * courses. Used by dashboards that need every assignment the user can
   * see.
   */
  getAll: async (): Promise<Assignment[]> => {
    const prefix = rolePrefix();
    const raw = await http.get<RawListCourses>(paged(`/${prefix}/courses`));
    const lists = await Promise.all(
      raw.courseInfos.map(async (c) => {
        try {
          const hws = await fetchCourseHomeworks(String(c.id));
          return hws.map((h) => mapHomeworkToAssignment(h, { courseId: String(c.id) }));
        } catch {
          return [] as Assignment[];
        }
      }),
    );
    return lists.flat();
  },

  getByCourse: async (courseId: string): Promise<Assignment[]> => {
    const hws = await fetchCourseHomeworks(courseId);
    return hws.map((h) => mapHomeworkToAssignment(h, { courseId }));
  },

  getById: async (homeworkId: string): Promise<Assignment | undefined> => {
    const prefix = rolePrefix();
    try {
      if (prefix === "teacher") {
        const raw = await http.get<RawGetTeacherHomework>(`/teacher/homeworks/${homeworkId}`);
        const courseId = await findCourseIdForHomework(homeworkId);
        return mapHomeworkToAssignment(raw.teacherHomeworkInfo, { courseId });
      }
      const raw = await http.get<RawGetStudentHomework>(`/student/homeworks/${homeworkId}`);
      const courseId = await findCourseIdForHomework(homeworkId);
      return mapHomeworkToAssignment(raw.studentHomeworkInfo, { courseId });
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) return undefined;
      throw err;
    }
  },

  getTeacherDetail: async (homeworkId: string): Promise<TeacherAssignmentDetail | undefined> => {
    try {
      const raw = await http.get<RawGetTeacherHomework>(`/teacher/homeworks/${homeworkId}`);
      const courseId = await findCourseIdForHomework(homeworkId);
      return {
        assignment: mapHomeworkToAssignment(raw.teacherHomeworkInfo, { courseId }),
        submittedCount: raw.submittedCount,
      };
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) return undefined;
      throw err;
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
