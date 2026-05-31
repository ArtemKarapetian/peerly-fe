import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { CourseTabsBar } from "./CourseTabsBar";

const TABS = [
  { key: "assignments" as const, label: "Assignments" },
  { key: "participants" as const, label: "Participants" },
  { key: "settings" as const, label: "Settings" },
];

describe("CourseTabsBar", () => {
  it("renders all tab labels", () => {
    render(<CourseTabsBar tabs={TABS} activeTab="assignments" onChange={vi.fn()} />);
    expect(screen.getByText("Assignments")).toBeInTheDocument();
    expect(screen.getByText("Participants")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  it("marks the active tab with the primary color class", () => {
    render(<CourseTabsBar tabs={TABS} activeTab="participants" onChange={vi.fn()} />);
    const active = screen.getByRole("button", { name: "Participants" });
    expect(active.className).toMatch(/text-brand-primary/);
  });

  it("calls onChange when a tab is clicked", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<CourseTabsBar tabs={TABS} activeTab="assignments" onChange={onChange} />);

    await user.click(screen.getByText("Settings"));
    expect(onChange).toHaveBeenCalledWith("settings");
  });
});
