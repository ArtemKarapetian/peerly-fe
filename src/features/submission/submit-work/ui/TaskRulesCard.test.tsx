import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { TaskRulesCard } from "./TaskRulesCard";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe("TaskRulesCard", () => {
  it("renders the deadline", () => {
    render(<TaskRulesCard rules={{ deadline: "31 May 2026, 23:59", isDeadlinePassed: false }} />);
    expect(screen.getByText("31 May 2026, 23:59")).toBeInTheDocument();
    expect(screen.queryByText("feature.submission.rules.overdue")).not.toBeInTheDocument();
  });

  it("shows the overdue marker when the deadline has passed", () => {
    render(<TaskRulesCard rules={{ deadline: "1 March 2026, 23:59", isDeadlinePassed: true }} />);
    expect(screen.getByText("feature.submission.rules.overdue")).toBeInTheDocument();
  });
});
