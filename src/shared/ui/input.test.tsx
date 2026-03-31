import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { Input, PasswordInput } from "./input";

describe("Input", () => {
  it("renders with label", () => {
    render(<Input label="Email" />);
    expect(screen.getByText("Email")).toBeDefined();
  });

  it("renders with placeholder", () => {
    render(<Input placeholder="Enter email" />);
    expect(screen.getByPlaceholderText("Enter email")).toBeDefined();
  });

  it("shows error message when error prop is provided", () => {
    render(<Input error="This field is required" />);
    expect(screen.getByText("This field is required")).toBeDefined();
  });

  it("shows helper text when no error", () => {
    render(<Input helperText="Some helpful text" />);
    expect(screen.getByText("Some helpful text")).toBeDefined();
  });

  it("does not show helper text when error is present", () => {
    render(<Input error="Error!" helperText="Some helpful text" />);
    expect(screen.queryByText("Some helpful text")).toBeNull();
    expect(screen.getByText("Error!")).toBeDefined();
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

  it("toggles to text type when show button is clicked", () => {
    render(<PasswordInput />);
    const toggleButton = document.querySelector('button[tabindex="-1"]');
    expect(toggleButton).not.toBeNull();
    fireEvent.click(toggleButton!);
    const input = document.querySelector('input[type="text"]');
    expect(input).not.toBeNull();
  });

  it("toggles back to password type on second click", () => {
    render(<PasswordInput />);
    const toggleButton = document.querySelector('button[tabindex="-1"]');
    fireEvent.click(toggleButton!);
    fireEvent.click(toggleButton!);
    const input = document.querySelector('input[type="password"]');
    expect(input).not.toBeNull();
  });

  it("shows error message", () => {
    render(<PasswordInput error="Password too short" />);
    expect(screen.getByText("Password too short")).toBeDefined();
  });

  it("shows helper text", () => {
    render(<PasswordInput helperText="At least 8 characters" />);
    expect(screen.getByText("At least 8 characters")).toBeDefined();
  });
});
