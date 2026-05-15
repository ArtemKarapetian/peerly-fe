import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import AdminOverviewPage from "./Page";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock("@/widgets/app-shell/AppShell.tsx", () => ({
  AppShell: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe("AdminOverviewPage", () => {
  it("renders the two quick-link cards", () => {
    render(
      <MemoryRouter>
        <AdminOverviewPage />
      </MemoryRouter>,
    );

    expect(screen.getByText("admin.overviewPage.qlUsers")).toBeInTheDocument();
    expect(screen.getByText("admin.overviewPage.qlCourses")).toBeInTheDocument();
  });
});
