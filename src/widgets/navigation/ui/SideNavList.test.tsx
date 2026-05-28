import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LayoutDashboard } from "lucide-react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import type { NavItem } from "../model/navItems";

import { SideNavList } from "./SideNavList";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (k: string) => k }),
}));

const ITEMS: NavItem[] = [
  { icon: LayoutDashboard, labelKey: "nav.home", hash: "/student/dashboard" },
  { icon: LayoutDashboard, labelKey: "nav.courses", hash: "/student/courses" },
];

function renderAt(path: string, node: React.ReactElement) {
  return render(<MemoryRouter initialEntries={[path]}>{node}</MemoryRouter>);
}

describe("SideNavList", () => {
  it("renders all items by label key", () => {
    renderAt("/student/dashboard", <SideNavList items={ITEMS} collapsed={false} />);
    expect(screen.getByText("nav.home")).toBeInTheDocument();
    expect(screen.getByText("nav.courses")).toBeInTheDocument();
  });

  it("highlights the active item with primary classes", () => {
    renderAt("/student/courses", <SideNavList items={ITEMS} collapsed={false} />);
    const active = screen.getByText("nav.courses").closest("a")!;
    expect(active.className).toMatch(/brand-primary-light/);
  });

  it("calls onItemClick when an item is clicked (mobile-drawer use case)", async () => {
    const user = userEvent.setup();
    const onItemClick = vi.fn();
    renderAt(
      "/student/dashboard",
      <SideNavList items={ITEMS} collapsed={false} onItemClick={onItemClick} />,
    );

    await user.click(screen.getByText("nav.courses"));
    expect(onItemClick).toHaveBeenCalledTimes(1);
  });

  it("hides labels when collapsed", () => {
    renderAt("/student/dashboard", <SideNavList items={ITEMS} collapsed={true} />);
    expect(screen.queryByText("nav.home")).toBeNull();
  });
});
