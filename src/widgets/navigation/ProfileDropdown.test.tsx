import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ProfileDropdown } from "./ProfileDropdown";

const { useAuthMock, getSessionMock, logoutMock } = vi.hoisted(() => ({
  useAuthMock: vi.fn(),
  getSessionMock: vi.fn(),
  logoutMock: vi.fn(),
}));

vi.mock("@/entities/user", () => ({
  useAuth: useAuthMock,
}));

vi.mock("@/shared/api", () => ({
  getSession: getSessionMock,
}));

beforeEach(() => {
  logoutMock.mockReset();
  getSessionMock.mockReset();
  useAuthMock.mockReturnValue({ logout: logoutMock });
  getSessionMock.mockReturnValue({ userName: "Alice" });
});

function renderDropdown(collapsed = false) {
  return render(
    <MemoryRouter>
      <ProfileDropdown collapsed={collapsed} />
    </MemoryRouter>,
  );
}

describe("ProfileDropdown", () => {
  it("shows the user's name when expanded", () => {
    renderDropdown(false);
    expect(screen.getByText("Alice")).toBeInTheDocument();
  });

  it("opens the menu and shows menu items", async () => {
    const user = userEvent.setup();
    renderDropdown(false);
    await user.click(screen.getByRole("button", { name: /widget\.profileDropdown\.profileMenu/ }));
    expect(screen.getByText(/widget\.profileDropdown\.profile/)).toBeInTheDocument();
    expect(screen.getByText(/widget\.profileDropdown\.settings/)).toBeInTheDocument();
    expect(screen.getByText(/widget\.profileDropdown\.logout/)).toBeInTheDocument();
  });

  it("calls logout when clicking the logout item", async () => {
    const user = userEvent.setup();
    renderDropdown(false);
    await user.click(screen.getByRole("button", { name: /widget\.profileDropdown\.profileMenu/ }));
    await user.click(screen.getByText(/widget\.profileDropdown\.logout/));
    expect(logoutMock).toHaveBeenCalledTimes(1);
  });

  it("renders the collapsed avatar button when collapsed=true", () => {
    renderDropdown(true);
    expect(
      screen.getByRole("button", { name: /widget\.profileDropdown\.profileMenu/ }),
    ).toBeInTheDocument();
  });
});
