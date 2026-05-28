import { renderHook, waitFor } from "@testing-library/react";
import { createElement, type PropsWithChildren } from "react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ApiError } from "@/shared/api";
import { STORAGE_KEYS } from "@/shared/config/constants";

import { useVerifyEmail } from "./useVerifyEmail";

const { confirmEmailMock, defaultRouteMock, navigateMock } = vi.hoisted(() => ({
  confirmEmailMock: vi.fn(),
  defaultRouteMock: vi.fn(() => "/student/dashboard"),
  navigateMock: vi.fn(),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (k: string) => k }),
}));

vi.mock("@/entities/user", () => ({
  useAuth: () => ({ confirmEmail: confirmEmailMock }),
  defaultRouteForRole: defaultRouteMock,
  authApi: { resendConfirmationEmail: vi.fn() },
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

function wrapper(initialPath: string) {
  return ({ children }: PropsWithChildren) =>
    createElement(MemoryRouter, { initialEntries: [initialPath] }, children);
}

beforeEach(() => {
  confirmEmailMock.mockReset();
  navigateMock.mockReset();
  localStorage.clear();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("useVerifyEmail", () => {
  it("starts in 'pending' state when there is no token", () => {
    const { result } = renderHook(() => useVerifyEmail(), { wrapper: wrapper("/verify") });
    expect(result.current.state).toBe("pending");
  });

  it("transitions to 'verified' when confirmEmail succeeds", async () => {
    confirmEmailMock.mockResolvedValue({ role: "Student" });

    const { result } = renderHook(() => useVerifyEmail(), {
      wrapper: wrapper("/verify?token=abc"),
    });

    expect(result.current.state).toBe("confirming");
    await waitFor(() => {
      expect(result.current.state).toBe("verified");
    });
    expect(confirmEmailMock).toHaveBeenCalledWith({ token: "abc" });
  });

  it("transitions to 'expired' on 410 ApiError", async () => {
    confirmEmailMock.mockRejectedValue(new ApiError(410, null, "expired"));

    const { result } = renderHook(() => useVerifyEmail(), {
      wrapper: wrapper("/verify?token=abc"),
    });

    await waitFor(() => {
      expect(result.current.state).toBe("expired");
    });
  });

  it("transitions to 'error' on a non-expired error", async () => {
    confirmEmailMock.mockRejectedValue(new Error("boom"));

    const { result } = renderHook(() => useVerifyEmail(), {
      wrapper: wrapper("/verify?token=abc"),
    });

    await waitFor(() => {
      expect(result.current.state).toBe("error");
    });
  });

  it("reads pending email from localStorage", () => {
    localStorage.setItem(STORAGE_KEYS.pendingVerificationEmail, "user@example.com");
    const { result } = renderHook(() => useVerifyEmail(), { wrapper: wrapper("/verify") });
    expect(result.current.email).toBe("user@example.com");
  });
});
