import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import { ApiError } from "@/shared/api";

import { ErrorBanner } from "./ErrorBanner";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe("ErrorBanner", () => {
  it("renders error message", () => {
    render(<ErrorBanner message="Something went wrong" />);
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("shows retry button when onRetry is provided", () => {
    render(<ErrorBanner message="Error" onRetry={() => {}} />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("does not show retry button when onRetry is undefined", () => {
    render(<ErrorBanner message="Error" />);
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("calls onRetry when retry button is clicked", () => {
    const handleRetry = vi.fn();
    render(<ErrorBanner message="Error" onRetry={handleRetry} />);
    fireEvent.click(screen.getByRole("button"));
    expect(handleRetry).toHaveBeenCalledTimes(1);
  });

  it("humanizes a ProblemDetails ApiError and hides the raw HTTP status", () => {
    const err = new ApiError(
      400,
      {
        title: "Bad Request",
        errors: { "*": ["Validation failed: \n -- Name must not be empty. Severity: Error"] },
      },
      "HTTP 400: /foo",
    );
    render(<ErrorBanner error={err} />);
    expect(screen.getByText(/Name must not be empty/)).toBeInTheDocument();
    expect(screen.queryByText(/HTTP 400/)).toBeNull();
  });
});
