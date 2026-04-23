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
  userName: string;
  role: Role;
}

export const authApi = {
  login: (input: LoginInput) =>
    http.post<LoginResponseBody>("/auth/login", {
      email: input.email,
      password: input.password,
    }),

  register: (input: RegisterInput) =>
    http.post<RegisterResponseBody>("/auth/register", {
      email: input.email,
      password: input.password,
      userName: input.userName,
      role: input.role,
    }),

  logout: () => http.post<void>("/auth/logout"),

  refresh: () => http.post<void>("/auth/refresh"),

  confirmEmail: (params: { token: string; userId: string }) =>
    http.get<void>(
      `/auth/confirm-email?token=${encodeURIComponent(params.token)}&userId=${params.userId}`,
    ),
};
