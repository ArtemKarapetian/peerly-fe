import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";

import { Breadcrumbs } from "./Breadcrumbs";

const navigateMock = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

function renderWithRouter(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe("Breadcrumbs", () => {
  it("returns null when only one item is provided", () => {
    const { container } = renderWithRouter(<Breadcrumbs items={[{ label: "Home" }]} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders a nav with aria-label='Breadcrumb' for 2+ items", () => {
    renderWithRouter(<Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Courses" }]} />);
    expect(screen.getByRole("navigation")).toHaveAttribute("aria-label", "Breadcrumb");
  });

  it("renders linked items as buttons", () => {
    renderWithRouter(<Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Courses" }]} />);
    expect(screen.getByRole("button", { name: "Home" })).toBeInTheDocument();
  });

  it("renders the last (current) item as plain text when href is absent", () => {
    renderWithRouter(<Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Courses" }]} />);
    expect(screen.queryByRole("button", { name: "Courses" })).toBeNull();
    expect(screen.getByText("Courses")).toBeInTheDocument();
  });

  it("clicking a linked item calls navigate with the href", () => {
    navigateMock.mockClear();
    renderWithRouter(
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Courses", href: "/courses" },
          { label: "Math" },
        ]}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Courses" }));
    expect(navigateMock).toHaveBeenCalledWith("/courses");
  });

  it("strips a leading '#' from href when navigating", () => {
    navigateMock.mockClear();
    renderWithRouter(<Breadcrumbs items={[{ label: "Home", href: "#/x" }, { label: "Cur" }]} />);
    fireEvent.click(screen.getByRole("button", { name: "Home" }));
    expect(navigateMock).toHaveBeenCalledWith("/x");
  });
});
