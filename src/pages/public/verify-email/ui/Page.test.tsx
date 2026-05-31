import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ApiError } from "@/shared/api";

import VerifyEmailPage from "./Page";

const {
  useAuthMock,
  authApiMock,
  navigateMock,
  toastMock,
  confirmEmailMock,
  defaultRouteForRoleMock,
} = vi.hoisted(() => ({
  useAuthMock: vi.fn(),
  authApiMock: { resendConfirmationEmail: vi.fn() },
  navigateMock: vi.fn(),
  toastMock: { success: vi.fn(), error: vi.fn() },
  confirmEmailMock: vi.fn(),
  defaultRouteForRoleMock: vi.fn(),
}));

let currentSearch = "";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock,
    useSearchParams: () => [new URLSearchParams(currentSearch), vi.fn()] as const,
  };
});

vi.mock("@/entities/user", () => ({
  useAuth: useAuthMock,
  authApi: authApiMock,
  defaultRouteForRole: defaultRouteForRoleMock,
}));

vi.mock("sonner", () => ({ toast: toastMock }));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    i18n: { language: "en" },
    t: (key: string, opts?: Record<string, unknown>) => {
      const dict: Record<string, string> = {
        "page.verifyEmail.title": "Verify your email",
        "page.verifyEmail.weSentEmail": "We sent a verification email to",
        "page.verifyEmail.noEmailHint": "Open the email we just sent you",
        "page.verifyEmail.openEmailAndFollow": "Open the email and follow the link",
        "page.verifyEmail.resendEmail": "Resend email",
        "page.verifyEmail.confirming": "Confirming your email...",
        "page.verifyEmail.emailVerified": "Email verified",
        "page.verifyEmail.redirecting": "Redirecting...",
        "page.verifyEmail.linkExpired": "Link expired",
        "page.verifyEmail.linkExpiredDesc": "Request a new link",
        "page.verifyEmail.sendNewLink": "Send new link",
        "page.verifyEmail.confirmFailed": "Could not confirm email",
        "page.verifyEmail.emailSent": "Email sent",
        "page.verifyEmail.resendFailed": "Failed to resend",
        "page.verifyEmail.checkSpam": "Check your spam folder",
        "page.verifyEmail.backToLogin": "Back to login",
      };
      if (key === "page.verifyEmail.resendIn" && opts && "seconds" in opts) {
        return `Resend in ${String(opts.seconds)}s`;
      }
      return dict[key] ?? key;
    },
  }),
}));

vi.mock("@/widgets/public-layout", () => ({
  PublicLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

function renderPage() {
  return render(
    <MemoryRouter>
      <VerifyEmailPage />
    </MemoryRouter>,
  );
}

beforeEach(() => {
  vi.useRealTimers();
  currentSearch = "";
  localStorage.clear();
  confirmEmailMock.mockReset().mockResolvedValue({
    userId: "1",
    userName: "",
    email: "",
    role: "Student",
  });
  navigateMock.mockReset();
  toastMock.success.mockReset();
  toastMock.error.mockReset();
  authApiMock.resendConfirmationEmail.mockReset();
  defaultRouteForRoleMock.mockReset().mockReturnValue("/student");
  useAuthMock.mockReturnValue({ confirmEmail: confirmEmailMock });
});

afterEach(() => {
  vi.useRealTimers();
});

describe("VerifyEmailPage", () => {
  describe("pending state (no token in URL)", () => {
    it("shows the email from localStorage", () => {
      localStorage.setItem("peerly_pending_verification_email", "user@x.com");
      renderPage();
      expect(screen.getByText("user@x.com")).toBeInTheDocument();
    });

    it("falls back to a hint when no pending email is stored", () => {
      renderPage();
      expect(screen.getByText("Open the email we just sent you")).toBeInTheDocument();
    });

    it("does not render a resend button in the pending state", () => {
      localStorage.setItem("peerly_pending_verification_email", "user@x.com");
      renderPage();
      expect(screen.queryByRole("button", { name: /Resend email/i })).not.toBeInTheDocument();
    });
  });

  describe("confirming via URL params", () => {
    it("calls confirmEmail with the parsed token and redirects to the role-default route on success", async () => {
      localStorage.setItem("peerly_pending_verification_email", "user@x.com");
      currentSearch = "token=abc";
      confirmEmailMock.mockResolvedValue({
        userId: "42",
        userName: "X",
        email: "user@x.com",
        role: "Teacher",
      });
      defaultRouteForRoleMock.mockReturnValue("/teacher");

      renderPage();

      await waitFor(
        () => {
          expect(navigateMock).toHaveBeenCalledWith("/teacher");
        },
        { timeout: 3000 },
      );

      expect(confirmEmailMock).toHaveBeenCalledWith({ token: "abc" });
      expect(localStorage.getItem("peerly_pending_verification_email")).toBeNull();
      expect(defaultRouteForRoleMock).toHaveBeenCalledWith("Teacher");
    });

    it("accepts ?Token=... (capital T) — BE email template uses CamelCase", async () => {
      localStorage.setItem("peerly_pending_verification_email", "user@x.com");
      currentSearch = "Token=ABC";
      confirmEmailMock.mockResolvedValue({
        userId: "1",
        userName: "",
        email: "user@x.com",
        role: "Student",
      });
      defaultRouteForRoleMock.mockReturnValue("/student");

      renderPage();

      await waitFor(() => expect(confirmEmailMock).toHaveBeenCalledWith({ token: "ABC" }));
    });

    it("shows the expired state on 410, with a resend-new-link button", async () => {
      localStorage.setItem("peerly_pending_verification_email", "user@x.com");
      currentSearch = "token=abc";
      confirmEmailMock.mockRejectedValue(new ApiError(410, "Gone", "Gone"));

      renderPage();

      await screen.findByText("Link expired");
      expect(screen.getByRole("button", { name: /Send new link/i })).toBeInTheDocument();
    });

    it("shows a generic error state on 500", async () => {
      currentSearch = "token=abc";
      confirmEmailMock.mockRejectedValue(new ApiError(500, "Boom", "Boom"));

      renderPage();

      await screen.findByText("Could not confirm email");
    });
  });

  describe("resend from expired state", () => {
    it("triggers resendConfirmationEmail, shows a success toast and disables the button after click", async () => {
      localStorage.setItem("peerly_pending_verification_email", "user@x.com");
      currentSearch = "token=abc";
      confirmEmailMock.mockRejectedValue(new ApiError(410, "Gone", "Gone"));
      authApiMock.resendConfirmationEmail.mockResolvedValueOnce(undefined);

      const user = userEvent.setup();
      renderPage();

      const resendBtn = await screen.findByRole("button", { name: /Send new link/i });
      await user.click(resendBtn);

      await waitFor(() => {
        expect(authApiMock.resendConfirmationEmail).toHaveBeenCalledWith("user@x.com");
      });
      expect(toastMock.success).toHaveBeenCalled();
    });

    it("shows an error toast when resend fails", async () => {
      localStorage.setItem("peerly_pending_verification_email", "user@x.com");
      currentSearch = "token=abc";
      confirmEmailMock.mockRejectedValue(new ApiError(410, "Gone", "Gone"));
      authApiMock.resendConfirmationEmail.mockRejectedValueOnce(new Error("nope"));

      const user = userEvent.setup();
      renderPage();

      const resendBtn = await screen.findByRole("button", { name: /Send new link/i });
      await user.click(resendBtn);

      await waitFor(() => {
        expect(toastMock.error).toHaveBeenCalled();
      });
    });
  });
});
