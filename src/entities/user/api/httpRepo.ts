import { http } from "@/shared/api";

import type { ApiStudent, ApiTeacher, ApiUpdateProfilePayload } from "../model/api.types";
import { mapApiStudent, mapApiTeacher } from "../model/mappers";
import type { User } from "../model/types";

interface UserSearchInfo {
  id: number | string;
  email: string;
  name: string;
  role?: "Student" | "Teacher" | "Admin";
}

function knownRole(r: unknown): "Student" | "Teacher" | "Admin" {
  return r === "Teacher" || r === "Admin" ? r : "Student";
}

async function fetchUserRows(params: URLSearchParams): Promise<UserSearchInfo[]> {
  const res = await http.get<{ users?: UserSearchInfo[] }>(`/users?${params.toString()}`);
  const rows = Array.isArray(res?.users) ? res.users : [];
  return rows.filter((u): u is UserSearchInfo => Boolean(u) && u.id !== undefined && u.id !== null);
}

export const userHttpRepo = {
  search: async (query: string, limit = 100): Promise<User[]> => {
    const params = new URLSearchParams({ "filter.query": query, limit: String(limit) });
    params.append("filter.roles", "Student");
    params.append("filter.roles", "Teacher");
    const rows = await fetchUserRows(params);
    return rows.map((u) => ({
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
    const rows = await fetchUserRows(params);
    return rows.map((u) => ({
      id: String(u.id),
      name: typeof u.name === "string" ? u.name : "",
      email: typeof u.email === "string" ? u.email : "",
    }));
  },

  getById: (id: string): Promise<User | undefined> => {
    // Try student first, fall back to teacher
    return http
      .get<ApiStudent>(`/students/${id}`)
      .then(mapApiStudent)
      .catch(() => http.get<ApiTeacher>(`/teachers/${id}`).then(mapApiTeacher));
  },

  getStudent: (id: string): Promise<User> =>
    http.get<ApiStudent>(`/students/${id}`).then(mapApiStudent),

  getTeacher: (id: string): Promise<User> =>
    http.get<ApiTeacher>(`/teachers/${id}`).then(mapApiTeacher),

  updateStudent: (id: string, data: ApiUpdateProfilePayload): Promise<User> =>
    http.put<ApiStudent>(`/students/${id}`, data).then(mapApiStudent),

  updateTeacher: (id: string, data: ApiUpdateProfilePayload): Promise<User> =>
    http.put<ApiTeacher>(`/teachers/${id}`, data).then(mapApiTeacher),
};
