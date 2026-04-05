import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { renderWithProviders } from "@/test/renderWithProviders";

import RegisterPage from "./Page";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, opts?: Record<string, unknown>) => {
      const translations: Record<string, string> = {
        "auth.register": "Create Account",
        "auth.registerSubtitle": "Fill in details below",
        "auth.firstName": "First Name",
        "auth.lastName": "Last Name",
        "auth.firstNamePlaceholder": "Ivan",
        "auth.lastNamePlaceholder": "Petrov",
        "auth.username": "Username",
        "auth.password": "Password",
        "auth.confirmPassword": "Confirm Password",
        "auth.createAccount": "Create Account",
        "auth.creating": "Creating...",
        "auth.alreadyHaveAccount": "Already have an account?",
        "auth.signIn": "Sign In",
        "auth.agreeWith": "By registering you agree to",
        "auth.termsOfUse": "Terms of Use",
        "auth.enterEmail": "Enter email",
        "auth.invalidEmail": "Invalid email",
        "auth.emailTaken": "Email taken",
        "auth.enterUsername": "Enter username",
        "auth.usernameTaken": "Username taken",
        "auth.usernameChars": "Only letters, numbers, dots, hyphens",
        "auth.enterPassword": "Enter password",
        "auth.repeatPassword": "Repeat password",
        "auth.passwordsDontMatch": "Passwords don't match",
        "auth.accountCreated": "Account created!",
        "auth.canLoginNow": "You can login now",
      };
      if (key === "auth.minChars" && opts?.count) return `Min ${String(opts.count)} characters`;
      return translations[key] ?? key;
    },
  }),
}));

vi.mock("@/widgets/public-layout", () => ({
  PublicLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

beforeEach(() => {
  localStorage.clear();
});

describe("RegisterPage", () => {
  it("renders form with heading and all input fields", () => {
    renderWithProviders(<RegisterPage />);

    expect(screen.getByRole("heading", { name: /Create Account/i })).toBeInTheDocument();

    // First name / Last name placeholders come from translation keys
    expect(screen.getByPlaceholderText("Ivan")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Petrov")).toBeInTheDocument();
    // Email placeholder is hardcoded in the component
    expect(screen.getByPlaceholderText("ivan.petrov@university.edu")).toBeInTheDocument();
    // Username placeholder is hardcoded
    expect(screen.getByPlaceholderText("ivan.petrov")).toBeInTheDocument();
    // Password placeholders are bullet characters
    expect(screen.getAllByPlaceholderText("••••••••").length).toBe(2);
  });

  it("has submit button disabled initially", () => {
    renderWithProviders(<RegisterPage />);

    const submitButton = screen.getByRole("button", {
      name: /Create Account/i,
    });
    expect(submitButton).toBeDisabled();
  });

  it("shows email validation error on invalid email after blur", async () => {
    const user = userEvent.setup();
    renderWithProviders(<RegisterPage />);

    const emailInput = screen.getByPlaceholderText("ivan.petrov@university.edu");
    await user.type(emailInput, "not-an-email");
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText("Invalid email")).toBeInTheDocument();
    });
  });

  it("shows username minimum length error after blur", async () => {
    const user = userEvent.setup();
    renderWithProviders(<RegisterPage />);

    const usernameInput = screen.getByPlaceholderText("ivan.petrov");
    await user.type(usernameInput, "ab");
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText("Min 3 characters")).toBeInTheDocument();
    });
  });

  it("shows passwords don't match error", async () => {
    const user = userEvent.setup();
    renderWithProviders(<RegisterPage />);

    const passwordInputs = screen.getAllByPlaceholderText("••••••••");
    const passwordInput = passwordInputs[0];
    const confirmInput = passwordInputs[1];

    await user.type(passwordInput, "password123");
    await user.type(confirmInput, "different123");
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText("Passwords don't match")).toBeInTheDocument();
    });
  });

  it("has link to login page with correct href", () => {
    renderWithProviders(<RegisterPage />);

    const signInLink = screen.getByText("Sign In");
    expect(signInLink.closest("a")).toHaveAttribute("href", "/login");
  });
});
