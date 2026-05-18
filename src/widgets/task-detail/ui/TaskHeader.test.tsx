import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { TaskHeader } from "./TaskHeader";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key, i18n: { language: "en" } }),
}));

const ONE_DAY = 24 * 60 * 60 * 1000;

function renderHeader(
  overrides: Partial<React.ComponentProps<typeof TaskHeader>> = {},
): HTMLElement {
  const { container } = render(
    <TaskHeader
      title="T"
      courseName="C"
      statusLabel="Status"
      statusColor="bg-muted"
      {...overrides}
    />,
  );
  return container;
}

describe("TaskHeader urgency", () => {
  it("renders deadline in muted color when far in the future", () => {
    const future = new Date(Date.now() + 7 * ONE_DAY);
    renderHeader({ deadline: future });
    const span = screen.getByText(/student\.task\.deadline/);
    expect(span.className).toMatch(/text-muted-foreground/);
    expect(span.className).not.toMatch(/text-warning/);
    expect(span.className).not.toMatch(/text-destructive/);
  });

  it("renders deadline in warning color when less than 2 days away", () => {
    const soon = new Date(Date.now() + ONE_DAY);
    renderHeader({ deadline: soon });
    const span = screen.getByText(/student\.task\.deadline/);
    expect(span.className).toMatch(/text-warning/);
  });

  it("renders deadline in destructive color when already passed", () => {
    const past = new Date(Date.now() - ONE_DAY);
    renderHeader({ deadline: past });
    const span = screen.getByText(/student\.task\.deadline/);
    expect(span.className).toMatch(/text-destructive/);
  });

  it("renders reviewDeadline in warning color when less than 2 days away", () => {
    const reviewSoon = new Date(Date.now() + ONE_DAY);
    renderHeader({ reviewDeadline: reviewSoon });
    const span = screen.getByText(/student\.task\.reviewDeadline/);
    expect(span.className).toMatch(/text-warning/);
  });

  it("renders reviewDeadline in destructive color when already passed", () => {
    const reviewPast = new Date(Date.now() - 5 * ONE_DAY);
    renderHeader({ reviewDeadline: reviewPast });
    const span = screen.getByText(/student\.task\.reviewDeadline/);
    expect(span.className).toMatch(/text-destructive/);
  });

  it("does not render either deadline block when both are absent", () => {
    renderHeader();
    expect(screen.queryByText(/student\.task\.deadline/)).not.toBeInTheDocument();
    expect(screen.queryByText(/student\.task\.reviewDeadline/)).not.toBeInTheDocument();
  });

  it("renders the reviewers count only when reviewCount is positive", () => {
    renderHeader({ reviewCount: 3 });
    expect(screen.getByText(/student\.task\.reviewers/)).toBeInTheDocument();
  });

  it("renders title, courseName and statusLabel", () => {
    renderHeader({ title: "Lab 1", courseName: "Algorithms", statusLabel: "In review" });
    expect(screen.getByText("Lab 1")).toBeInTheDocument();
    expect(screen.getByText("Algorithms")).toBeInTheDocument();
    expect(screen.getByText("In review")).toBeInTheDocument();
  });
});
