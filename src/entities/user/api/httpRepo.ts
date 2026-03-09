import { http } from "@/shared/api";

import type { ApiStudent, ApiTeacher, ApiUpdateProfilePayload } from "../model/api.types";
import { mapApiStudent, mapApiTeacher } from "../model/mappers";
import type { DemoUser } from "../model/types";

export const userHttpRepo = {
  getAll: (): Promise<DemoUser[]> => Promise.resolve([]), // No bulk endpoint — keep empty

  getById: (id: string): Promise<DemoUser | undefined> => {
    // Try student first, fall back to teacher
    return http
      .get<ApiStudent>(`/students/${id}`)
      .then(mapApiStudent)
      .catch(() => http.get<ApiTeacher>(`/teachers/${id}`).then(mapApiTeacher));
  },

  getStudent: (id: string): Promise<DemoUser> =>
    http.get<ApiStudent>(`/students/${id}`).then(mapApiStudent),

  getTeacher: (id: string): Promise<DemoUser> =>
    http.get<ApiTeacher>(`/teachers/${id}`).then(mapApiTeacher),

  updateStudent: (id: string, data: ApiUpdateProfilePayload): Promise<DemoUser> =>
    http.put<ApiStudent>(`/students/${id}`, data).then(mapApiStudent),

  updateTeacher: (id: string, data: ApiUpdateProfilePayload): Promise<DemoUser> =>
    http.put<ApiTeacher>(`/teachers/${id}`, data).then(mapApiTeacher),
};
