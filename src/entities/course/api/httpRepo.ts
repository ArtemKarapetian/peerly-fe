/**
 * Courses HTTP repo — routes map to /api/v1 gateway endpoints.
 *
 * Role-aware dispatch: `getAll` / `getById` hit the student- or
 * teacher-scoped endpoint based on the current session role. Generic
 * `/courses` lookup is not exposed by the BE, so we derive the list
 * from the role-specific endpoint instead.
 */

import {
  type CourseDto,
  type CreateCourseRequestBody,
  type CreateCourseResponse,
  type FileDto,
  type GetCourseResponse,
  type ListParticipantsResponse,
  type UpdateCourseRequestBody,
  getSession,
  http,
  paged,
} from "@/shared/api";

import { mapDtoToCourse } from "../model/mappers";
import type { CreateCourseInput, DemoCourse } from "../model/types";

type RawListCourses = { courseInfos: CourseDto[] };
type RawGetCourse = {
  courseInfo: CourseDto;
  studentCount: number;
  homeworkCount: number;
  files: FileDto[];
};

function rolePrefix(): "student" | "teacher" | "admin" {
  const role = getSession()?.role;
  if (role === "Teacher") return "teacher";
  return "student";
}

async function listCourses(): Promise<CourseDto[]> {
  const prefix = rolePrefix();
  const path = prefix === "teacher" ? "/teacher/courses" : "/student/courses";
  const raw = await http.get<RawListCourses>(paged(path));
  return raw.courseInfos;
}

async function getOneCourse(id: string): Promise<GetCourseResponse> {
  const prefix = rolePrefix();
  const path = prefix === "teacher" ? `/teacher/courses/${id}` : `/student/courses/${id}`;
  const raw = await http.get<RawGetCourse>(path);
  return {
    course: raw.courseInfo,
    studentCount: raw.studentCount,
    homeworkCount: raw.homeworkCount,
    files: raw.files,
  };
}

export const courseHttpRepo = {
  getAll: async (): Promise<DemoCourse[]> => {
    const list = await listCourses();
    return list.map((info) => mapDtoToCourse(info));
  },

  getById: async (id: string): Promise<DemoCourse | undefined> => {
    try {
      const res = await getOneCourse(id);
      return mapDtoToCourse(res.course, {
        studentCount: res.studentCount,
        homeworkCount: res.homeworkCount,
      });
    } catch {
      return undefined;
    }
  },

  getForTeacher: async (): Promise<DemoCourse[]> => {
    const raw = await http.get<RawListCourses>(paged("/teacher/courses"));
    return raw.courseInfos.map((info) => mapDtoToCourse(info));
  },

  getForStudent: async (): Promise<DemoCourse[]> => {
    const raw = await http.get<RawListCourses>(paged("/student/courses"));
    return raw.courseInfos.map((info) => mapDtoToCourse(info));
  },

  getParticipants: async (courseId: string): Promise<ListParticipantsResponse> =>
    http.get<ListParticipantsResponse>(`/courses/${courseId}/participants`),

  archive: async (courseId: string, archived: boolean): Promise<void> => {
    // BE requires full body on update — fetch current state first.
    const res = await getOneCourse(courseId);
    const body: UpdateCourseRequestBody = {
      name: res.course.name,
      description: res.course.description,
      status: archived ? "canceled" : "inProgress",
    };
    await http.put<void>(`/courses/${courseId}`, body);
  },

  create: async (input: CreateCourseInput): Promise<DemoCourse> => {
    const body: CreateCourseRequestBody = {
      name: input.title,
      description: input.description ?? "",
    };
    const res = await http.post<CreateCourseResponse>("/courses", body);
    return {
      id: String(res.courseId),
      name: input.title,
      title: input.title,
      description: input.description ?? "",
      code: input.code ?? "",
      teacherId: input.instructorId ?? "",
      enrollmentCount: 0,
      homeworkCount: 0,
      status: "active",
      backendStatus: "draft",
      archived: false,
      createdAt: new Date(),
    };
  },

  delete: async (courseId: string): Promise<void> => {
    await http.delete<void>(`/courses/${courseId}`);
  },
};
