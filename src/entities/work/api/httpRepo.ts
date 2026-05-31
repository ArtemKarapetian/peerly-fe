import {
  type CourseDto,
  type CreateSubmittedHomeworkRequestBody,
  type CreateSubmittedHomeworkResponse,
  type GetSubmittedHomeworkResponse,
  type GetTeacherSubmittedHomeworkResponse,
  type HomeworkDto,
  type Id,
  type SubmittedHomeworkOverviewDto,
  type UpdateSubmittedHomeworkRequestBody,
  getSession,
  http,
  paged,
} from "@/shared/api";

import { mapDtoToSubmission, mapOverviewToSubmission } from "../model/mappers";
import { fileFromDto, type DemoSubmission } from "../model/types";

// BE wire shapes — translate to FE-clean shapes inside this module.
type RawListCourses = { courseInfos: CourseDto[] };
type RawListTeacherHomeworks = { teacherHomeworkInfos: HomeworkDto[] };
type RawListSubmissionsOverview = { submittedHomeworks: SubmittedHomeworkOverviewDto[] };
type RawGetStudentHomework = { submittedHomeworkId: Id | null };

export const workHttpRepo = {
  /**
   * Teacher-scoped aggregate: all submissions across all visible homeworks.
   * Students get an empty list because the BE has no symmetric endpoint.
   */
  getAll: async (): Promise<DemoSubmission[]> => {
    if (getSession()?.role !== "Teacher") return [];
    const courses = await http.get<RawListCourses>(paged("/teacher/courses"));
    const homeworksPerCourse = await Promise.all(
      courses.courseInfos.map(async (c) => {
        try {
          const res = await http.get<RawListTeacherHomeworks>(
            paged(`/teacher/courses/${c.id}/homeworks`),
          );
          return res.teacherHomeworkInfos.map((h) => String(h.id));
        } catch {
          return [] as string[];
        }
      }),
    );
    const allHomeworkIds = homeworksPerCourse.flat();
    const lists = await Promise.all(
      allHomeworkIds.map(async (hwId) => {
        try {
          const res = await http.get<RawListSubmissionsOverview>(
            paged(`/teacher/homeworks/${hwId}/submissions`),
          );
          return res.submittedHomeworks.map((s) =>
            mapOverviewToSubmission(s, { assignmentId: hwId }),
          );
        } catch {
          return [] as DemoSubmission[];
        }
      }),
    );
    return lists.flat();
  },

  listForHomework: async (homeworkId: string): Promise<DemoSubmission[]> => {
    const res = await http.get<RawListSubmissionsOverview>(
      paged(`/teacher/homeworks/${homeworkId}/submissions`),
    );
    return res.submittedHomeworks.map((s) =>
      mapOverviewToSubmission(s, { assignmentId: homeworkId }),
    );
  },

  /**
   * Student's own submission for a homework — inferred from the student
   * homework detail endpoint.
   */
  getMineForHomework: async (homeworkId: string): Promise<DemoSubmission | null> => {
    try {
      const res = await http.get<RawGetStudentHomework>(`/student/homeworks/${homeworkId}`);
      if (!res.submittedHomeworkId) return null;
      const sub = await http.get<GetSubmittedHomeworkResponse>(
        `/submissions/${res.submittedHomeworkId}`,
      );
      return {
        ...mapDtoToSubmission(sub.submittedHomework, { assignmentId: homeworkId }),
        finalMark: sub.finalMark,
      };
    } catch {
      return null;
    }
  },

  /** One request to /student/homeworks/{id}, returns just the submission id if any. */
  getMineSubmissionId: async (homeworkId: string): Promise<string | null> => {
    try {
      const res = await http.get<RawGetStudentHomework>(`/student/homeworks/${homeworkId}`);
      return res.submittedHomeworkId ? String(res.submittedHomeworkId) : null;
    } catch {
      return null;
    }
  },

  getById: async (submissionId: string): Promise<DemoSubmission | null> => {
    try {
      if (getSession()?.role === "Teacher") {
        const res = await http.get<GetTeacherSubmittedHomeworkResponse>(
          `/teacher/submissions/${submissionId}`,
        );
        return {
          ...mapDtoToSubmission(res.submittedHomework),
          files: res.submittedHomework.files.map(fileFromDto),
        };
      }
      const res = await http.get<GetSubmittedHomeworkResponse>(`/submissions/${submissionId}`);
      return {
        ...mapDtoToSubmission(res.submittedHomework),
        finalMark: res.finalMark,
      };
    } catch {
      return null;
    }
  },

  create: async (homeworkId: string, comment: string | null): Promise<{ submissionId: string }> => {
    const body: CreateSubmittedHomeworkRequestBody = { comment };
    const res = await http.post<CreateSubmittedHomeworkResponse>(
      `/homeworks/${homeworkId}/submissions`,
      body,
    );
    return { submissionId: String(res.submittedHomeworkId) };
  },

  update: async (submissionId: string, comment: string | null): Promise<void> => {
    const body: UpdateSubmittedHomeworkRequestBody = { comment };
    await http.put<void>(`/submissions/${submissionId}`, body);
  },

  delete: async (submissionId: string): Promise<void> => {
    await http.delete<void>(`/submissions/${submissionId}`);
  },

  correctMark: async (submissionId: string, teacherMark: number): Promise<void> => {
    await http.put<void>(`/submissions/${submissionId}/mark`, { teacherMark });
  },
};
