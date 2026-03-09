import { http } from "@/shared/api";

import type { ApiCourse } from "../model/api.types";
import { mapApiCourse, mapCourseToPayload } from "../model/mappers";
import type { CreateCourseInput, DemoCourse } from "../model/types";

export const courseHttpRepo = {
  getAll: (): Promise<DemoCourse[]> =>
    http.get<ApiCourse[]>("/courses").then((cs) => cs.map(mapApiCourse)),

  getById: (id: string): Promise<DemoCourse | undefined> =>
    http.get<ApiCourse>(`/courses/${id}`).then(mapApiCourse),

  getForTeacher: (teacherId: string): Promise<DemoCourse[]> =>
    http.get<ApiCourse[]>(`/teachers/${teacherId}/courses`).then((cs) => cs.map(mapApiCourse)),

  getForStudent: (studentId: string): Promise<DemoCourse[]> =>
    http.get<ApiCourse[]>(`/students/${studentId}/courses`).then((cs) => cs.map(mapApiCourse)),

  archive: (courseId: string, archived: boolean): Promise<void> =>
    http.put(`/courses/${courseId}`, { status: archived ? "archived" : "active" }).then(() => {}),

  create: (input: CreateCourseInput): Promise<DemoCourse> =>
    http.post<ApiCourse>("/courses", mapCourseToPayload(input)).then(mapApiCourse),
};
