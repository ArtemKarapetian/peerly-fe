import {
  ApiError,
  type CreateRubricRequestBody,
  type CreateRubricResponse,
  type GetRubricResponse,
  type ListRubricsResponse,
  type UpdateRubricRequestBody,
  getSession,
  http,
} from "@/shared/api";

import { mapInputToBody, mapRubricDetail, mapRubricSummary } from "../model/mappers";
import type { RubricDetail, RubricInput, RubricSummary } from "../model/types";

function rolePrefix(): "student" | "teacher" {
  const role = getSession()?.role;
  return role === "Teacher" || role === "Admin" ? "teacher" : "student";
}

export const rubricHttpRepo = {
  listMine: async (): Promise<RubricSummary[]> => {
    const res = await http.get<ListRubricsResponse>(`/teacher/rubrics`);
    return (res.rubrics ?? []).map(mapRubricSummary);
  },

  getById: async (rubricId: string): Promise<RubricDetail | null> => {
    const prefix = rolePrefix();
    try {
      const res = await http.get<GetRubricResponse>(`/${prefix}/rubrics/${rubricId}`);
      return mapRubricDetail(res);
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) return null;
      throw err;
    }
  },

  create: async (input: RubricInput): Promise<{ rubricId: string }> => {
    const body: CreateRubricRequestBody = mapInputToBody(input);
    const res = await http.post<CreateRubricResponse>(`/rubrics`, body);
    return { rubricId: String(res.rubricId) };
  },

  update: async (rubricId: string, input: RubricInput): Promise<void> => {
    const body: UpdateRubricRequestBody = mapInputToBody(input);
    await http.put<void>(`/rubrics/${rubricId}`, body);
  },

  delete: async (rubricId: string): Promise<void> => {
    await http.delete<void>(`/rubrics/${rubricId}`);
  },
};
