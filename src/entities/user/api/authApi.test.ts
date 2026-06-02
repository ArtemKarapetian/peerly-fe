import { beforeEach, describe, expect, it, vi } from "vitest";

import { authApi } from "./authApi";

const httpMock = {
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
};

vi.mock("@/shared/api", async () => {
  const actual = await vi.importActual<typeof import("@/shared/api")>("@/shared/api");
  return {
    ...actual,
    http: {
      get: (...args: unknown[]): unknown => httpMock.get(...args),
      post: (...args: unknown[]): unknown => httpMock.post(...args),
      put: (...args: unknown[]): unknown => httpMock.put(...args),
      delete: (...args: unknown[]): unknown => httpMock.delete(...args),
    },
  };
});

beforeEach(() => {
  httpMock.get.mockReset();
  httpMock.post.mockReset();
  httpMock.put.mockReset();
});

describe("authApi", () => {
  it("login POSTs to /auth/login with skipAuthRefresh", async () => {
    httpMock.post.mockResolvedValueOnce({ userId: "u-1" });
    await authApi.login({ email: "a@x", password: "pw" });

    expect(httpMock.post.mock.calls[0]![0]).toBe("/auth/login");
    expect(httpMock.post.mock.calls[0]![1]).toEqual({ email: "a@x", password: "pw" });
    expect(httpMock.post.mock.calls[0]![2]).toEqual({ skipAuthRefresh: true });
  });

  it("register POSTs to /auth/register with all fields", async () => {
    httpMock.post.mockResolvedValueOnce({ userId: "u-2" });
    await authApi.register({ email: "a@x", password: "pw", name: "Name", role: "Teacher" });

    expect(httpMock.post.mock.calls[0]![0]).toBe("/auth/register");
    expect(httpMock.post.mock.calls[0]![1]).toEqual({
      email: "a@x",
      password: "pw",
      name: "Name",
      role: "Teacher",
    });
  });

  it("logout and refresh POST without body but skip auth refresh", async () => {
    httpMock.post.mockResolvedValue(undefined);

    await authApi.logout();
    await authApi.refresh();

    expect(httpMock.post.mock.calls[0]).toEqual([
      "/auth/logout",
      undefined,
      { skipAuthRefresh: true },
    ]);
    expect(httpMock.post.mock.calls[1]).toEqual([
      "/auth/refresh",
      undefined,
      { skipAuthRefresh: true },
    ]);
  });

  it("getMyRole GETs /me/role", async () => {
    httpMock.get.mockResolvedValueOnce({ role: "Student" });
    const res = await authApi.getMyRole();
    expect(httpMock.get.mock.calls[0]![0]).toBe("/me/role");
    expect(res.role).toBe("Student");
  });

  it("getMe Student hits /student/me and unwraps studentInfo", async () => {
    httpMock.get.mockResolvedValueOnce({
      studentInfo: { studentId: 42, email: "a@x", name: "Alice" },
    });
    const me = await authApi.getMe("Student");
    expect(httpMock.get.mock.calls[0]![0]).toBe("/student/me");
    expect(me).toEqual({ userId: "42", email: "a@x", name: "Alice" });
  });

  it("getMe Teacher hits /teacher/me and unwraps teacherInfo", async () => {
    httpMock.get.mockResolvedValueOnce({
      teacherInfo: { teacherId: 7, email: "t@x", name: "Tom" },
    });
    const me = await authApi.getMe("Teacher");
    expect(httpMock.get.mock.calls[0]![0]).toBe("/teacher/me");
    expect(me).toEqual({ userId: "7", email: "t@x", name: "Tom" });
  });

  it("updateMyName Student PUTs /student/me", async () => {
    httpMock.put.mockResolvedValueOnce(undefined);
    await authApi.updateMyName("Student", "New Name");
    expect(httpMock.put.mock.calls[0]![0]).toBe("/student/me");
    expect(httpMock.put.mock.calls[0]![1]).toEqual({ name: "New Name" });
  });

  it("updateMyName Teacher PUTs /teacher/me", async () => {
    httpMock.put.mockResolvedValueOnce(undefined);
    await authApi.updateMyName("Teacher", "T2");
    expect(httpMock.put.mock.calls[0]![0]).toBe("/teacher/me");
    expect(httpMock.put.mock.calls[0]![1]).toEqual({ name: "T2" });
  });

  it("confirmEmail URL-encodes the token and returns userId from body", async () => {
    httpMock.get.mockResolvedValueOnce({ userId: "u-1" });
    const res = await authApi.confirmEmail({ token: "abc def&xyz" });

    expect(httpMock.get.mock.calls[0]![0]).toBe("/auth/confirm-email?token=abc%20def%26xyz");
    expect(httpMock.get.mock.calls[0]![1]).toEqual({ skipAuthRefresh: true });
    expect(res.userId).toBe("u-1");
  });

  it("resendConfirmationEmail POSTs to /auth/resend-confirmation-email with email body", async () => {
    httpMock.post.mockResolvedValueOnce(undefined);
    await authApi.resendConfirmationEmail("a@x");

    expect(httpMock.post.mock.calls[0]![0]).toBe("/auth/resend-confirmation-email");
    expect(httpMock.post.mock.calls[0]![1]).toEqual({ email: "a@x" });
    expect(httpMock.post.mock.calls[0]![2]).toEqual({ skipAuthRefresh: true });
  });
});
