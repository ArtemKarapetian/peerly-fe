import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { DangerZoneCard } from "./DangerZoneCard";

const logoutMock = vi.fn();

vi.mock("@/entities/user", () => ({
  useAuth: () => ({ logout: logoutMock }),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe("DangerZoneCard", () => {
  it("renders the danger-zone heading and a separate logout action", () => {
    render(<DangerZoneCard />);
    expect(screen.getByText("widget.profileDanger.title")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /widget\.profileDanger\.logout/ }),
    ).toBeInTheDocument();
  });

  it("calls logout when the button is clicked", async () => {
    const user = userEvent.setup();
    render(<DangerZoneCard />);
    await user.click(screen.getByRole("button", { name: /widget\.profileDanger\.logout/ }));
    expect(logoutMock).toHaveBeenCalledTimes(1);
  });
});
