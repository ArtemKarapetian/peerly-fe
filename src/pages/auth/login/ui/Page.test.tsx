import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { renderWithProviders } from "@/test/renderWithProviders";

import LoginPage from "./Page";

// Mock i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "auth.login": "Sign In",
        "auth.loginSubtitle": "Enter your credentials",
        "auth.emailOrUsername": "Email or Username",
        "auth.password": "Password",
        "auth.signIn": "Sign In",
        "auth.loggingIn": "Signing in...",
        "auth.requiredField": "This field is required",
        "auth.invalidCredentials": "Invalid credentials",
        "auth.noAccount": "Don't have an account?",
        "auth.createAccount": "Create Account",
        "auth.demoCredentials": "demo / demo123",
        "auth.forgotPassword": "Forgot password?",
      };
      return translations[key] ?? key;
    },
  }),
}));

// Mock PublicLayout to simplify rendering
vi.mock("@/widgets/public-layout", () => ({
  PublicLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe("LoginPage", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    localStorage.clear();
  });

  it("renders login form with heading and inputs", () => {
    renderWithProviders(<LoginPage />);

    expect(screen.getByRole("heading", { name: "Sign In" })).toBeInTheDocument();
    expect(screen.getByText("Email or Username")).toBeInTheDocument();
    expect(screen.getByText("Password")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("demo or demo@example.com")).toBeInTheDocument();
  });

  it("submit button is disabled when fields are empty", () => {
    renderWithProviders(<LoginPage />);

    const submitButton = screen.getByRole("button", { name: "Sign In" });
    expect(submitButton).toBeDisabled();
  });

  it("enables submit button when both fields are filled", async () => {
    renderWithProviders(<LoginPage />);

    await user.type(screen.getByPlaceholderText("demo or demo@example.com"), "demo");
    await user.type(screen.getByPlaceholderText("••••••••"), "demo123");

    const submitButton = screen.getByRole("button", { name: "Sign In" });
    expect(submitButton).toBeEnabled();
  });

  it("shows validation error on blur of empty field", async () => {
    renderWithProviders(<LoginPage />);

    const identifierInput = screen.getByPlaceholderText("demo or demo@example.com");
    await user.click(identifierInput);
    await user.tab(); // blur

    await waitFor(() => {
      expect(screen.getByText("This field is required")).toBeInTheDocument();
    });
  });

  it("shows link to registration page", () => {
    renderWithProviders(<LoginPage />);

    const registerLink = screen.getByText("Create Account");
    expect(registerLink).toBeInTheDocument();
    expect(registerLink.closest("a")).toHaveAttribute("href", "/register");
  });

  it("shows demo credentials hint", () => {
    renderWithProviders(<LoginPage />);
    expect(screen.getByText(/demo \/ demo123/)).toBeInTheDocument();
  });
});
