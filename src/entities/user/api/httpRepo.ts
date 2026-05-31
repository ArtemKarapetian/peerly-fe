import { http } from "@/shared/api";

import type { ApiStudent, ApiTeacher, ApiUpdateProfilePayload } from "../model/api.types";
import { mapApiStudent, mapApiTeacher } from "../model/mappers";
import type { DemoUser } from "../model/types";

interface UserSearchInfo {
  id: number | string;
  email: string;
  name: string;
  role?: "Student" | "Teacher" | "Admin";
}

function knownRole(r: unknown): "Student" | "Teacher" | "Admin" {
  return r === "Teacher" || r === "Admin" ? r : "Student";
}

export const userHttpRepo = {
  getAll: async (): Promise<DemoUser[]> => {
    const params = new URLSearchParams({ "filter.query": "", limit: "100" });
    const res = await http.get<{ users?: UserSearchInfo[] }>(`/users?${params.toString()}`);
    const rows = Array.isArray(res?.users) ? res.users : [];
    return rows
      .filter((u): u is UserSearchInfo => Boolean(u) && u.id !== undefined && u.id !== null)
      .map((u) => ({
        id: String(u.id),
        name: typeof u.name === "string" ? u.name : "",
        email: typeof u.email === "string" ? u.email : "",
        role: knownRole(u.role),
        createdAt: new Date(0),
      }));
  },

  searchStudents: async (
    query: string,
    limit = 100,
  ): Promise<{ id: string; name: string; email: string }[]> => {
    const params = new URLSearchParams({
      "filter.query": query,
      "filter.roles": "Student",
      limit: String(limit),
    });
    const res = await http.get<{ users?: UserSearchInfo[] }>(`/users?${params.toString()}`);
    const rows = Array.isArray(res?.users) ? res.users : [];
    return rows
      .filter((u): u is UserSearchInfo => Boolean(u) && u.id !== undefined && u.id !== null)
      .map((u) => ({
        id: String(u.id),
        name: typeof u.name === "string" ? u.name : "",
        email: typeof u.email === "string" ? u.email : "",
      }));
  },

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
