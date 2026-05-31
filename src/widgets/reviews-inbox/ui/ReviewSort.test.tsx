import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ReviewSort } from "./ReviewSort";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key, i18n: { language: "en" } }),
}));

describe("ReviewSort", () => {
  it("renders the by-deadline label", () => {
    render(<ReviewSort direction="asc" onToggle={() => {}} />);
    expect(screen.getByText("widget.reviewSort.byDeadline")).toBeInTheDocument();
  });

  it("shows the up arrow when ascending", () => {
    const { container } = render(<ReviewSort direction="asc" onToggle={() => {}} />);
    const icons = container.querySelectorAll("svg");
    expect(icons).toHaveLength(1);
    expect(icons[0]!.classList.contains("lucide-arrow-up")).toBe(true);
  });

  it("shows the down arrow when descending", () => {
    const { container } = render(<ReviewSort direction="desc" onToggle={() => {}} />);
    const icons = container.querySelectorAll("svg");
    expect(icons[0]!.classList.contains("lucide-arrow-down")).toBe(true);
  });

  it("calls onToggle when clicked", () => {
    const onToggle = vi.fn();
    render(<ReviewSort direction="asc" onToggle={onToggle} />);
    fireEvent.click(screen.getByRole("button"));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it("exposes an aria-label for accessibility", () => {
    render(<ReviewSort direction="asc" onToggle={() => {}} />);
    expect(screen.getByRole("button", { name: "widget.reviewSort.aria" })).toBeInTheDocument();
  });
});
