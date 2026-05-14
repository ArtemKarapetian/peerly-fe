import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { PageHeader } from "./PageHeader";

describe("PageHeader", () => {
  it("renders the title in an h1 tag", () => {
    render(<PageHeader title="Dashboard" />);
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1).toHaveTextContent("Dashboard");
  });

  it("renders subtitle when provided", () => {
    render(<PageHeader title="Title" subtitle="Subtitle text" />);
    expect(screen.getByText("Subtitle text")).toBeInTheDocument();
  });

  it("does not render a subtitle paragraph when subtitle is omitted", () => {
    const { container } = render(<PageHeader title="Title" />);
    expect(container.querySelector("p")).toBeNull();
  });

  it("renders action node when provided", () => {
    render(<PageHeader title="Title" action={<button data-testid="action-btn">Do it</button>} />);
    expect(screen.getByTestId("action-btn")).toBeInTheDocument();
  });

  it("does not render an action wrapper when action is omitted", () => {
    render(<PageHeader title="Title" />);
    expect(screen.queryByRole("button")).toBeNull();
  });
});
