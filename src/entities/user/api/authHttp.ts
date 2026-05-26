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

export interface MyProfile {
  userId: string;
  email: string;
  name: string;
}

interface StudentInfoDto {
  studentId: number;
  email: string;
  name: string;
}

interface TeacherInfoDto {
  teacherId: number;
  email: string;
  name: string;
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

  getMe: async (role: Role): Promise<MyProfile> => {
    if (role === "Teacher") {
      const res = await http.get<{ teacherInfo: TeacherInfoDto }>("/teacher/me");
      return {
        userId: String(res.teacherInfo.teacherId),
        email: res.teacherInfo.email,
        name: res.teacherInfo.name,
      };
    }
    if (role === "Student") {
      const res = await http.get<{ studentInfo: StudentInfoDto }>("/student/me");
      return {
        userId: String(res.studentInfo.studentId),
        email: res.studentInfo.email,
        name: res.studentInfo.name,
      };
    }
    return { userId: "", email: "", name: "" };
  },

  updateMyName: async (role: Role, name: string): Promise<void> => {
    if (role === "Teacher") {
      await http.put<void>("/teacher/me", { name });
    } else if (role === "Student") {
      await http.put<void>("/student/me", { name });
    }
  },

  confirmEmail: (params: { token: string; userId: string }): Promise<{ userId: number | string }> =>
    http.get<{ userId: number | string }>(
      `/auth/confirm-email?token=${encodeURIComponent(params.token)}&userId=${encodeURIComponent(params.userId)}`,
      { skipAuthRefresh: true },
    ),

  resendConfirmationEmail: (email: string): Promise<void> =>
    http.post<void>("/auth/resend-confirmation-email", { email }, { skipAuthRefresh: true }),
};
