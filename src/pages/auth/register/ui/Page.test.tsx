import { fireEvent, screen, waitFor } from "@testing-library/react";
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
        "auth.password": "Password",
        "auth.confirmPassword": "Confirm Password",
        "auth.createAccount": "Create Account",
        "auth.creating": "Creating...",
        "auth.alreadyHaveAccount": "Already have an account?",
        "auth.signIn": "Sign In",
        "auth.agreeWith": "By registering you agree to",
        "auth.termsOfUse": "Terms of Use",
        "auth.enterFirstName": "Enter first name",
        "auth.enterLastName": "Enter last name",
        "auth.enterEmail": "Enter email",
        "auth.invalidEmail": "Invalid email",
        "auth.emailTaken": "Email taken",
        "auth.enterPassword": "Enter password",
        "auth.repeatPassword": "Repeat password",
        "auth.passwordsDontMatch": "Passwords don't match",
        "auth.accountCreated": "Account created!",
        "auth.canLoginNow": "You can login now",
      };
      if (key === "auth.minChars" && opts?.count !== undefined)
        return `Min ${String(opts.count as number)} characters`;
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
    expect(screen.getByPlaceholderText("Ivan")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Petrov")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("ivan.petrov@university.edu")).toBeInTheDocument();
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

  it("shows required-field error on empty first name after blur", async () => {
    const user = userEvent.setup();
    renderWithProviders(<RegisterPage />);

    const firstNameInput = screen.getByPlaceholderText("Ivan");
    await user.click(firstNameInput);
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText("Enter first name")).toBeInTheDocument();
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

  it("clears first-name error after typing a valid value", async () => {
    const user = userEvent.setup();
    renderWithProviders(<RegisterPage />);

    const firstNameInput = screen.getByPlaceholderText("Ivan");
    await user.click(firstNameInput);
    await user.tab();
    await waitFor(() => {
      expect(screen.getByText("Enter first name")).toBeInTheDocument();
    });

    await user.type(firstNameInput, "Ivan");
    await waitFor(() => {
      expect(screen.queryByText("Enter first name")).not.toBeInTheDocument();
    });
  });

  it("clears last-name error after typing a valid value", async () => {
    const user = userEvent.setup();
    renderWithProviders(<RegisterPage />);

    const lastNameInput = screen.getByPlaceholderText("Petrov");
    await user.click(lastNameInput);
    await user.tab();
    await waitFor(() => {
      expect(screen.getByText("Enter last name")).toBeInTheDocument();
    });

    await user.type(lastNameInput, "Petrov");
    await waitFor(() => {
      expect(screen.queryByText("Enter last name")).not.toBeInTheDocument();
    });
  });

  it("enables submit button only when all required fields are valid", async () => {
    const user = userEvent.setup();
    renderWithProviders(<RegisterPage />);

    const submitButton = screen.getByRole("button", { name: /Create Account/i });
    expect(submitButton).toBeDisabled();

    await user.type(screen.getByPlaceholderText("Ivan"), "Ivan");
    await user.type(screen.getByPlaceholderText("Petrov"), "Petrov");
    await user.type(screen.getByPlaceholderText("ivan.petrov@university.edu"), "ivan@example.com");
    const passwordInputs = screen.getAllByPlaceholderText("••••••••");
    await user.type(passwordInputs[0], "password123");
    await user.type(passwordInputs[1], "password123");

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });

  it("invokes submit handler on empty form without navigating away", async () => {
    renderWithProviders(<RegisterPage />);

    const submitButton = screen.getByRole("button", { name: /Create Account/i });
    const form = submitButton.closest("form")!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });
    expect(screen.getByRole("heading", { name: /Create Account/i })).toBeInTheDocument();
  });
});
