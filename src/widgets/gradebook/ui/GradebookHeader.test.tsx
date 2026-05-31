import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { GradebookHeader } from "./GradebookHeader";

function renderHeader(overrides: Partial<Parameters<typeof GradebookHeader>[0]> = {}) {
  const props = {
    stats: { total: 10, published: 7, avgPercentage: "82" },
    courses: [
      { id: "c-1", name: "Algebra" },
      { id: "c-2", name: "Geometry" },
    ],
    selectedCourse: "all",
    selectedStatus: "all",
    statusLabels: { published: "Published", draft: "Draft" },
    onCourseChange: vi.fn(),
    onStatusChange: vi.fn(),
    onReset: vi.fn(),
    ...overrides,
  };
  return { props, ...render(<GradebookHeader {...props} />) };
}

describe("GradebookHeader", () => {
  it("renders the stats block with avg and counts", () => {
    renderHeader();
    expect(screen.getByText("82%")).toBeInTheDocument();
    expect(screen.getByText("7 / 10")).toBeInTheDocument();
  });

  it("opens the course filter and triggers onCourseChange when picking one", async () => {
    const user = userEvent.setup();
    const { props } = renderHeader();
    const filterButtons = screen.getAllByRole("button");
    await user.click(filterButtons[0]!);
    await user.click(screen.getByText("Algebra"));
    expect(props.onCourseChange).toHaveBeenCalledWith("c-1");
  });

  it("shows a reset button when filters are not 'all' and calls onReset", async () => {
    const user = userEvent.setup();
    const { props } = renderHeader({ selectedCourse: "c-1" });
    const resetBtn = screen.getByText(/common\.reset/);
    await user.click(resetBtn);
    expect(props.onReset).toHaveBeenCalledTimes(1);
  });
});
