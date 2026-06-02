import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { Input, PasswordInput } from "./input";

describe("Input", () => {
  it("renders with label", () => {
    render(<Input label="Email" />);
    expect(screen.getByText("Email")).toBeInTheDocument();
  });

  it("renders with placeholder", () => {
    render(<Input placeholder="Enter email" />);
    expect(screen.getByPlaceholderText("Enter email")).toBeInTheDocument();
  });

  it("shows error message when error prop is provided", () => {
    render(<Input error="This field is required" />);
    expect(screen.getByText("This field is required")).toBeInTheDocument();
  });

  it("shows helper text when no error", () => {
    render(<Input helperText="Some helpful text" />);
    expect(screen.getByText("Some helpful text")).toBeInTheDocument();
  });

  it("does not show helper text when error is present", () => {
    render(<Input error="Error!" helperText="Some helpful text" />);
    expect(screen.queryByText("Some helpful text")).toBeNull();
    expect(screen.getByText("Error!")).toBeInTheDocument();
  });

  it("applies error styling when error prop is set", () => {
    render(<Input error="Bad value" />);
    const input = screen.getByRole("textbox");
    expect(input.className).toMatch(/error|border-red|destructive/);
  });

  it("is disabled when disabled prop is true", () => {
    render(<Input disabled />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveProperty("disabled", true);
  });
});

describe("PasswordInput", () => {
  it("renders as password type by default", () => {
    render(<PasswordInput />);
    const input = document.querySelector('input[type="password"]');
    expect(input).not.toBeNull();
  });

  it("toggles to text type when the show-password button is clicked", () => {
    render(<PasswordInput />);
    fireEvent.click(screen.getByRole("button", { name: /feature\.auth\.showPassword/i }));
    expect(document.querySelector('input[type="text"]')).not.toBeNull();
  });

  it("toggles back to password type on the second click", () => {
    render(<PasswordInput />);
    fireEvent.click(screen.getByRole("button", { name: /feature\.auth\.showPassword/i }));
    fireEvent.click(screen.getByRole("button", { name: /feature\.auth\.hidePassword/i }));
    expect(document.querySelector('input[type="password"]')).not.toBeNull();
  });

  it("shows error message", () => {
    render(<PasswordInput error="Password too short" />);
    expect(screen.getByText("Password too short")).toBeInTheDocument();
  });

  it("shows helper text", () => {
    render(<PasswordInput helperText="At least 8 characters" />);
    expect(screen.getByText("At least 8 characters")).toBeInTheDocument();
  });
});
