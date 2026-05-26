import { act, render, screen } from "@testing-library/react";
import { useEffect } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { STORAGE_KEYS } from "@/shared/config/constants";

import { AuthProvider, useAuth } from "./auth";

const { authApiMock, navigateMock } = vi.hoisted(() => ({
  authApiMock: {
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    refresh: vi.fn(),
    getMyRole: vi.fn(),
    getMe: vi.fn(),
    updateMyName: vi.fn(),
    confirmEmail: vi.fn(),
  },
  navigateMock: vi.fn(),
}));

vi.mock("../api/authHttp", () => ({
  authApi: authApiMock,
}));

vi.mock("@/shared/lib/navigate", () => ({
  appNavigate: (to: string): void => {
    navigateMock(to);
  },
}));

interface CapturedAuth {
  value: ReturnType<typeof useAuth> | null;
}
const captured: CapturedAuth = { value: null };

function Capture() {
  const auth = useAuth();
  useEffect(() => {
    captured.value = auth;
  });
  return (
    <div>
      <span data-testid="auth">{auth.isAuthenticated ? "yes" : "no"}</span>
      <span data-testid="role">{auth.session?.role ?? "-"}</span>
      <span data-testid="name">{auth.user?.name ?? "-"}</span>
    </div>
  );
}

function renderProvider() {
  return render(
    <AuthProvider>
      <Capture />
    </AuthProvider>,
  );
}

function readStored(): Record<string, string> {
  const raw = localStorage.getItem(STORAGE_KEYS.session);
  return JSON.parse(raw ?? "{}") as Record<string, string>;
}

beforeEach(() => {
  Object.values(authApiMock).forEach((fn) => fn.mockReset());
  authApiMock.getMe.mockResolvedValue({ userId: "", email: "", name: "" });
  navigateMock.mockReset();
  localStorage.clear();
  captured.value = null;
});

