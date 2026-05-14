import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { UserInfoCard } from "./UserInfoCard";

const { useRoleMock, getSessionMock } = vi.hoisted(() => ({
  useRoleMock: vi.fn(),
  getSessionMock: vi.fn(),
}));

vi.mock("@/entities/user", () => ({
  useRole: useRoleMock,
}));

vi.mock("@/shared/api", () => ({
  getSession: getSessionMock,
}));

beforeEach(() => {
  useRoleMock.mockReturnValue({ currentRole: "Student", setRole: vi.fn() });
  getSessionMock.mockReturnValue({ userName: "Alice", email: "alice@x.com" });
});

describe("UserInfoCard", () => {
  it("renders the user's name and email", () => {
    render(<UserInfoCard />);
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByDisplayValue("alice@x.com")).toBeInTheDocument();
  });

  it("renders the edit button by default", () => {
    render(<UserInfoCard />);
    expect(screen.getByRole("button", { name: /common\.edit/ })).toBeInTheDocument();
  });

  it("enters edit mode when clicking the edit button", async () => {
    const user = userEvent.setup();
    render(<UserInfoCard />);
    await user.click(screen.getByRole("button", { name: /common\.edit/ }));
    expect(
      screen.getByRole("button", { name: /feature\.profile\.saveChanges/ }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /common\.cancel/ })).toBeInTheDocument();
  });
});
