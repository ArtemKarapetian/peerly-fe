import { render, screen } from "@testing-library/react";
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

  it("renders inputs as disabled (no editing)", () => {
    render(<UserInfoCard />);
    expect(screen.getByDisplayValue("Alice")).toBeDisabled();
    expect(screen.getByDisplayValue("alice@x.com")).toBeDisabled();
  });

  it("does not render an edit button", () => {
    render(<UserInfoCard />);
    expect(screen.queryByRole("button", { name: /common\.edit/ })).not.toBeInTheDocument();
  });

  it("falls back to email when userName is empty", () => {
    getSessionMock.mockReturnValueOnce({ userName: "", email: "bob@x.com" });
    render(<UserInfoCard />);
    expect(screen.getAllByText("bob@x.com").length).toBeGreaterThan(0);
  });
});
