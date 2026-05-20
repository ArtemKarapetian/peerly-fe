/**
 * Auth API — thin wrapper over /api/v1/auth/* endpoints.
 *
 * Access + refresh tokens live in httpOnly cookies (see httpClient).
 * All we track on the client is a small session record with
 * userId / role / userName — built from the login/register inputs.
 */

import { http, type LoginResponseBody, type RegisterResponseBody, type Role } from "@/shared/api";

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  name: string;
  role: Role;
}

export const authApi = {
  login: (input: LoginInput) =>
    http.post<LoginResponseBody>(
      "/auth/login",
      {
        email: input.email,
        password: input.password,
      },
      { skipAuthRefresh: true },
    ),

  register: (input: RegisterInput) =>
    http.post<RegisterResponseBody>(
      "/auth/register",
      {
        email: input.email,
        password: input.password,
        name: input.name,
        role: input.role,
      },
      { skipAuthRefresh: true },
    ),

  logout: () => http.post<void>("/auth/logout", undefined, { skipAuthRefresh: true }),

  refresh: () => http.post<void>("/auth/refresh", undefined, { skipAuthRefresh: true }),

  getMyRole: () => http.get<{ role: Role }>("/me/role"),

  lookupMyName: async (email: string, role: Role): Promise<string> => {
    const params = new URLSearchParams({
      "filter.query": email,
      "filter.roles": role,
      limit: "5",
    });
    const res = await http.get<{ users: { id: number; email: string; name: string }[] }>(
      `/users?${params.toString()}`,
    );
    const match = res.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    return match?.name ?? "";
  },

  confirmEmail: (params: { token: string; userId: string }) =>
    http.get<void>(
      `/auth/confirm-email?token=${encodeURIComponent(params.token)}&userId=${params.userId}`,
      { skipAuthRefresh: true },
    ),
};
