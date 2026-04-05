import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import { ErrorBanner } from "./ErrorBanner";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe("ErrorBanner", () => {
  it("renders error message", () => {
    render(<ErrorBanner message="Something went wrong" />);
    expect(screen.getByText("Something went wrong")).toBeDefined();
  });

  it("shows retry button when onRetry is provided", () => {
    render(<ErrorBanner message="Error" onRetry={() => {}} />);
    expect(screen.getByRole("button")).toBeDefined();
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
});