describe("AuthProvider", () => {
  it("starts unauthenticated when no session is stored", () => {
    renderProvider();
    expect(screen.getByTestId("auth")).toHaveTextContent("no");
    expect(screen.getByTestId("role")).toHaveTextContent("-");
  });

  it("login calls authApi.login + getMyRole and stores the session", async () => {
    authApiMock.login.mockResolvedValueOnce({ userId: "u-1" });
    authApiMock.getMyRole.mockResolvedValueOnce({ role: "Teacher" });

    renderProvider();

    await act(async () => {
      await captured.value!.login({ email: "alice@test.com", password: "pw" });
    });

    expect(authApiMock.login).toHaveBeenCalledWith({ email: "alice@test.com", password: "pw" });
    expect(screen.getByTestId("auth")).toHaveTextContent("yes");
    expect(screen.getByTestId("role")).toHaveTextContent("Teacher");

    const stored = readStored();
    expect(stored).toMatchObject({ userId: "u-1", role: "Teacher", email: "alice@test.com" });
  });

  it("login hydrates session from /me and stores the name", async () => {
    authApiMock.login.mockResolvedValueOnce({ userId: "u-1" });
    authApiMock.getMyRole.mockResolvedValueOnce({ role: "Student" });
    authApiMock.getMe.mockResolvedValueOnce({
      userId: "u-1",
      email: "alice@test.com",
      name: "Alice Wonderland",
    });

    renderProvider();

    await act(async () => {
      await captured.value!.login({ email: "alice@test.com", password: "pw" });
    });

    expect(authApiMock.getMe).toHaveBeenCalledWith("Student");
    expect(screen.getByTestId("name")).toHaveTextContent("Alice Wonderland");
    expect(readStored().userName).toBe("Alice Wonderland");
  });

  it("login falls back to empty userName when /me fails", async () => {
    authApiMock.login.mockResolvedValueOnce({ userId: "u-1" });
    authApiMock.getMyRole.mockResolvedValueOnce({ role: "Student" });
    authApiMock.getMe.mockRejectedValueOnce(new Error("network"));

    renderProvider();

    await act(async () => {
      await captured.value!.login({ email: "alice@test.com", password: "pw" });
    });

    expect(readStored().userName).toBe("");
  });

  it("register does not log the user in — BE requires email confirmation first", async () => {
    authApiMock.register.mockResolvedValueOnce({ userId: "u-2" });

    renderProvider();

    await act(async () => {
      await captured.value!.register({
        email: "bob@test.com",
        password: "pw",
        name: "Bob",
        role: "Student",
      });
    });

    expect(screen.getByTestId("auth")).toHaveTextContent("no");
    expect(localStorage.getItem(STORAGE_KEYS.session)).toBeNull();
  });

  it("confirmEmail stores a session hydrated from /me after BE accepts the token", async () => {
    authApiMock.confirmEmail.mockResolvedValueOnce({ userId: "u-7" });
    authApiMock.getMyRole.mockResolvedValueOnce({ role: "Teacher" });
    authApiMock.getMe.mockResolvedValueOnce({
      userId: "u-7",
      email: "bob@x",
      name: "Bob Teacher",
    });

    renderProvider();

    await act(async () => {
      await captured.value!.confirmEmail({ token: "tok", userId: "u-7" });
    });

    expect(screen.getByTestId("auth")).toHaveTextContent("yes");
    const stored = readStored();
    expect(stored).toMatchObject({
      userId: "u-7",
      role: "Teacher",
      userName: "Bob Teacher",
      email: "bob@x",
    });
  });

  it("switchRoleDev creates a dev session when none exists and updates role", () => {
    renderProvider();

    act(() => {
      captured.value!.switchRoleDev("Admin");
    });

    expect(screen.getByTestId("role")).toHaveTextContent("Admin");
    const stored = readStored();
    expect(stored.role).toBe("Admin");
    expect(stored.userId).toBe("dev-1");
  });

  it("switchRoleDev preserves session userId on an existing session", async () => {
    authApiMock.login.mockResolvedValueOnce({ userId: "u-9" });
    authApiMock.getMyRole.mockResolvedValueOnce({ role: "Student" });

    renderProvider();

    await act(async () => {
      await captured.value!.login({ email: "x@x", password: "pw" });
    });

    act(() => {
      captured.value!.switchRoleDev("Teacher");
    });

    const stored = readStored();
    expect(stored.userId).toBe("u-9");
    expect(stored.role).toBe("Teacher");
  });

  it("logout clears the session and navigates home", async () => {
    authApiMock.login.mockResolvedValueOnce({ userId: "u-1" });
    authApiMock.getMyRole.mockResolvedValueOnce({ role: "Student" });
    authApiMock.logout.mockResolvedValueOnce(undefined);

    renderProvider();

    await act(async () => {
      await captured.value!.login({ email: "a@x", password: "pw" });
    });
    expect(screen.getByTestId("auth")).toHaveTextContent("yes");

    await act(async () => {
      await captured.value!.logout();
    });

    expect(screen.getByTestId("auth")).toHaveTextContent("no");
    expect(localStorage.getItem(STORAGE_KEYS.session)).toBeNull();
    expect(navigateMock).toHaveBeenCalledWith("/");
  });

  it("logout still clears local state when the server call fails", async () => {
    authApiMock.login.mockResolvedValueOnce({ userId: "u-1" });
    authApiMock.getMyRole.mockResolvedValueOnce({ role: "Student" });
    authApiMock.logout.mockRejectedValueOnce(new Error("server down"));

    renderProvider();

    await act(async () => {
      await captured.value!.login({ email: "a@x", password: "pw" });
    });

    await act(async () => {
      await captured.value!.logout();
    });

    expect(localStorage.getItem(STORAGE_KEYS.session)).toBeNull();
    expect(navigateMock).toHaveBeenCalledWith("/");
  });
});
