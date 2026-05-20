import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ReviewFilters } from "./ReviewFilters";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const map: Record<string, string> = {
        "widget.reviewFilters.all": "All",
        "widget.reviewFilters.notStarted": "Not started",
        "widget.reviewFilters.submitted": "Submitted",
        "widget.reviewFilters.groupLabel": "Review filter",
      };
      return map[key] ?? key;
    },
    i18n: { language: "en" },
  }),
}));

const counts = { all: 5, notStarted: 3, submitted: 2 };

describe("ReviewFilters", () => {
  it("exposes one pressed button matching the active filter", () => {
    render(<ReviewFilters filter="not_started" counts={counts} onFilterChange={() => {}} />);

    const pressed = screen.getAllByRole("button", { pressed: true });
    expect(pressed).toHaveLength(1);
    expect(pressed[0]).toHaveTextContent(/Not started/);
  });

  it("shows count next to each filter", () => {
    render(<ReviewFilters filter="all" counts={counts} onFilterChange={() => {}} />);

    expect(screen.getByRole("button", { name: /All \(5\)/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Not started \(3\)/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Submitted \(2\)/ })).toBeInTheDocument();
  });

  it("calls onFilterChange with the chosen value", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<ReviewFilters filter="all" counts={counts} onFilterChange={onChange} />);

    await user.click(screen.getByRole("button", { name: /Submitted/ }));
    expect(onChange).toHaveBeenCalledWith("submitted");
  });

  it("does not re-invoke onFilterChange when clicking the already-active button", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<ReviewFilters filter="all" counts={counts} onFilterChange={onChange} />);

    await user.click(screen.getByRole("button", { pressed: true }));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith("all");
  });

  it("wraps the buttons in a labelled group for screen readers", () => {
    render(<ReviewFilters filter="all" counts={counts} onFilterChange={() => {}} />);
    expect(screen.getByRole("group", { name: "Review filter" })).toBeInTheDocument();
  });
});
