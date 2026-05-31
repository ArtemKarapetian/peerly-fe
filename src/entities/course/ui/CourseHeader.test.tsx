import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CourseHeader } from "./CourseHeader";

describe("CourseHeader", () => {
  it("renders title and description", () => {
    render(<CourseHeader title="Algebra" description="Intro" />);
    expect(screen.getByRole("heading", { name: "Algebra" })).toBeInTheDocument();
    expect(screen.getByText("Intro")).toBeInTheDocument();
  });

  it("renders teacher chip with two-letter initials from first + last word", () => {
    render(
      <CourseHeader title="Math" teachers={[{ id: "1", name: "Anna Petrova", email: "a@x" }]} />,
    );
    expect(screen.getByText("AP")).toBeInTheDocument();
    expect(screen.getByText("Anna Petrova")).toBeInTheDocument();
  });

  it("falls back to first two chars when only one word is given", () => {
    render(<CourseHeader title="Math" teachers={[{ id: "1", name: "Anya", email: "a@x" }]} />);
    expect(screen.getByText("AN")).toBeInTheDocument();
  });
});
