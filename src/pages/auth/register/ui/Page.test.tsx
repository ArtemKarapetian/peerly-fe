import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { renderWithProviders } from "@/test/renderWithProviders";

import RegisterPage from "./Page";

const { registerMock, navigateMock, toastMock } = vi.hoisted(() => ({
  registerMock: vi.fn(),
  navigateMock: vi.fn(),
  toastMock: { success: vi.fn(), error: vi.fn() },
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    i18n: { language: "en" },
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

vi.mock("@/entities/user", async () => {
  const actual = await vi.importActual<typeof import("@/entities/user")>("@/entities/user");
  return {
    ...actual,
    useAuth: () => ({
      isAuthenticated: false,
      session: null,
      user: null,
      register: registerMock,
      login: vi.fn(),
      logout: vi.fn(),
      switchRoleDev: vi.fn(),
    }),
  };
});

vi.mock("sonner", () => ({
  toast: toastMock,
}));

const STRONG = "Tr0ub4dor&3xZ";

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByPlaceholderText("Ivan"), "Ivan");
  await user.type(screen.getByPlaceholderText("Petrov"), "Petrov");
  await user.type(screen.getByPlaceholderText("ivan.petrov@university.edu"), "ivan@example.com");
  await user.type(screen.getByLabelText("Password"), STRONG);
  await user.type(screen.getByLabelText("Confirm Password"), STRONG);
}

beforeEach(() => {
  localStorage.clear();
  registerMock.mockReset();
  navigateMock.mockReset();
  toastMock.success.mockReset();
  toastMock.error.mockReset();
});

describe("RegisterPage validation", () => {
  it("keeps the submit button disabled until the form is fully valid", async () => {
    const user = userEvent.setup();
    renderWithProviders(<RegisterPage />);

    const submit = screen.getByRole("button", { name: /Create Account/i });
    expect(submit).toBeDisabled();

    await fillValidForm(user);

    await waitFor(() => expect(submit).not.toBeDisabled());
  });

  it("flags an invalid email after blur", async () => {
    const user = userEvent.setup();
    renderWithProviders(<RegisterPage />);

    await user.type(screen.getByPlaceholderText("ivan.petrov@university.edu"), "not-an-email");
    await user.tab();

    expect(await screen.findByText("Invalid email")).toBeInTheDocument();
  });

  it("shows a required-field error on the first name field when left empty", async () => {
    const user = userEvent.setup();
    renderWithProviders(<RegisterPage />);

    await user.click(screen.getByPlaceholderText("Ivan"));
    await user.tab();

    expect(await screen.findByText("Enter first name")).toBeInTheDocument();
  });

  it("clears the first-name error once a value is typed", async () => {
    const user = userEvent.setup();
    renderWithProviders(<RegisterPage />);

    const firstNameInput = screen.getByPlaceholderText("Ivan");
    await user.click(firstNameInput);
    await user.tab();
    await screen.findByText("Enter first name");

    await user.type(firstNameInput, "Ivan");
    await waitFor(() => {
      expect(screen.queryByText("Enter first name")).not.toBeInTheDocument();
    });
  });

  it("reports mismatched passwords against the password field", async () => {
    const user = userEvent.setup();
    renderWithProviders(<RegisterPage />);

    await user.type(screen.getByLabelText("Password"), STRONG);
    await user.type(screen.getByLabelText("Confirm Password"), "different-pass-9!");
    await user.tab();

    expect(await screen.findByText("Passwords don't match")).toBeInTheDocument();
  });
});

describe("RegisterPage submission", () => {
  it("does not call register when the form is empty", async () => {
    const user = userEvent.setup();
    renderWithProviders(<RegisterPage />);

    const submit = screen.getByRole("button", { name: /Create Account/i });
    expect(submit).toBeDisabled();
    await user.click(submit);

    expect(registerMock).not.toHaveBeenCalled();
  });

  it("submits trimmed/lowercased credentials and the selected role", async () => {
    const user = userEvent.setup();
    registerMock.mockResolvedValueOnce({ userId: "u-1" });
    renderWithProviders(<RegisterPage />);

    await fillValidForm(user);
    const submit = screen.getByRole("button", { name: /Create Account/i });
    await waitFor(() => expect(submit).not.toBeDisabled());
    await user.click(submit);

    await waitFor(() => {
      expect(registerMock).toHaveBeenCalledWith({
        email: "ivan@example.com",
        password: STRONG,
        name: "Ivan Petrov",
        role: "Student",
      });
    });
  });

  it("after a successful register stores the pending email and navigates to /verify-email", async () => {
    const user = userEvent.setup();
    registerMock.mockResolvedValueOnce({ userId: "u-1" });
    renderWithProviders(<RegisterPage />);

    await fillValidForm(user);
    const submit = screen.getByRole("button", { name: /Create Account/i });
    await waitFor(() => expect(submit).not.toBeDisabled());
    await user.click(submit);

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith("/verify-email");
    });
    expect(localStorage.getItem("peerly_pending_verification_email")).toBe("ivan@example.com");
    expect(toastMock.success).toHaveBeenCalled();
  });

  it("does not navigate or store anything when register throws", async () => {
    const user = userEvent.setup();
    registerMock.mockRejectedValueOnce(new Error("Email taken"));
    renderWithProviders(<RegisterPage />);

    await fillValidForm(user);
    const submit = screen.getByRole("button", { name: /Create Account/i });
    await waitFor(() => expect(submit).not.toBeDisabled());
    await user.click(submit);

    await waitFor(() => {
      expect(registerMock).toHaveBeenCalled();
    });
    expect(navigateMock).not.toHaveBeenCalled();
    expect(localStorage.getItem("peerly_pending_verification_email")).toBeNull();
  });
});

describe("RegisterPage navigation", () => {
  it("links to the sign-in page", () => {
    renderWithProviders(<RegisterPage />);
    expect(screen.getByText("Sign In").closest("a")).toHaveAttribute("href", "/login");
  });
});
