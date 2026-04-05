import { renderHook, act } from "@testing-library/react";
import { ReactNode } from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { setTokens, clearTokens } from "@/shared/api/httpClient";
import { appNavigate } from "@/shared/lib/navigate";

import { AuthProvider, useAuth } from "./auth";

vi.mock("@/shared/api/httpClient", () => ({
  setTokens: vi.fn(),
  clearTokens: vi.fn(),
}));

vi.mock("@/shared/lib/navigate", () => ({
  appNavigate: vi.fn(),
}));

function wrapper({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}

describe("AuthProvider", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("starts unauthenticated when localStorage is empty", () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it("reads auth state from localStorage on init", () => {
    const savedUser = { id: "u1", name: "Test", email: "test@example.com" };
    localStorage.setItem("peerly_auth", "true");
    localStorage.setItem("peerly_user", JSON.stringify(savedUser));

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(savedUser);
  });

  it("login() sets default user when no data provided", () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      result.current.login();
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual({
      id: "student-1",
      name: "Студент",
      email: "student@example.com",
    });
  });

  it("login() sets custom user when provided", () => {
    const customUser = { id: "u2", name: "Custom", email: "custom@example.com" };
    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      result.current.login({ user: customUser });
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(customUser);
  });

  it("login() stores tokens when accessToken provided", () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      result.current.login({
        accessToken: "access-123",
        refreshToken: "refresh-456",
      });
    });

    expect(setTokens).toHaveBeenCalledWith("access-123", "refresh-456");
  });

  it("logout() clears auth state and navigates to /", () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      result.current.login();
    });

    expect(result.current.isAuthenticated).toBe(true);

    act(() => {
      result.current.logout();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(clearTokens).toHaveBeenCalled();
    expect(appNavigate).toHaveBeenCalledWith("/");
  });
});
