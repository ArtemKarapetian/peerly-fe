import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import { TaskSidebar } from "./TaskSidebar";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

function renderSidebar(props: { hasSubmission: boolean; isDeadlinePassed: boolean }) {
  return render(
    <MemoryRouter>
      <TaskSidebar courseId="c-1" taskId="t-1" {...props} />
    </MemoryRouter>,
  );
}

describe("TaskSidebar", () => {
  it("renders the submit button when no submission and deadline is open", () => {
    renderSidebar({ hasSubmission: false, isDeadlinePassed: false });
    expect(screen.getByRole("button", { name: /student\.task\.submitWork/ })).toBeInTheDocument();
    expect(screen.queryByText(/student\.task\.deadlinePassedSidebar/)).not.toBeInTheDocument();
  });

  it("renders the deadline-passed badge instead of the submit button when overdue and no submission", () => {
    renderSidebar({ hasSubmission: false, isDeadlinePassed: true });
    expect(screen.getByText(/student\.task\.deadlinePassedSidebar/)).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /student\.task\.submitWork/ }),
    ).not.toBeInTheDocument();
  });

  it("renders the view-submission button when a submission exists, regardless of deadline", () => {
    renderSidebar({ hasSubmission: true, isDeadlinePassed: true });
    expect(
      screen.getByRole("button", { name: /student\.task\.viewSubmission/ }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/student\.task\.deadlinePassedSidebar/)).not.toBeInTheDocument();
  });

  it("renders the edit-submission button when a submission exists and deadline is open", () => {
    renderSidebar({ hasSubmission: true, isDeadlinePassed: false });
    expect(
      screen.getByRole("button", { name: /student\.task\.editSubmission/ }),
    ).toBeInTheDocument();
  });

  it("hides the edit-submission button when a submission exists but deadline has passed", () => {
    renderSidebar({ hasSubmission: true, isDeadlinePassed: true });
    expect(
      screen.queryByRole("button", { name: /student\.task\.editSubmission/ }),
    ).not.toBeInTheDocument();
  });
});
