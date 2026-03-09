import { http } from "@/shared/api";

import type { ApiHomework, ApiCreateHomeworkPayload } from "../model/api.types";
import { mapHomeworkToAssignment } from "../model/mappers";
import type { DemoAssignment } from "../model/types";

export const assignmentHttpRepo = {
  getAll: (): Promise<DemoAssignment[]> =>
    http.get<ApiHomework[]>("/homeworks").then((hws) => hws.map(mapHomeworkToAssignment)),

  getByCourse: (courseId: string): Promise<DemoAssignment[]> =>
    http
      .get<ApiHomework[]>(`/courses/${courseId}/homeworks`)
      .then((hws) => hws.map(mapHomeworkToAssignment)),

  getForStudent: (studentId: string, courseId: string): Promise<DemoAssignment[]> =>
    http
      .get<ApiHomework[]>(`/students/${studentId}/courses/${courseId}/homeworks`)
      .then((hws) => hws.map(mapHomeworkToAssignment)),

  create: (courseId: string, input: ApiCreateHomeworkPayload): Promise<DemoAssignment> =>
    http.post<ApiHomework>(`/courses/${courseId}/homeworks`, input).then(mapHomeworkToAssignment),

  update: (
    courseId: string,
    hwId: string,
    input: Partial<ApiCreateHomeworkPayload>,
  ): Promise<DemoAssignment> =>
    http
      .put<ApiHomework>(`/courses/${courseId}/homeworks/${hwId}`, input)
      .then(mapHomeworkToAssignment),

  delete: (courseId: string, hwId: string): Promise<void> =>
    http.delete(`/courses/${courseId}/homeworks/${hwId}`).then(() => {}),

  archive: (_assignmentId: string, _archived: boolean): Promise<void> => Promise.resolve(),
};
