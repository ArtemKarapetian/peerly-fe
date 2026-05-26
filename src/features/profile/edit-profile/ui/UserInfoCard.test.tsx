import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { UserInfoCard } from "./UserInfoCard";

const { useRoleMock, useAuthMock, refreshMeMock, updateMyNameMock, toastSuccess, toastError } =
  vi.hoisted(() => ({
    useRoleMock: vi.fn(),
    useAuthMock: vi.fn(),
    refreshMeMock: vi.fn(),
    updateMyNameMock: vi.fn(),
    toastSuccess: vi.fn(),
    toastError: vi.fn(),
  }));

vi.mock("@/entities/user", () => ({
  useRole: useRoleMock,
  useAuth: useAuthMock,
}));

vi.mock("sonner", () => ({
  toast: { success: toastSuccess, error: toastError },
}));

beforeEach(() => {
  useRoleMock.mockReturnValue({ currentRole: "Student", setRole: vi.fn() });
  refreshMeMock.mockResolvedValue(undefined);
  updateMyNameMock.mockResolvedValue(undefined);
  toastSuccess.mockReset();
  toastError.mockReset();
  useAuthMock.mockReturnValue({
    session: { userId: "u-1", userName: "Alice", email: "alice@x.com", role: "Student" },
    refreshMe: refreshMeMock,
    updateMyName: updateMyNameMock,
  });
});

describe("UserInfoCard", () => {
  it("renders the user's name and email", () => {
    render(<UserInfoCard />);
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByDisplayValue("alice@x.com")).toBeInTheDocument();
  });

  it("calls refreshMe on mount to pick up server-side changes", () => {
    render(<UserInfoCard />);
    expect(refreshMeMock).toHaveBeenCalled();
  });

  it("falls back to email when userName is empty", () => {
    useAuthMock.mockReturnValueOnce({
      session: { userId: "u-1", userName: "", email: "bob@x.com", role: "Student" },
      refreshMe: refreshMeMock,
      updateMyName: updateMyNameMock,
    });
    render(<UserInfoCard />);
    expect(screen.getAllByText("bob@x.com").length).toBeGreaterThan(0);
  });

  it("enters edit mode and saves a new name via updateMyName", async () => {
    const user = userEvent.setup();
    render(<UserInfoCard />);

    await user.click(screen.getByRole("button", { name: /common\.edit/i }));
    const input = screen.getByDisplayValue("Alice");
    await user.clear(input);
    await user.type(input, "Alice Cooper");
    await user.click(screen.getByRole("button", { name: /common\.save/i }));

    await waitFor(() => expect(updateMyNameMock).toHaveBeenCalledWith("Alice Cooper"));
    expect(toastSuccess).toHaveBeenCalled();
  });

  it("does not save when name is unchanged or empty", async () => {
    const user = userEvent.setup();
    render(<UserInfoCard />);

    await user.click(screen.getByRole("button", { name: /common\.edit/i }));
    const save = screen.getByRole("button", { name: /common\.save/i });
    expect(save).toBeDisabled();

    const input = screen.getByDisplayValue("Alice");
    await user.clear(input);
    expect(save).toBeDisabled();
  });

  it("shows an error toast when updateMyName fails", async () => {
    updateMyNameMock.mockRejectedValueOnce(new Error("boom"));
    const user = userEvent.setup();
    render(<UserInfoCard />);

    await user.click(screen.getByRole("button", { name: /common\.edit/i }));
    const input = screen.getByDisplayValue("Alice");
    await user.clear(input);
    await user.type(input, "X");
    await user.click(screen.getByRole("button", { name: /common\.save/i }));

    await waitFor(() => expect(toastError).toHaveBeenCalled());
  });
});
