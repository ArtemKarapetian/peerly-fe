import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import { Button } from "./button";

describe("Button", () => {
  it("renders children text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: "Click me" })).toBeDefined();
  });

  it("renders with different variants", () => {
    const variants = ["primary", "secondary", "ghost", "danger", "outline"] as const;
    for (const variant of variants) {
      const { unmount } = render(<Button variant={variant}>Btn</Button>);
      expect(screen.getByRole("button", { name: "Btn" })).toBeDefined();
      unmount();
    }
  });

  it("shows loading spinner when isLoading is true", () => {
    render(<Button isLoading>Loading</Button>);
    const button = screen.getByRole("button");
    const spinner = button.querySelector(".animate-spin");
    expect(spinner).not.toBeNull();
  });

  it("is disabled when isLoading is true", () => {
    render(<Button isLoading>Loading</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveProperty("disabled", true);
  });

  it("is disabled when disabled prop is true", () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveProperty("disabled", true);
  });

  it("renders leftIcon when provided", () => {
    render(<Button leftIcon={<span data-testid="left-icon">L</span>}>With Icon</Button>);
    expect(screen.getByTestId("left-icon")).toBeDefined();
  });

  it("renders rightIcon when provided", () => {
    render(<Button rightIcon={<span data-testid="right-icon">R</span>}>With Icon</Button>);
    expect(screen.getByTestId("right-icon")).toBeDefined();
  });

  it("hides icons when isLoading", () => {
    render(
      <Button
        isLoading
        leftIcon={<span data-testid="left-icon">L</span>}
        rightIcon={<span data-testid="right-icon">R</span>}
      >
        Loading
      </Button>,
    );
    expect(screen.queryByTestId("left-icon")).toBeNull();
    expect(screen.queryByTestId("right-icon")).toBeNull();
  });

  it("calls onClick handler when clicked", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("does not call onClick when disabled", () => {
    const handleClick = vi.fn();
    render(
      <Button disabled onClick={handleClick}>
        Click
      </Button>,
    );
    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).not.toHaveBeenCalled();
  });
});
