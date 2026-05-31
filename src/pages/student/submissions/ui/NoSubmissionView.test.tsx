import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import { NoSubmissionView } from "./NoSubmissionView";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (k: string) => k }),
}));

vi.mock("@/widgets/app-shell", () => ({
  AppShell: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("@/shared/ui/Breadcrumbs.tsx", () => ({
  Breadcrumbs: () => null,
}));

const breadcrumbs = [{ label: "Home" }];

function renderInRouter(node: React.ReactElement) {
  return render(<MemoryRouter>{node}</MemoryRouter>);
}

describe("NoSubmissionView", () => {
  it("shows the submit-work CTA when deadline is not passed", () => {
    renderInRouter(
      <NoSubmissionView
        courseId="c1"
        taskId="t1"
        isDeadlinePassed={false}
        breadcrumbs={breadcrumbs}
      />,
    );

    expect(screen.getByRole("button", { name: /submitWork/ })).toBeInTheDocument();
    expect(screen.getByText(/noSubmissionsDesc/)).toBeInTheDocument();
  });

  it("hides the submit-work CTA and shows the deadline message when deadline passed", () => {
    renderInRouter(
      <NoSubmissionView courseId="c1" taskId="t1" isDeadlinePassed breadcrumbs={breadcrumbs} />,
    );

    expect(screen.queryByRole("button", { name: /submitWork/ })).toBeNull();
    expect(screen.getByText(/deadlinePassedTitle/)).toBeInTheDocument();
    expect(screen.getByText(/deadlinePassedDesc/)).toBeInTheDocument();
  });
});
