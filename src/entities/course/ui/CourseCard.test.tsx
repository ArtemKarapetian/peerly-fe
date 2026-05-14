import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { CourseCard } from "./CourseCard";

describe("CourseCard", () => {
  it("renders the title and teacher", () => {
    render(<CourseCard id="c-1" title="Algorithms 101" teacher="Prof X" />);
    expect(screen.getByText("Algorithms 101")).toBeInTheDocument();
    expect(screen.getByText("Prof X")).toBeInTheDocument();
  });

  it("renders the completed state", () => {
    render(<CourseCard id="c-1" title="Done Course" status="completed" progress={50} />);
    expect(screen.getByText(/entity\.course\.completed/)).toBeInTheDocument();
  });

  it("invokes onClick when clicking the card", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<CourseCard id="c-1" title="Some" onClick={onClick} />);
    await user.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
