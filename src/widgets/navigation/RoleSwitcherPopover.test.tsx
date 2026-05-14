import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { RoleSwitcherPopover } from "./RoleSwitcherPopover";

const { useRoleMock, setRoleMock } = vi.hoisted(() => ({
  useRoleMock: vi.fn(),
  setRoleMock: vi.fn(),
}));

vi.mock("@/entities/user", () => ({
  useRole: useRoleMock,
}));

beforeEach(() => {
  setRoleMock.mockReset();
  useRoleMock.mockReturnValue({ currentRole: "Student", setRole: setRoleMock });
});

describe("RoleSwitcherPopover", () => {
  it("renders the expanded inline list when collapsed=false", () => {
    render(<RoleSwitcherPopover collapsed={false} />);
    expect(screen.getByText(/roles\.demoRole/)).toBeInTheDocument();
    expect(screen.getByText(/roles\.student/)).toBeInTheDocument();
    expect(screen.getByText(/roles\.teacher/)).toBeInTheDocument();
    expect(screen.getByText(/roles\.admin/)).toBeInTheDocument();
  });

  it("renders the collapsed circle button by default", () => {
    render(<RoleSwitcherPopover />);
    expect(screen.getByRole("button", { name: /roles\.switchRole/ })).toBeInTheDocument();
  });

  it("opens the popover and calls setRole on selecting a role", async () => {
    const user = userEvent.setup();
    render(<RoleSwitcherPopover />);
    await user.click(screen.getByRole("button", { name: /roles\.switchRole/ }));
    await user.click(screen.getByText(/roles\.teacher/));
    expect(setRoleMock).toHaveBeenCalledWith("Teacher");
  });
});
