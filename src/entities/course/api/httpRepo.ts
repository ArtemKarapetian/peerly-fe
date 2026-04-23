/**
 * Courses HTTP repo — routes map to /api/v1 gateway endpoints.
 *
 * Role-aware dispatch: `getAll` / `getById` hit the student- or
 * teacher-scoped endpoint based on the current session role. Generic
 * `/courses` lookup is not exposed by the BE, so we derive the list
 * from the role-specific endpoint instead.
 */

import {
  getSession,
  http,
  type CourseInfoDto,
  type CreateCourseRequestBody,
  type CreateCourseResponse,
  type ListCoursesResponse,
  type UpdateCourseRequestBody,
} from "@/shared/api";

import { mapDtoToCourse } from "../model/mappers";
import type { CreateCourseInput, DemoCourse } from "../model/types";

type SingleCourseResponse = { course: CourseInfoDto };

function rolePrefix(): "student" | "teacher" | "admin" {
  const role = getSession()?.role;
  if (role === "Teacher") return "teacher";
  return "student";
}

async function listCourses(): Promise<CourseInfoDto[]> {
  const prefix = rolePrefix();
  if (prefix === "teacher") {
    const res = await http.get<ListCoursesResponse>("/teacher/courses");
    return res.courseInfos;
  }
  const res = await http.get<ListCoursesResponse>("/student/courses");
  return res.courseInfos;
}

async function getOneCourse(id: string): Promise<CourseInfoDto> {
  const prefix = rolePrefix();
  const path = prefix === "teacher" ? `/teacher/courses/${id}` : `/student/courses/${id}`;
  const res = await http.get<SingleCourseResponse>(path);
  return res.course;
}

export const courseHttpRepo = {
  getAll: async (): Promise<DemoCourse[]> => {
    const list = await listCourses();
    return list.map(mapDtoToCourse);
  },

  getById: async (id: string): Promise<DemoCourse | undefined> => {
    try {
      const dto = await getOneCourse(id);
      return mapDtoToCourse(dto);
    } catch {
      return undefined;
    }
  },

  getForTeacher: async (): Promise<DemoCourse[]> => {
    const res = await http.get<ListCoursesResponse>("/teacher/courses");
    return res.courseInfos.map(mapDtoToCourse);
  },

  getForStudent: async (): Promise<DemoCourse[]> => {
    const res = await http.get<ListCoursesResponse>("/student/courses");
    return res.courseInfos.map(mapDtoToCourse);
  },

  archive: async (courseId: string, archived: boolean): Promise<void> => {
    // BE requires full body on update — fetch current state first.
    const dto = await getOneCourse(courseId);
    const body: UpdateCourseRequestBody = {
      name: dto.name,
      status: archived ? "Canceled" : "InProgress",
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
      code: input.code ?? "",
      teacherId: input.instructorId ?? "",
      orgId: "",
      enrollmentCount: 0,
      homeworkCount: 0,
      status: "active",
      backendStatus: "Draft",
      archived: false,
      createdAt: new Date(),
    };
  },

  delete: async (courseId: string): Promise<void> => {
    await http.delete<void>(`/courses/${courseId}`);
  },
};
